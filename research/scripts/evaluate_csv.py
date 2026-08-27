#!/usr/bin/env python3
"""Calculate dependency-free travel-agent and guide-assessment research metrics."""

from __future__ import annotations

import argparse
import csv
import json
import math
import random
import statistics
import sys
from collections import Counter, defaultdict
from collections.abc import Callable, Sequence
from pathlib import Path
from typing import Any

try:
    from .common import as_bool, as_float, percentile
except ImportError:  # pragma: no cover
    from common import as_bool, as_float, percentile


def mean(values: Sequence[float]) -> float | None:
    return statistics.fmean(values) if values else None


def pearson(left: Sequence[float], right: Sequence[float]) -> float | None:
    if len(left) != len(right) or len(left) < 2:
        return None
    left_mean, right_mean = statistics.fmean(left), statistics.fmean(right)
    numerator = sum((x - left_mean) * (y - right_mean) for x, y in zip(left, right, strict=True))
    left_scale = math.sqrt(sum((x - left_mean) ** 2 for x in left))
    right_scale = math.sqrt(sum((y - right_mean) ** 2 for y in right))
    return numerator / (left_scale * right_scale) if left_scale and right_scale else None


def rankdata(values: Sequence[float]) -> list[float]:
    indexed = sorted(enumerate(values), key=lambda item: item[1])
    ranks = [0.0] * len(values)
    cursor = 0
    while cursor < len(indexed):
        end = cursor + 1
        while end < len(indexed) and indexed[end][1] == indexed[cursor][1]:
            end += 1
        average_rank = ((cursor + 1) + end) / 2
        for position in range(cursor, end):
            ranks[indexed[position][0]] = average_rank
        cursor = end
    return ranks


def spearman(left: Sequence[float], right: Sequence[float]) -> float | None:
    return pearson(rankdata(left), rankdata(right))


def mean_absolute_error(left: Sequence[float], right: Sequence[float]) -> float | None:
    return statistics.fmean(abs(x - y) for x, y in zip(left, right, strict=True)) if left else None


def confusion(predicted: Sequence[bool], actual: Sequence[bool]) -> dict[str, float | int | None]:
    tp = sum(prediction and truth for prediction, truth in zip(predicted, actual, strict=True))
    tn = sum(not prediction and not truth for prediction, truth in zip(predicted, actual, strict=True))
    fp = sum(prediction and not truth for prediction, truth in zip(predicted, actual, strict=True))
    fn = sum(not prediction and truth for prediction, truth in zip(predicted, actual, strict=True))
    precision = tp / (tp + fp) if tp + fp else None
    recall = tp / (tp + fn) if tp + fn else None
    f1 = 2 * precision * recall / (precision + recall) if precision is not None and recall is not None and precision + recall else None
    return {
        "truePositive": tp,
        "trueNegative": tn,
        "falsePositive": fp,
        "falseNegative": fn,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "falseNegativeRate": fn / (fn + tp) if fn + tp else None,
        "falsePositiveRate": fp / (fp + tn) if fp + tn else None,
    }


def cohen_kappa(predicted: Sequence[bool], actual: Sequence[bool]) -> float | None:
    if len(predicted) != len(actual) or not predicted:
        return None
    observed = sum(left == right for left, right in zip(predicted, actual, strict=True)) / len(predicted)
    predicted_positive = sum(predicted) / len(predicted)
    actual_positive = sum(actual) / len(actual)
    expected = predicted_positive * actual_positive + (1 - predicted_positive) * (1 - actual_positive)
    return (observed - expected) / (1 - expected) if expected != 1 else 1.0


def fleiss_kappa(ratings: Sequence[Sequence[bool]]) -> float | None:
    if not ratings or len(ratings) < 2:
        return None
    rater_count = len(ratings[0])
    if rater_count < 2 or any(len(row) != rater_count for row in ratings):
        return None
    item_agreement: list[float] = []
    positive_total = 0
    for row in ratings:
        positive = sum(row)
        negative = rater_count - positive
        positive_total += positive
        item_agreement.append((positive**2 + negative**2 - rater_count) / (rater_count * (rater_count - 1)))
    observed = statistics.fmean(item_agreement)
    positive_share = positive_total / (len(ratings) * rater_count)
    expected = positive_share**2 + (1 - positive_share) ** 2
    return (observed - expected) / (1 - expected) if expected != 1 else 1.0


