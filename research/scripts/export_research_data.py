#!/usr/bin/env python3
"""Create field-whitelisted CSV or JSON research exports with stable pseudonyms."""

from __future__ import annotations

import argparse
import csv
import hashlib
import hmac
import json
import os
import sys
from collections.abc import Mapping
from pathlib import Path
from typing import Any

try:
    from .common import JsonlError, canonical_json, file_sha256, get_path, parse_csv_list, read_jsonl
except ImportError:  # pragma: no cover
    from common import JsonlError, canonical_json, file_sha256, get_path, parse_csv_list, read_jsonl


DEFAULT_PSEUDONYM_FIELDS = ["userId", "guideId", "conversationId", "speakerId"]
FORBIDDEN_FIELD_NAMES = {
    "email",
    "phone",
    "phonenumber",
    "passportnumber",
    "nationalid",
    "certificatereference",
    "rawidentitydocument",
    "medicaldetails",
    "healthdetails",
    "exactaddress",
    "accesstoken",
    "refreshtoken",
    "apikey",
    "password",
    "secret",
}


def _field_is_forbidden(field: str) -> bool:
    return any(part.replace("_", "").replace("-", "").casefold() in FORBIDDEN_FIELD_NAMES for part in field.split("."))


def pseudonymize(value: Any, salt: bytes, namespace: str) -> str:
    digest = hmac.new(salt, f"{namespace}\0{value}".encode("utf-8"), hashlib.sha256).hexdigest()
    return f"p_{digest[:20]}"


def scalar_export_value(value: Any, *, csv_safe: bool) -> Any:
    if value is None:
        return "" if csv_safe else None
    if isinstance(value, (dict, list)):
        return canonical_json(value)
    if csv_safe and isinstance(value, str) and value.startswith(("=", "+", "-", "@")):
        return f"'{value}"
    return value


def build_export_rows(
    records: list[dict[str, Any]],
    *,
    fields: list[str],
    pseudonym_fields: list[str],
    salt: bytes | None,
    csv_safe: bool,
) -> list[dict[str, Any]]:
    forbidden = [field for field in fields if _field_is_forbidden(field)]
    if forbidden:
        raise ValueError(f"private or secret fields are not exportable: {', '.join(forbidden)}")
    active_pseudonyms = set(fields) & set(pseudonym_fields)
    if active_pseudonyms and not salt:
        raise ValueError("RESEARCH_EXPORT_SALT (at least 16 characters) is required for selected identifier fields")
    output: list[dict[str, Any]] = []
    for record in records:
        row: dict[str, Any] = {}
        for field in fields:
            value = get_path(record, field)
            if field in active_pseudonyms and value not in (None, ""):
                value = pseudonymize(value, salt or b"", field)
            row[field] = scalar_export_value(value, csv_safe=csv_safe)
        output.append(row)
    return output


def read_records(path: Path) -> list[dict[str, Any]]:
    if path.suffix.casefold() == ".json":
        try:
            value = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise JsonlError(f"Cannot parse {path}: {exc}") from exc
        if isinstance(value, Mapping) and isinstance(value.get("data"), list):
            value = value["data"]
        if not isinstance(value, list) or not all(isinstance(record, dict) for record in value):
            raise JsonlError("JSON input must be an array of objects or an object with a data array")
        return value
    return [record for _, record in read_jsonl(path)]


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="JSONL, JSON array, or {data: [...]} JSON")
    parser.add_argument("output", type=Path)
    parser.add_argument("--fields", required=True, help="Explicit comma-separated export whitelist")
    parser.add_argument("--pseudonymize-fields", default=",".join(DEFAULT_PSEUDONYM_FIELDS))
    parser.add_argument("--salt-env", default="RESEARCH_EXPORT_SALT", help="Environment variable containing a private pseudonymization salt")
    parser.add_argument("--format", choices=["csv", "json"], help="Defaults from output extension")
    parser.add_argument("--force", action="store_true")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    fields = parse_csv_list(args.fields)
    pseudonym_fields = parse_csv_list(args.pseudonymize_fields)
    output_format = args.format or ("csv" if args.output.suffix.casefold() == ".csv" else "json")
    if not fields:
        print("At least one --fields entry is required.", file=sys.stderr)
        return 2
    if args.output.exists() and not args.force:
        print(f"Refusing to replace {args.output}; pass --force explicitly.", file=sys.stderr)
        return 2
    salt_value = os.environ.get(args.salt_env, "")
    if salt_value and len(salt_value) < 16:
        print(f"{args.salt_env} must contain at least 16 characters.", file=sys.stderr)
        return 2
    try:
        records = read_records(args.input)
        rows = build_export_rows(
            records,
            fields=fields,
            pseudonym_fields=pseudonym_fields,
            salt=salt_value.encode("utf-8") if salt_value else None,
            csv_safe=output_format == "csv",
        )
    except (JsonlError, ValueError) as exc:
        print(str(exc), file=sys.stderr)
        return 1

    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_name(f".{args.output.name}.tmp")
    if output_format == "csv":
        with temporary.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(rows)
    else:
        temporary.write_text(json.dumps(rows, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    temporary.replace(args.output)
    manifest = {
        "version": 1,
        "source": str(args.input),
        "sourceSha256": file_sha256(args.input),
        "output": str(args.output),
        "outputSha256": file_sha256(args.output),
        "format": output_format,
        "records": len(rows),
        "fields": fields,
        "pseudonymizedFields": sorted(set(fields) & set(pseudonym_fields)),
        "saltStored": False,
    }
    manifest_path = args.output.with_suffix(args.output.suffix + ".manifest.json")
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())
