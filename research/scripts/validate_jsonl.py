#!/usr/bin/env python3
"""Validate research JSONL records without requiring a third-party schema package."""

from __future__ import annotations

import argparse
import json
import sys
from collections.abc import Mapping
from pathlib import Path
from typing import Any

try:
    from .common import JsonlError, read_jsonl
except ImportError:  # pragma: no cover - supports direct script execution
    from common import JsonlError, read_jsonl


DATA_STATUSES = {
    "VERIFIED_SOURCE_DERIVED",
    "SYNTHETIC_SOURCE_DERIVED",
    "COLLECTED_WITH_CONSENT",
    "DEMO_RESEARCH_GENERATED",
}
KINDS = {
    "instruction",
    "tourism-knowledge",
    "assessment-question",
    "speech",
    "evaluation",
}


def _present(record: Mapping[str, Any], field: str, expected: type | tuple[type, ...]) -> bool:
    return field in record and isinstance(record[field], expected) and record[field] not in ("", [], {})


def detect_kind(record: Mapping[str, Any]) -> str | None:
    if "expectedBehavior" in record or "instruction" in record:
        return "instruction"
    if "questionType" in record or "answerKey" in record:
        return "assessment-question"
    if "speakerId" in record or "audioReference" in record:
        return "speech"
    if "expectedChecks" in record or "humanScore" in record:
        return "evaluation"
    if "sourceId" in record and "content" in record:
        return "tourism-knowledge"
    return None


def validate_record(
    record: Mapping[str, Any],
    *,
    requested_kind: str,
    allow_demo: bool,
) -> tuple[list[str], list[str], str | None]:
    errors: list[str] = []
    warnings: list[str] = []
    kind = detect_kind(record) if requested_kind == "auto" else requested_kind
    if kind not in KINDS:
        return ["record kind could not be detected; pass --kind explicitly"], warnings, kind

    if not _present(record, "id", str):
        errors.append("id must be a non-empty string")
    status = record.get("dataStatus")
    if status not in DATA_STATUSES:
        errors.append(f"dataStatus must be one of {sorted(DATA_STATUSES)}")
    if status == "DEMO_RESEARCH_GENERATED" and not allow_demo:
        errors.append("demo data is rejected unless --allow-demo is explicit")
    if "evaluationOnly" in record and not isinstance(record["evaluationOnly"], bool):
        errors.append("evaluationOnly must be boolean")
    if not _present(record, "splitGroup", str):
        errors.append("splitGroup is required to support group-aware splitting")

    provenance = record.get("provenance")
    if not isinstance(provenance, Mapping):
        errors.append("provenance must be an object")
        provenance = {}
    source_ids = provenance.get("sourceIds")
    if source_ids is not None and (
        not isinstance(source_ids, list) or not all(isinstance(item, str) and item for item in source_ids)
    ):
        errors.append("provenance.sourceIds must be an array of non-empty strings")
    if status in {"VERIFIED_SOURCE_DERIVED", "SYNTHETIC_SOURCE_DERIVED"} and not source_ids:
        errors.append("source-derived records require provenance.sourceIds")
    if status == "COLLECTED_WITH_CONSENT" and not provenance.get("consentRecordId"):
        errors.append("collected records require provenance.consentRecordId")

    if kind == "instruction":
        if not _present(record, "instruction", str):
            errors.append("instruction must be a non-empty string")
        if not isinstance(record.get("input"), Mapping):
            errors.append("input must be an object")
        if not isinstance(record.get("expectedBehavior"), Mapping):
            errors.append("expectedBehavior must be an object")
        if not _present(record, "expectedResponse", str):
            warnings.append("expectedResponse is absent; this row cannot be used for supervised fine-tuning")
        if record.get("evaluationOnly") is True:
            warnings.append("evaluationOnly instruction must remain outside train/validation output")

    elif kind == "tourism-knowledge":
        for field in ("sourceId", "content", "category", "language", "lastVerifiedAt"):
            if not _present(record, field, str):
                errors.append(f"{field} must be a non-empty string")
        if status == "DEMO_RESEARCH_GENERATED":
            warnings.append("demo knowledge must never be presented as a verified fact")

    elif kind == "assessment-question":
        for field in ("category", "difficulty", "questionType", "language", "prompt"):
            if not _present(record, field, str):
                errors.append(f"{field} must be a non-empty string")
        if not _present(record, "answerKey", (str, list, dict)) and not isinstance(
            record.get("scoringRubric"), Mapping
        ):
            errors.append("answerKey or scoringRubric is required")
        if record.get("evaluationOnly") is not True:
            errors.append("assessment questions must set evaluationOnly=true to prevent training leakage")

    elif kind == "speech":
        if not _present(record, "speakerId", str):
            errors.append("speakerId must be a non-empty pseudonymous identifier")
        if not (_present(record, "transcript", str) or _present(record, "audioReference", str)):
            errors.append("transcript or audioReference is required")
        if status != "COLLECTED_WITH_CONSENT":
            errors.append("speech data must use dataStatus=COLLECTED_WITH_CONSENT")
        if provenance.get("anonymized") is not True:
            errors.append("speech provenance.anonymized must be true")

    elif kind == "evaluation":
        if not _present(record, "request", (str, dict)):
            errors.append("request must be a non-empty string or object")
        if not isinstance(record.get("expectedChecks"), Mapping):
            errors.append("expectedChecks must be an object")
        if record.get("evaluationOnly") is not True:
            errors.append("evaluation records must set evaluationOnly=true")

    return errors, warnings, kind


