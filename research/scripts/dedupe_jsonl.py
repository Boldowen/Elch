#!/usr/bin/env python3
"""Deterministically remove exact or normalized duplicate JSONL examples."""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any

try:
    from .common import (
        JsonlError,
        canonical_json,
        content_fingerprint,
        get_path,
        parse_csv_list,
        read_jsonl,
        write_jsonl,
    )
except ImportError:  # pragma: no cover
    from common import JsonlError, canonical_json, content_fingerprint, get_path, parse_csv_list, read_jsonl, write_jsonl


DEFAULT_FIELDS = ["instruction", "input", "expectedResponse"]


def fingerprint(record: dict[str, Any], fields: list[str], mode: str) -> str:
    if mode == "normalized":
        return content_fingerprint(record, fields)
    selected = {field: get_path(record, field) for field in fields}
    return hashlib.sha256(canonical_json(selected).encode("utf-8")).hexdigest()


def deduplicate(
    records: list[dict[str, Any]],
    *,
    fields: list[str],
    mode: str,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    kept: list[dict[str, Any]] = []
    first_by_fingerprint: dict[str, dict[str, Any]] = {}
    duplicates: list[dict[str, Any]] = []
    for index, record in enumerate(records):
        digest = fingerprint(record, fields, mode)
        first = first_by_fingerprint.get(digest)
        if first is None:
            first_by_fingerprint[digest] = {"id": record.get("id"), "index": index + 1}
            kept.append(record)
            continue
        duplicates.append(
            {
                "droppedId": record.get("id"),
                "droppedLine": index + 1,
                "keptId": first["id"],
                "keptLine": first["index"],
                "fingerprint": digest,
            },
        )
    return kept, duplicates


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--fields", default=",".join(DEFAULT_FIELDS), help="Comma-separated dotted paths")
    parser.add_argument("--mode", choices=["canonical", "normalized"], default="normalized")
    parser.add_argument("--report", type=Path)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    if args.input.resolve() == args.output.resolve():
        print("Refusing to overwrite the source JSONL; choose a separate output path.", file=sys.stderr)
        return 2
    fields = parse_csv_list(args.fields)
    if not fields:
        print("At least one fingerprint field is required.", file=sys.stderr)
        return 2
    try:
        records = [record for _, record in read_jsonl(args.input)]
    except JsonlError as exc:
        print(str(exc), file=sys.stderr)
        return 1
    kept, duplicates = deduplicate(records, fields=fields, mode=args.mode)
    write_jsonl(args.output, kept)
    report = {
        "inputRecords": len(records),
        "outputRecords": len(kept),
        "duplicateRecords": len(duplicates),
        "mode": args.mode,
        "fields": fields,
        "duplicates": duplicates,
    }
    rendered = json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True)
    print(rendered)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(rendered + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
