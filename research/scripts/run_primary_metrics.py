#!/usr/bin/env python3
"""Recompute every primary research metric with one command.

The master plan's definition of done (section 15.3) requires the primary
metrics to be reproducible from a single command. This runner reads a small
JSON manifest that names each evaluation input, calls `evaluate_csv` for each
one, and writes the results plus a hash manifest into one output directory, so
a thesis table can always be traced back to the exact file it came from.

The default manifest points at the committed demo fixtures. They are fixtures,
not results: every run records the `data_status` values it saw, and a run that
contains demo rows is refused unless `--allow-demo` is passed explicitly.
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

try:
    from .common import file_sha256
    from .evaluate_csv import main as evaluate_main
except ImportError:  # pragma: no cover - direct script execution
    from common import file_sha256
    from evaluate_csv import main as evaluate_main


DEMO_MARKER = "DEMO"
DEFAULT_MANIFEST = Path("research/evaluation/primary_metrics.manifest.json")


def data_statuses(path: Path) -> list[str]:
    try:
        with path.open("r", encoding="utf-8-sig", newline="") as handle:
            return sorted({(row.get("data_status") or "").strip() for row in csv.DictReader(handle)} - {""})
    except OSError:
        return []


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--output-dir", type=Path, default=Path("research/evaluation/results"))
    parser.add_argument("--allow-demo", action="store_true", help="Permit inputs whose data_status marks them as demo fixtures.")
    parser.add_argument("--force", action="store_true", help="Replace existing outputs.")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    except OSError as exc:
        print(f"Cannot read manifest {args.manifest}: {exc}", file=sys.stderr)
        return 1
    except json.JSONDecodeError as exc:
        print(f"Invalid manifest {args.manifest}: {exc}", file=sys.stderr)
        return 1

    reports = manifest.get("reports")
    if not isinstance(reports, list) or not reports:
        print(f"{args.manifest}: 'reports' must be a non-empty list", file=sys.stderr)
        return 1

    resolved: list[dict[str, Any]] = []
    for report in reports:
        name, kind, source = report.get("name"), report.get("kind"), report.get("input")
        if not name or not kind or not source:
            print(f"{args.manifest}: each report needs 'name', 'kind' and 'input'", file=sys.stderr)
            return 1
        path = Path(source)
        if not path.is_file():
            print(f"{args.manifest}: missing input {path}", file=sys.stderr)
            return 1
        statuses = data_statuses(path)
        if any(DEMO_MARKER in status.upper() for status in statuses) and not args.allow_demo:
            print(f"{path} is marked {statuses}. Pass --allow-demo to compute metrics over fixture data.", file=sys.stderr)
            return 2
        resolved.append({**report, "path": path, "dataStatuses": statuses})

    args.output_dir.mkdir(parents=True, exist_ok=True)
    summary: dict[str, Any] = {
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "manifest": str(args.manifest),
        "manifestSha256": file_sha256(args.manifest),
        "allowDemo": args.allow_demo,
        "reports": [],
    }

    for report in resolved:
        path: Path = report["path"]
        output_json = args.output_dir / f"{report['name']}.json"
        summary_csv = args.output_dir / f"{report['name']}.summary.csv"
        argv_parts = [report["kind"], str(path), str(output_json), "--summary-csv", str(summary_csv)]
        if report.get("groupField"):
            argv_parts += ["--group-field", str(report["groupField"])]
        if report.get("topK"):
            argv_parts += ["--top-k", str(report["topK"])]
        if args.force:
            argv_parts.append("--force")
        code = evaluate_main(argv_parts)
        if code != 0:
            print(f"Metric run failed for {report['name']} (exit {code}).", file=sys.stderr)
            return code
        summary["reports"].append({
            "name": report["name"],
            "kind": report["kind"],
            "input": str(path),
            "inputSha256": file_sha256(path),
            "dataStatuses": report["dataStatuses"],
            "outputJson": str(output_json),
            "outputSummaryCsv": str(summary_csv),
        })

    index = args.output_dir / "primary_metrics.index.json"
    index.write_text(json.dumps(summary, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({"reports": len(summary["reports"]), "index": str(index)}, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
