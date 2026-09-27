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


def intraclass_correlation(left: Sequence[float], right: Sequence[float]) -> float | None:
    """ICC(2,1): two-way random effects, absolute agreement, single measurement.

    Plan section 12.2 asks for ICC alongside Pearson and Spearman because a
    rater can correlate perfectly while being consistently biased high or low.
    ICC penalises that offset; Pearson does not.
    """

    subjects = [(a, b) for a, b in zip(left, right, strict=True)]
    n = len(subjects)
    if n < 2:
        return None
    k = 2
    grand_mean = statistics.fmean([value for pair in subjects for value in pair])
    row_means = [statistics.fmean(pair) for pair in subjects]
    column_means = [statistics.fmean(left), statistics.fmean(right)]
    rows_sum_squares = k * sum((mean - grand_mean) ** 2 for mean in row_means)
    columns_sum_squares = n * sum((mean - grand_mean) ** 2 for mean in column_means)
    total_sum_squares = sum((value - grand_mean) ** 2 for pair in subjects for value in pair)
    error_sum_squares = total_sum_squares - rows_sum_squares - columns_sum_squares
    rows_mean_square = rows_sum_squares / (n - 1)
    columns_mean_square = columns_sum_squares / (k - 1)
    error_mean_square = error_sum_squares / ((n - 1) * (k - 1))
    denominator = (
        rows_mean_square
        + (k - 1) * error_mean_square
        + k * (columns_mean_square - error_mean_square) / n
    )
    if denominator == 0:
        return None
    return (rows_mean_square - error_mean_square) / denominator


def weighted_kappa(left: Sequence[int], right: Sequence[int], *, categories: int, quadratic: bool = True) -> float | None:
    """Weighted kappa for ordered categories such as CEFR bands.

    Plan section 12.2 asks for a weighted coefficient on language bands so a
    one-band disagreement is not penalised like a four-band disagreement.
    """

    n = len(left)
    if n == 0 or n != len(right) or categories < 2:
        return None
    observed = [[0.0] * categories for _ in range(categories)]
    for a, b in zip(left, right, strict=True):
        if not (0 <= a < categories and 0 <= b < categories):
            return None
        observed[a][b] += 1 / n
    left_marginal = [sum(row) for row in observed]
    right_marginal = [sum(observed[index][column] for index in range(categories)) for column in range(categories)]
    span = (categories - 1) ** 2 if quadratic else (categories - 1)
    numerator = 0.0
    denominator = 0.0
    for a in range(categories):
        for b in range(categories):
            distance = abs(a - b)
            weight = (distance**2 if quadratic else distance) / span
            numerator += weight * observed[a][b]
            denominator += weight * left_marginal[a] * right_marginal[b]
    return 1 - numerator / denominator if denominator else None


def expected_calibration_error(confidences: Sequence[float], correct: Sequence[bool], *, bins: int = 10) -> dict[str, Any] | None:
    """Expected calibration error with its reliability bins (plan section 12.2)."""

    pairs = [(c, hit) for c, hit in zip(confidences, correct, strict=True) if 0.0 <= c <= 1.0]
    if not pairs:
        return None
    buckets: list[list[tuple[float, bool]]] = [[] for _ in range(bins)]
    for confidence, hit in pairs:
        index = min(bins - 1, int(confidence * bins))
        buckets[index].append((confidence, hit))
    error = 0.0
    reported: list[dict[str, Any]] = []
    for index, bucket in enumerate(buckets):
        if not bucket:
            continue
        mean_confidence = statistics.fmean(confidence for confidence, _ in bucket)
        accuracy = statistics.fmean(1.0 if hit else 0.0 for _, hit in bucket)
        weight = len(bucket) / len(pairs)
        error += weight * abs(accuracy - mean_confidence)
        reported.append({
            "bin": [round(index / bins, 4), round((index + 1) / bins, 4)],
            "n": len(bucket),
            "meanConfidence": mean_confidence,
            "accuracy": accuracy,
        })
    return {"expectedCalibrationError": error, "n": len(pairs), "bins": reported}


def discounted_cumulative_gain(relevances: Sequence[float]) -> float:
    return sum(relevance / math.log2(position + 2) for position, relevance in enumerate(relevances))


def ndcg_at_k(ranked_relevances: Sequence[float], k: int) -> float | None:
    """Normalised discounted cumulative gain over one ranked candidate list."""

    if not ranked_relevances or k <= 0:
        return None
    actual = discounted_cumulative_gain(ranked_relevances[:k])
    ideal = discounted_cumulative_gain(sorted(ranked_relevances, reverse=True)[:k])
    return actual / ideal if ideal else None