def wilson_interval(successes: int, total: int, z: float = 1.959963984540054) -> list[float] | None:
    if total <= 0:
        return None
    proportion = successes / total
    denominator = 1 + z**2 / total
    center = (proportion + z**2 / (2 * total)) / denominator
    margin = z * math.sqrt((proportion * (1 - proportion) + z**2 / (4 * total)) / total) / denominator
    return [max(0.0, center - margin), min(1.0, center + margin)]


def bootstrap_pair_ci(
    left: Sequence[float],
    right: Sequence[float],
    metric: Callable[[Sequence[float], Sequence[float]], float | None],
    *,
    iterations: int,
    seed: int,
) -> list[float] | None:
    if len(left) < 2 or iterations <= 0:
        return None
    generator = random.Random(seed)
    estimates: list[float] = []
    for _ in range(iterations):
        indices = [generator.randrange(len(left)) for _ in left]
        estimate = metric([left[index] for index in indices], [right[index] for index in indices])
        if estimate is not None and math.isfinite(estimate):
            estimates.append(estimate)
    low, high = percentile(estimates, 0.025), percentile(estimates, 0.975)
    return [low, high] if low is not None and high is not None else None


def _numeric(rows: Sequence[dict[str, str]], field: str) -> list[float]:
    return [number for row in rows if (number := as_float(row.get(field))) is not None]


def _boolean(rows: Sequence[dict[str, str]], field: str) -> list[bool]:
    return [flag for row in rows if (flag := as_bool(row.get(field))) is not None]


def _rate(rows: Sequence[dict[str, str]], field: str) -> dict[str, Any]:
    values = _boolean(rows, field)
    successes = sum(values)
    return {"value": successes / len(values) if values else None, "n": len(values), "ci95": wilson_interval(successes, len(values))}


def travel_metrics(rows: Sequence[dict[str, str]]) -> dict[str, Any]:
    result: dict[str, Any] = {"n": len(rows)}
    for field in ("hallucination_detected", "poi_validity", "spatial_feasibility", "temporal_feasibility", "budget_compliance", "season_compliance", "safety_violation", "final_validity"):
        result[field] = _rate(rows, field)
    for field in ("factual_accuracy", "personalization_score"):
        values = _numeric(rows, field)
        result[field] = {"mean": mean(values), "n": len(values)}
    latency = _numeric(rows, "latency_ms")
    result["latency_ms"] = {"mean": mean(latency), "p50": percentile(latency, 0.50), "p95": percentile(latency, 0.95), "n": len(latency)}
    for field in ("input_tokens", "output_tokens", "estimated_cost_usd"):
        values = _numeric(rows, field)
        result[field] = {"sum": sum(values), "mean": mean(values), "n": len(values)}
    return result


def _paired_numeric(rows: Sequence[dict[str, str]], left_field: str, right_field: str) -> tuple[list[float], list[float]]:
    pairs = [(left, right) for row in rows if (left := as_float(row.get(left_field))) is not None and (right := as_float(row.get(right_field))) is not None]
    return [pair[0] for pair in pairs], [pair[1] for pair in pairs]


def _paired_bool(rows: Sequence[dict[str, str]], left_field: str, right_field: str) -> tuple[list[bool], list[bool]]:
    pairs = [(left, right) for row in rows if (left := as_bool(row.get(left_field))) is not None and (right := as_bool(row.get(right_field))) is not None]
    return [pair[0] for pair in pairs], [pair[1] for pair in pairs]