def validate_file(
    path: Path,
    *,
    kind: str = "auto",
    allow_demo: bool = False,
) -> dict[str, Any]:
    issues: list[dict[str, Any]] = []
    identifiers: dict[str, int] = {}
    count = 0
    detected: dict[str, int] = {}
    try:
        rows = list(read_jsonl(path))
    except JsonlError as exc:
        return {"path": str(path), "records": 0, "errors": 1, "warnings": 0, "issues": [{"line": None, "severity": "ERROR", "message": str(exc)}]}

    for line_number, record in rows:
        count += 1
        record_id = record.get("id")
        if isinstance(record_id, str) and record_id:
            if record_id in identifiers:
                issues.append({"line": line_number, "severity": "ERROR", "message": f"duplicate id {record_id!r}; first seen on line {identifiers[record_id]}"})
            else:
                identifiers[record_id] = line_number
        errors, warnings, detected_kind = validate_record(record, requested_kind=kind, allow_demo=allow_demo)
        if detected_kind:
            detected[detected_kind] = detected.get(detected_kind, 0) + 1
        issues.extend({"line": line_number, "severity": "ERROR", "message": message} for message in errors)
        issues.extend({"line": line_number, "severity": "WARNING", "message": message} for message in warnings)

    return {
        "path": str(path),
        "records": count,
        "kinds": detected,
        "errors": sum(issue["severity"] == "ERROR" for issue in issues),
        "warnings": sum(issue["severity"] == "WARNING" for issue in issues),
        "issues": issues,
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("inputs", nargs="+", type=Path)
    parser.add_argument("--kind", choices=["auto", *sorted(KINDS)], default="auto")
    parser.add_argument("--allow-demo", action="store_true", help="Explicitly permit DEMO_RESEARCH_GENERATED rows")
    parser.add_argument("--strict", action="store_true", help="Treat warnings as a failing result")
    parser.add_argument("--report", type=Path, help="Optional JSON report path")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    reports = [validate_file(path, kind=args.kind, allow_demo=args.allow_demo) for path in args.inputs]
    result = {
        "valid": all(report["errors"] == 0 and (not args.strict or report["warnings"] == 0) for report in reports),
        "files": reports,
    }
    rendered = json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True)
    print(rendered)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(rendered + "\n", encoding="utf-8")
    return 0 if result["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
