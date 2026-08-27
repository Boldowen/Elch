#!/usr/bin/env python3
"""Normalize JSONL text and optionally remove direct identifiers."""

from __future__ import annotations

import argparse
import json
import sys
from collections.abc import Mapping
from pathlib import Path
from typing import Any

try:
    from .common import JsonlError, normalize_value, read_jsonl, write_jsonl
except ImportError:  # pragma: no cover
    from common import JsonlError, normalize_value, read_jsonl, write_jsonl


SENSITIVE_KEYS = {
    "email",
    "phone",
    "phonenumber",
    "fullname",
    "passportnumber",
    "nationalid",
    "certificatereference",
    "rawidentitydocument",
    "medicaldetails",
    "healthdetails",
    "exactaddress",
}


def remove_sensitive(value: Any, prefix: str = "") -> tuple[Any, list[str]]:
    removed: list[str] = []
    if isinstance(value, list):
        cleaned_items: list[Any] = []
        for index, item in enumerate(value):
            cleaned, nested = remove_sensitive(item, f"{prefix}[{index}]")
            cleaned_items.append(cleaned)
            removed.extend(nested)
        return cleaned_items, removed
    if not isinstance(value, Mapping):
        return value, removed

    cleaned_object: dict[str, Any] = {}
    for key, item in value.items():
        path = f"{prefix}.{key}" if prefix else str(key)
        normalized_key = str(key).replace("_", "").replace("-", "").casefold()
        if normalized_key in SENSITIVE_KEYS:
            removed.append(path)
            continue
        cleaned, nested = remove_sensitive(item, path)
        cleaned_object[str(key)] = cleaned
        removed.extend(nested)
    return cleaned_object, removed


def clean_records(
    records: list[dict[str, Any]],
    *,
    drop_sensitive_fields: bool,
    drop_empty_text_records: bool,
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    output: list[dict[str, Any]] = []
    removed_fields: list[dict[str, Any]] = []
    dropped_ids: list[str] = []
    for record in records:
        cleaned = normalize_value(record)
        if drop_sensitive_fields:
            cleaned, paths = remove_sensitive(cleaned)
            if paths:
                removed_fields.append({"id": record.get("id"), "fields": paths})
        candidate_text = cleaned.get("instruction") or cleaned.get("content") or cleaned.get("prompt") or cleaned.get("request")
        if drop_empty_text_records and (not isinstance(candidate_text, (str, dict)) or candidate_text in ("", {})):
            dropped_ids.append(str(record.get("id", "<missing>")))
            continue
        output.append(cleaned)
    return output, {
        "inputRecords": len(records),
        "outputRecords": len(output),
        "droppedRecordIds": dropped_ids,
        "sensitiveFieldsRemoved": removed_fields,
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--drop-sensitive-fields", action="store_true")
    parser.add_argument("--drop-empty-text-records", action="store_true")
    parser.add_argument("--report", type=Path)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    if args.input.resolve() == args.output.resolve():
        print("Refusing to overwrite the source JSONL; choose a separate output path.", file=sys.stderr)
        return 2
    try:
        records = [record for _, record in read_jsonl(args.input)]
    except JsonlError as exc:
        print(str(exc), file=sys.stderr)
        return 1
    cleaned, report = clean_records(
        records,
        drop_sensitive_fields=args.drop_sensitive_fields,
        drop_empty_text_records=args.drop_empty_text_records,
    )
    write_jsonl(args.output, cleaned)
    rendered = json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True)
    print(rendered)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(rendered + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