def kuder_richardson_20(responses: Sequence[Sequence[bool]]) -> float | None:
    """KR-20 internal consistency for a dichotomously scored test form."""

    if len(responses) < 2:
        return None
    item_count = len(responses[0])
    if item_count < 2 or any(len(row) != item_count for row in responses):
        return None
    totals = [sum(row) for row in responses]
    total_variance = statistics.pvariance(totals)
    if total_variance == 0:
        return None
    share_sum = 0.0
    for index in range(item_count):
        proportion = statistics.fmean(1.0 if row[index] else 0.0 for row in responses)
        share_sum += proportion * (1 - proportion)
    return (item_count / (item_count - 1)) * (1 - share_sum / total_variance)


def point_biserial(item: Sequence[bool], totals: Sequence[float]) -> float | None:
    """Item discrimination: correlation of one item with the rest-of-test score."""

    correct = [total for flag, total in zip(item, totals, strict=True) if flag]
    incorrect = [total for flag, total in zip(item, totals, strict=True) if not flag]
    if not correct or not incorrect or len(totals) < 2:
        return None
    spread = statistics.pstdev(totals)
    if spread == 0:
        return None
    proportion = len(correct) / len(totals)
    return ((statistics.fmean(correct) - statistics.fmean(incorrect)) / spread) * math.sqrt(proportion * (1 - proportion))


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
    for field in ("hallucination_detected", "poi_validity", "spatial_feasibility", "temporal_feasibility", "budget_compliance", "season_compliance", "safety_violation", "final_validity", "tool_selection_correct", "unsolvable_declared_correctly"):
        result[field] = _rate(rows, field)
    for field in ("factual_accuracy", "personalization_score", "spatial_score"):
        values = _numeric(rows, field)
        result[field] = {"mean": mean(values), "n": len(values)}
    # Plan section 12.3 human itinerary review: five independent 1-5 rubric axes.
    human_rubric: dict[str, Any] = {}
    for field in ("human_feasibility", "human_factuality", "human_usefulness", "human_personalization", "human_safety"):
        values = _numeric(rows, field)
        if values:
            human_rubric[field] = {"mean": mean(values), "n": len(values)}
    if human_rubric:
        result["humanRubric"] = human_rubric
    confidences = [
        (confidence, correct)
        for row in rows
        if (confidence := as_float(row.get("ai_confidence"))) is not None
        and (correct := as_bool(row.get("final_validity"))) is not None
    ]
    if confidences:
        result["calibration"] = expected_calibration_error(
            [confidence for confidence, _ in confidences],
            [correct for _, correct in confidences],
        )
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
        "icc": intraclass_correlation(ai_scores, human_scores),
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
        "withinOneBand": sum(abs(ai - human) <= 1 for ai, human in cefr_pairs) / len(cefr_pairs) if cefr_pairs else None,
        "ordinalMeanAbsoluteError": statistics.fmean(abs(ai - human) for ai, human in cefr_pairs) if cefr_pairs else None,
        "quadraticWeightedKappa": weighted_kappa(
            [ai - 1 for ai, _ in cefr_pairs],
            [human - 1 for _, human in cefr_pairs],
            categories=len(cefr_order),
        ),
    }
    confidence_pairs = [
        (confidence, ai_flag == human_flag)
        for row in rows
        if (confidence := as_float(row.get("ai_confidence"))) is not None
        and (ai_flag := as_bool(row.get("ai_pass"))) is not None
        and (human_flag := as_bool(row.get("human_pass"))) is not None
    ]
    if confidence_pairs:
        result["calibration"] = expected_calibration_error(
            [confidence for confidence, _ in confidence_pairs],
            [agreed for _, agreed in confidence_pairs],
        )
    rater_columns = sorted({column for row in rows for column in row if column.startswith("reviewer_pass_")})
    ratings = [[flag for column in rater_columns if (flag := as_bool(row.get(column))) is not None] for row in rows]
    ratings = [row for row in ratings if len(row) == len(rater_columns)]
    result["humanRaters"] = {"columns": rater_columns, "items": len(ratings), "fleissKappa": fleiss_kappa(ratings)}
    return result


