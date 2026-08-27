#!/usr/bin/env python3
"""Create deterministic, group-aware train/validation/test JSONL splits."""

from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

try:
    from .common import JsonlError, file_sha256, get_path, group_value, parse_csv_list, read_jsonl, stable_bucket, write_jsonl
except ImportError:  # pragma: no cover
    from common import JsonlError, file_sha256, get_path, group_value, parse_csv_list, read_jsonl, stable_bucket, write_jsonl


SPLITS = ("train", "validation", "test")


def split_records(
    records: list[dict[str, Any]],
    *,
    group_fields: list[str],
    seed: str,
    validation_ratio: float,
    test_ratio: float,
    evaluation_flag: str,
) -> tuple[dict[str, list[dict[str, Any]]], dict[str, str]]:
    if validation_ratio < 0 or test_ratio < 0 or validation_ratio + test_ratio >= 1:
        raise ValueError("validation and test ratios must be non-negative and sum to less than 1")
    if not group_fields:
        raise ValueError("at least one group field is required")

    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for index, record in enumerate(records, start=1):
        try:
            key = group_value(record, group_fields)
        except ValueError as exc:
            raise ValueError(f"record {record.get('id', index)!r}: {exc}") from exc
        grouped[key].append(record)

    group_assignment: dict[str, str] = {}
    split_rows: dict[str, list[dict[str, Any]]] = {name: [] for name in SPLITS}
    for key in sorted(grouped):
        rows = grouped[key]
        forced_evaluation = any(get_path(record, evaluation_flag) is True for record in rows)
        if forced_evaluation:
            split = "test"
        else:
            bucket = stable_bucket(seed, key)
            if bucket < test_ratio:
                split = "test"
            elif bucket < test_ratio + validation_ratio:
                split = "validation"
            else:
                split = "train"
        group_assignment[key] = split
        split_rows[split].extend(rows)
    return split_rows, group_assignment


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--group-fields", default="splitGroup", help="Comma-separated dotted paths combined into one group key")
    parser.add_argument("--seed", default="elch-research-v1")
    parser.add_argument("--validation-ratio", type=float, default=0.10)
    parser.add_argument("--test-ratio", type=float, default=0.10)
    parser.add_argument("--evaluation-flag", default="evaluationOnly")
    parser.add_argument("--force", action="store_true", help="Replace existing split outputs")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    destinations = {name: args.output_dir / f"{name}.jsonl" for name in SPLITS}
    manifest_path = args.output_dir / "split-manifest.json"
    existing = [path for path in [*destinations.values(), manifest_path] if path.exists()]
    if existing and not args.force:
        print(f"Refusing to replace existing outputs: {', '.join(map(str, existing))}. Pass --force explicitly.", file=sys.stderr)
        return 2
    try:
        records = [record for _, record in read_jsonl(args.input)]
        split_rows, assignments = split_records(
            records,
            group_fields=parse_csv_list(args.group_fields),
            seed=args.seed,
            validation_ratio=args.validation_ratio,
            test_ratio=args.test_ratio,
            evaluation_flag=args.evaluation_flag,
        )
    except (JsonlError, ValueError) as exc:
        print(str(exc), file=sys.stderr)
        return 1

    args.output_dir.mkdir(parents=True, exist_ok=True)
    for name, path in destinations.items():
        write_jsonl(path, split_rows[name])
    manifest = {
        "version": 1,
        "source": str(args.input),
        "sourceSha256": file_sha256(args.input),
        "seed": args.seed,
        "groupFields": parse_csv_list(args.group_fields),
        "evaluationFlag": args.evaluation_flag,
        "ratios": {"train": 1 - args.validation_ratio - args.test_ratio, "validation": args.validation_ratio, "test": args.test_ratio},
        "counts": {name: len(rows) for name, rows in split_rows.items()},
        "groupCounts": {name: sum(split == name for split in assignments.values()) for name in SPLITS},
        "outputs": {name: {"path": str(path), "sha256": file_sha256(path)} for name, path in destinations.items()},
        "groupAssignments": assignments,
    }
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())