def guide_metrics(rows: Sequence[dict[str, str]], *, bootstrap_iterations: int, seed: int) -> dict[str, Any]:
    ai_scores, human_scores = _paired_numeric(rows, "ai_score", "human_score")
    ai_pass, human_pass = _paired_bool(rows, "ai_pass", "human_pass")
    ai_safety, human_safety = _paired_bool(rows, "ai_safety_flag", "human_safety_flag")
    result: dict[str, Any] = {
        "n": len(rows),
        "scorePairs": len(ai_scores),
        "pearson": pearson(ai_scores, human_scores),
        "pearsonCi95": bootstrap_pair_ci(ai_scores, human_scores, pearson, iterations=bootstrap_iterations, seed=seed),
        "spearman": spearman(ai_scores, human_scores),
        "spearmanCi95": bootstrap_pair_ci(ai_scores, human_scores, spearman, iterations=bootstrap_iterations, seed=seed + 1),
        "meanAbsoluteError": mean_absolute_error(ai_scores, human_scores),
        "meanAbsoluteErrorCi95": bootstrap_pair_ci(ai_scores, human_scores, mean_absolute_error, iterations=bootstrap_iterations, seed=seed + 2),
        "passAgreement": {**confusion(ai_pass, human_pass), "cohenKappa": cohen_kappa(ai_pass, human_pass), "n": len(ai_pass)},
        "safetyClassification": {**confusion(ai_safety, human_safety), "cohenKappa": cohen_kappa(ai_safety, human_safety), "n": len(ai_safety)},
    }
    cefr_order = {level: index for index, level in enumerate(("A1", "A2", "B1", "B2", "C1", "C2"), start=1)}
    cefr_pairs = [(cefr_order[ai], cefr_order[human]) for row in rows if (ai := row.get("ai_cefr", "").upper()) in cefr_order and (human := row.get("human_cefr", "").upper()) in cefr_order]
    result["cefr"] = {
        "n": len(cefr_pairs),
        "exactAgreement": sum(ai == human for ai, human in cefr_pairs) / len(cefr_pairs) if cefr_pairs else None,
        "ordinalMeanAbsoluteError": statistics.fmean(abs(ai - human) for ai, human in cefr_pairs) if cefr_pairs else None,
    }
    rater_columns = sorted({column for row in rows for column in row if column.startswith("reviewer_pass_")})
    ratings = [[flag for column in rater_columns if (flag := as_bool(row.get(column))) is not None] for row in rows]
    ratings = [row for row in ratings if len(row) == len(rater_columns)]
    result["humanRaters"] = {"columns": rater_columns, "items": len(ratings), "fleissKappa": fleiss_kappa(ratings)}
    return result


def group_rows(rows: list[dict[str, str]], field: str) -> dict[str, list[dict[str, str]]]:
    groups: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in rows:
        groups[row.get(field, "") or "UNSPECIFIED"].append(row)
    return dict(sorted(groups.items()))


def flatten(prefix: str, value: Any, output: dict[str, Any]) -> None:
    if isinstance(value, dict):
        for key, nested in value.items():
            flatten(f"{prefix}.{key}" if prefix else key, nested, output)
    elif isinstance(value, list):
        output[prefix] = json.dumps(value, separators=(",", ":"))
    else:
        output[prefix] = value


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("kind", choices=["travel", "guide"])
    parser.add_argument("input", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--summary-csv", type=Path)
    parser.add_argument("--group-field", default="experiment_mode")
    parser.add_argument("--bootstrap-iterations", type=int, default=1000)
    parser.add_argument("--seed", type=int, default=20260815)
    parser.add_argument("--force", action="store_true")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    outputs = [args.output_json, *([args.summary_csv] if args.summary_csv else [])]
    existing = [path for path in outputs if path and path.exists()]
    if existing and not args.force:
        print(f"Refusing to replace existing output: {', '.join(map(str, existing))}. Pass --force explicitly.", file=sys.stderr)
        return 2
    try:
        with args.input.open("r", encoding="utf-8-sig", newline="") as handle:
            rows = list(csv.DictReader(handle))
    except OSError as exc:
        print(f"Cannot read {args.input}: {exc}", file=sys.stderr)
        return 1
    metric_function = travel_metrics if args.kind == "travel" else lambda values: guide_metrics(values, bootstrap_iterations=args.bootstrap_iterations, seed=args.seed)
    result = {
        "kind": args.kind,
        "source": str(args.input),
        "groupField": args.group_field,
        "overall": metric_function(rows),
        "groups": {group: metric_function(grouped) for group, grouped in group_rows(rows, args.group_field).items()},
        "notes": ["Blank or invalid cells are excluded per metric and each metric reports its own n.", "Confidence intervals are Wilson intervals for rates and seeded percentile bootstrap intervals for paired guide metrics."],
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True, allow_nan=False) + "\n", encoding="utf-8")
    if args.summary_csv:
        flattened_rows: list[dict[str, Any]] = []
        for group, metrics in result["groups"].items():
            row: dict[str, Any] = {args.group_field: group}
            flatten("", metrics, row)
            flattened_rows.append(row)
        fieldnames = sorted({field for row in flattened_rows for field in row})
        args.summary_csv.parent.mkdir(parents=True, exist_ok=True)
        with args.summary_csv.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(flattened_rows)
    print(json.dumps({"kind": args.kind, "records": len(rows), "groups": len(result["groups"]), "output": str(args.output_json)}, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