def match_metrics(rows: Sequence[dict[str, str]], *, top_k: int) -> dict[str, Any]:
    """Plan section 9.2 guide-matching comparison.

    One row is one ranked candidate. `match_run_id` groups a ranking,
    `rank` is the position the system produced, `expert_relevance` is the
    blind expert grade, and `expert_top_k` / `unsafe_recommendation` carry the
    safety comparison. The primary safety number stays the unsafe-recommendation
    rate, reported separately from ranking quality.
    """

    runs: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in rows:
        runs[row.get("match_run_id", "") or "UNSPECIFIED"].append(row)

    ndcg_scores: list[float] = []
    overlaps: list[float] = []
    for candidates in runs.values():
        ordered = sorted(candidates, key=lambda row: as_float(row.get("rank")) or math.inf)
        relevances = [as_float(row.get("expert_relevance")) or 0.0 for row in ordered]
        score = ndcg_at_k(relevances, top_k)
        if score is not None:
            ndcg_scores.append(score)
        expert_top = {row.get("candidate_id", "") for row in ordered if as_bool(row.get("expert_top_k"))}
        if expert_top:
            system_top = {row.get("candidate_id", "") for row in ordered[:top_k]}
            overlaps.append(len(system_top & expert_top) / len(expert_top))

    result: dict[str, Any] = {
        "n": len(rows),
        "runs": len(runs),
        f"ndcgAt{top_k}": {"mean": mean(ndcg_scores), "n": len(ndcg_scores)},
        f"expertTop{top_k}Agreement": {"mean": mean(overlaps), "n": len(overlaps)},
        "unsafeRecommendationRate": _rate(rows, "unsafe_recommendation"),
        "gateBlockedRate": _rate(rows, "gate_blocked"),
    }
    predicted_unsafe, actual_unsafe = _paired_bool(rows, "system_flagged_unsafe", "unsafe_recommendation")
    if predicted_unsafe:
        result["unsafeDetection"] = {**confusion(predicted_unsafe, actual_unsafe), "n": len(predicted_unsafe)}
    return result


def item_metrics(rows: Sequence[dict[str, str]]) -> dict[str, Any]:
    """Plan section 12.2 rubric quality: item difficulty, discrimination, KR-20.

    One row is one candidate's answer: `form_id` names the test form,
    `candidate_id` the respondent, `item_id` the question and `correct` the
    dichotomous outcome.
    """

    forms: dict[str, dict[str, dict[str, bool]]] = defaultdict(lambda: defaultdict(dict))
    for row in rows:
        flag = as_bool(row.get("correct"))
        if flag is None:
            continue
        forms[row.get("form_id", "") or "UNSPECIFIED"][row.get("candidate_id", "")][row.get("item_id", "")] = flag

    reported: dict[str, Any] = {"n": len(rows), "forms": {}}
    for form_id, candidates in sorted(forms.items()):
        item_ids = sorted({item for answers in candidates.values() for item in answers})
        complete = [
            [answers[item] for item in item_ids]
            for answers in candidates.values()
            if all(item in answers for item in item_ids)
        ]
        if not complete:
            continue
        totals = [float(sum(row)) for row in complete]
        items = []
        for index, item_id in enumerate(item_ids):
            column = [row[index] for row in complete]
            # Discrimination uses the rest-of-test score so an item is never
            # correlated with itself.
            rest = [total - (1.0 if flag else 0.0) for total, flag in zip(totals, column, strict=True)]
            items.append({
                "itemId": item_id,
                "difficulty": statistics.fmean(1.0 if flag else 0.0 for flag in column),
                "discrimination": point_biserial(column, rest),
                "n": len(column),
            })
        reported["forms"][form_id] = {
            "candidates": len(complete),
            "items": items,
            "kr20": kuder_richardson_20(complete),
        }
    return reported


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
    parser.add_argument("kind", choices=["travel", "guide", "match", "items"])
    parser.add_argument("input", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--summary-csv", type=Path)
    parser.add_argument("--group-field", default="experiment_mode")
    parser.add_argument("--bootstrap-iterations", type=int, default=1000)
    parser.add_argument("--top-k", type=int, default=5, help="Cut-off for the match ranking metrics.")
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
    metric_functions: dict[str, Callable[[Sequence[dict[str, str]]], dict[str, Any]]] = {
        "travel": travel_metrics,
        "guide": lambda values: guide_metrics(values, bootstrap_iterations=args.bootstrap_iterations, seed=args.seed),
        "match": lambda values: match_metrics(values, top_k=args.top_k),
        "items": item_metrics,
    }
    metric_function = metric_functions[args.kind]
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
