#!/usr/bin/env python3
"""Audit dataset splits for ID, group, exact-content, and near-duplicate leakage."""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

try:
    from .common import JsonlError, content_fingerprint, group_value, jaccard, parse_csv_list, read_jsonl, token_set
except ImportError:  # pragma: no cover
    from common import JsonlError, content_fingerprint, group_value, jaccard, parse_csv_list, read_jsonl, token_set


DEFAULT_CONTENT_FIELDS = ["instruction", "input", "expectedResponse", "prompt", "content", "request"]


def audit_splits(
    splits: dict[str, list[dict[str, Any]]],
    *,
    group_fields: list[str],
    content_fields: list[str],
    near_duplicate_threshold: float,
) -> dict[str, Any]:
    findings: list[dict[str, Any]] = []
    seen_ids: dict[str, tuple[str, Any]] = {}
    seen_groups: dict[str, tuple[str, Any]] = {}
    seen_content: dict[str, tuple[str, Any]] = {}
    entries: list[dict[str, Any]] = []

    for split_name in ("train", "validation", "test"):
        for index, record in enumerate(splits.get(split_name, []), start=1):
            record_id = record.get("id", f"{split_name}:line-{index}")
            if record.get("evaluationOnly") is True and split_name != "test":
                findings.append({"type": "EVALUATION_IN_TRAINING", "split": split_name, "id": record_id})

            if isinstance(record_id, str):
                previous = seen_ids.get(record_id)
                if previous and previous[0] != split_name:
                    findings.append({"type": "ID_OVERLAP", "leftSplit": previous[0], "rightSplit": split_name, "id": record_id})
                else:
                    seen_ids[record_id] = (split_name, record_id)

            try:
                group = group_value(record, group_fields)
            except ValueError as exc:
                findings.append({"type": "MISSING_GROUP", "split": split_name, "id": record_id, "message": str(exc)})
                group = None
            if group is not None:
                previous_group = seen_groups.get(group)
                if previous_group and previous_group[0] != split_name:
                    findings.append({"type": "GROUP_OVERLAP", "leftSplit": previous_group[0], "rightSplit": split_name, "leftId": previous_group[1], "rightId": record_id, "group": group})
                else:
                    seen_groups[group] = (split_name, record_id)

            fingerprint = content_fingerprint(record, content_fields)
            tokens = token_set(record, content_fields)
            if tokens:
                previous_content = seen_content.get(fingerprint)
                if previous_content and previous_content[0] != split_name:
                    findings.append({"type": "EXACT_CONTENT_OVERLAP", "leftSplit": previous_content[0], "rightSplit": split_name, "leftId": previous_content[1], "rightId": record_id})
                else:
                    seen_content[fingerprint] = (split_name, record_id)
                entries.append({"split": split_name, "id": record_id, "tokens": tokens, "fingerprint": fingerprint})

    if 0 < near_duplicate_threshold <= 1:
        document_frequency = Counter(token for entry in entries for token in entry["tokens"])
        index: dict[str, list[int]] = defaultdict(list)
        compared: set[tuple[int, int]] = set()
        for right_index, right in enumerate(entries):
            anchors = sorted(right["tokens"], key=lambda token: (document_frequency[token], token))[:8]
            candidates = {left_index for token in anchors for left_index in index[token]}
            for left_index in candidates:
                pair = (left_index, right_index)
                if pair in compared:
                    continue
                compared.add(pair)
                left = entries[left_index]
                if left["split"] == right["split"] or left["fingerprint"] == right["fingerprint"]:
                    continue
                score = jaccard(left["tokens"], right["tokens"])
                if score >= near_duplicate_threshold:
                    findings.append({"type": "NEAR_CONTENT_OVERLAP", "leftSplit": left["split"], "rightSplit": right["split"], "leftId": left["id"], "rightId": right["id"], "jaccard": round(score, 6)})
            for token in right["tokens"]:
                index[token].append(right_index)

    counts = {name: len(rows) for name, rows in splits.items()}
    by_type = Counter(finding["type"] for finding in findings)
    return {
        "leakageFree": not findings,
        "counts": counts,
        "groupFields": group_fields,
        "contentFields": content_fields,
        "nearDuplicateThreshold": near_duplicate_threshold,
        "findingCounts": dict(sorted(by_type.items())),
        "findings": findings,
        "limitations": [
            "Semantic leakage cannot be proved by string similarity alone; splitGroup must encode shared source, POI, concept, route, or speaker.",
            "Near-duplicate candidates use rare-token blocking and may miss heavily paraphrased examples.",
        ],
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--train", required=True, type=Path)
    parser.add_argument("--validation", required=True, type=Path)
    parser.add_argument("--test", required=True, type=Path)
    parser.add_argument("--group-fields", default="splitGroup")
    parser.add_argument("--content-fields", default=",".join(DEFAULT_CONTENT_FIELDS))
    parser.add_argument("--near-duplicate-threshold", type=float, default=0.90)
    parser.add_argument("--report", type=Path)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    if not 0 <= args.near_duplicate_threshold <= 1:
        print("--near-duplicate-threshold must be between 0 and 1", file=sys.stderr)
        return 2
    try:
        splits = {
            "train": [record for _, record in read_jsonl(args.train)],
            "validation": [record for _, record in read_jsonl(args.validation)],
            "test": [record for _, record in read_jsonl(args.test)],
        }
    except JsonlError as exc:
        print(str(exc), file=sys.stderr)
        return 1
    result = audit_splits(
        splits,
        group_fields=parse_csv_list(args.group_fields),
        content_fields=parse_csv_list(args.content_fields),
        near_duplicate_threshold=args.near_duplicate_threshold,
    )
    rendered = json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True)
    print(rendered)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(rendered + "\n", encoding="utf-8")
    return 0 if result["leakageFree"] else 1


if __name__ == "__main__":
    sys.exit(main())
