from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from research.scripts.clean_jsonl import clean_records
from research.scripts.common import content_fingerprint, normalize_text
from research.scripts.dedupe_jsonl import deduplicate
from research.scripts.evaluate_csv import (
    cohen_kappa,
    confusion,
    expected_calibration_error,
    fleiss_kappa,
    intraclass_correlation,
    item_metrics,
    kuder_richardson_20,
    match_metrics,
    ndcg_at_k,
    pearson,
    point_biserial,
    spearman,
    weighted_kappa,
)
from research.scripts.run_primary_metrics import main as run_primary_metrics
from research.scripts.export_research_data import build_export_rows
from research.scripts.group_split_jsonl import split_records
from research.scripts.leakage_audit import audit_splits
from research.scripts.validate_jsonl import validate_file


def record(identifier: str, group: str, instruction: str, *, evaluation_only: bool = False) -> dict:
    return {
        "id": identifier,
        "dataStatus": "DEMO_RESEARCH_GENERATED",
        "evaluationOnly": evaluation_only,
        "instruction": instruction,
        "input": {},
        "expectedBehavior": {"validateConstraints": True},
        "expectedResponse": "Use verified tools and validators.",
        "splitGroup": group,
        "provenance": {"sourceIds": [], "humanReviewed": False, "licenseStatus": "DEMO_ONLY"},
    }


class CommonTests(unittest.TestCase):
    def test_unicode_and_whitespace_normalization_is_deterministic(self) -> None:
        self.assertEqual(normalize_text("  Ａ\t  test \r\n line  "), "A test\nline")

    def test_normalized_fingerprint_ignores_case_and_punctuation(self) -> None:
        first = record("a", "g1", "Plan a Gobi trip!")
        second = record("b", "g2", "plan A gobi trip")
        fields = ["instruction", "input", "expectedResponse"]
        self.assertEqual(content_fingerprint(first, fields), content_fingerprint(second, fields))


class DatasetPipelineTests(unittest.TestCase):
    def test_cleaner_removes_selected_sensitive_fields(self) -> None:
        source = record("a", "g1", "Safe text")
        source["email"] = "person@example.test"
        cleaned, report = clean_records([source], drop_sensitive_fields=True, drop_empty_text_records=False)
        self.assertNotIn("email", cleaned[0])
        self.assertEqual(report["sensitiveFieldsRemoved"][0]["fields"], ["email"])

    def test_validator_requires_explicit_demo_permission(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "data.jsonl"
            path.write_text(json.dumps(record("a", "g1", "Safe text")) + "\n", encoding="utf-8")
            self.assertGreater(validate_file(path)["errors"], 0)
            self.assertEqual(validate_file(path, allow_demo=True)["errors"], 0)

    def test_dedupe_keeps_first_normalized_example(self) -> None:
        rows = [record("a", "g1", "Plan a route!"), record("b", "g2", "plan A route")]
        kept, duplicates = deduplicate(rows, fields=["instruction", "input", "expectedResponse"], mode="normalized")
        self.assertEqual([row["id"] for row in kept], ["a"])
        self.assertEqual(duplicates[0]["droppedId"], "b")

    def test_split_is_group_safe_and_forces_evaluation_to_test(self) -> None:
        rows = [
            record("a", "shared", "One"),
            record("b", "shared", "Two"),
            record("c", "heldout", "Three", evaluation_only=True),
            record("d", "trainable", "Four"),
        ]
        splits, assignments = split_records(rows, group_fields=["splitGroup"], seed="fixed", validation_ratio=0.2, test_ratio=0.2, evaluation_flag="evaluationOnly")
        self.assertEqual(assignments['["heldout"]'], "test")
        locations = {row["id"]: split for split, records in splits.items() for row in records}
        self.assertEqual(locations["a"], locations["b"])
        self.assertEqual(locations["c"], "test")

    def test_leakage_audit_detects_cross_split_group(self) -> None:
        result = audit_splits(
            {"train": [record("a", "same", "One")], "validation": [], "test": [record("b", "same", "Different")]},
            group_fields=["splitGroup"],
            content_fields=["instruction"],
            near_duplicate_threshold=0.9,
        )
        self.assertFalse(result["leakageFree"])
        self.assertEqual(result["findingCounts"]["GROUP_OVERLAP"], 1)


class ExportAndMetricsTests(unittest.TestCase):
    def test_export_pseudonymizes_ids_and_escapes_csv_formulas(self) -> None:
        rows = build_export_rows(
            [{"guideId": "real-guide", "notes": "=1+1"}],
            fields=["guideId", "notes"],
            pseudonym_fields=["guideId"],
            salt=b"long-private-test-salt",
            csv_safe=True,
        )
        self.assertTrue(rows[0]["guideId"].startswith("p_"))
        self.assertNotIn("real-guide", rows[0]["guideId"])
        self.assertEqual(rows[0]["notes"], "'=1+1")

    def test_core_statistics_have_known_values(self) -> None:
        self.assertAlmostEqual(pearson([1, 2, 3], [2, 4, 6]) or 0, 1.0)
        self.assertAlmostEqual(spearman([30, 10, 20], [3, 1, 2]) or 0, 1.0)
        self.assertEqual(cohen_kappa([True, False], [True, False]), 1.0)
        self.assertEqual(confusion([True, False, False], [True, True, False])["falseNegative"], 1)
        self.assertIsNotNone(fleiss_kappa([[True, True, True], [False, False, True], [True, True, False]]))

    def test_icc_penalises_a_constant_rater_offset_that_pearson_ignores(self) -> None:
        exact = [10.0, 20.0, 30.0, 40.0]
        shifted = [value + 10 for value in exact]
        self.assertAlmostEqual(pearson(exact, shifted) or 0, 1.0)
        icc = intraclass_correlation(exact, shifted)
        self.assertIsNotNone(icc)
        self.assertLess(icc or 1.0, 1.0)
        self.assertAlmostEqual(intraclass_correlation(exact, exact) or 0, 1.0)

    def test_weighted_kappa_rewards_near_miss_bands(self) -> None:
        near = weighted_kappa([0, 1, 2, 3], [1, 2, 3, 4], categories=6)
        far = weighted_kappa([0, 1, 2, 3], [5, 4, 5, 0], categories=6)
        self.assertIsNotNone(near)
        self.assertIsNotNone(far)
        self.assertGreater(near or 0, far or 0)
        self.assertAlmostEqual(weighted_kappa([0, 1, 2, 3], [0, 1, 2, 3], categories=6) or 0, 1.0)

    def test_expected_calibration_error_is_zero_for_a_calibrated_forecast(self) -> None:
        confidences = [1.0] * 4 + [0.0] * 4
        outcomes = [True] * 4 + [False] * 4
        result = expected_calibration_error(confidences, outcomes)
        assert result is not None
        self.assertAlmostEqual(result["expectedCalibrationError"], 0.0)
        overconfident = expected_calibration_error([0.95] * 4, [True, False, False, False])
        assert overconfident is not None
        self.assertGreater(overconfident["expectedCalibrationError"], 0.5)

    def test_ndcg_rewards_the_ideal_ordering(self) -> None:
        self.assertAlmostEqual(ndcg_at_k([3, 2, 1], 3) or 0, 1.0)
        worse = ndcg_at_k([1, 2, 3], 3)
        self.assertIsNotNone(worse)
        self.assertLess(worse or 1.0, 1.0)

    def test_item_analysis_reports_difficulty_discrimination_and_kr20(self) -> None:
        rows = [
            {"form_id": "f1", "candidate_id": f"c{candidate}", "item_id": f"i{item}", "correct": str(correct).lower()}
            for candidate, pattern in enumerate([[1, 1, 1, 1], [1, 1, 1, 0], [1, 1, 0, 0], [1, 0, 0, 0]])
            for item, correct in enumerate(bool(flag) for flag in pattern)
        ]
        result = item_metrics(rows)
        form = result["forms"]["f1"]
        self.assertEqual(form["candidates"], 4)
        difficulties = {item["itemId"]: item["difficulty"] for item in form["items"]}
        self.assertAlmostEqual(difficulties["i0"], 1.0)
        self.assertAlmostEqual(difficulties["i3"], 0.25)
        self.assertIsNotNone(form["kr20"])
        self.assertIsNone(difficulties and next(item["discrimination"] for item in form["items"] if item["itemId"] == "i0"))
        self.assertIsNotNone(point_biserial([True, True, False, False], [3.0, 2.0, 1.0, 0.0]))

    def test_kr20_needs_score_variance(self) -> None:
        self.assertIsNone(kuder_richardson_20([[True, True], [True, True]]))

    def test_match_metrics_separate_ranking_quality_from_unsafe_rate(self) -> None:
        rows = [
            {"match_run_id": "r1", "candidate_id": "a", "rank": "1", "expert_relevance": "3", "expert_top_k": "true", "unsafe_recommendation": "false", "system_flagged_unsafe": "false"},
            {"match_run_id": "r1", "candidate_id": "b", "rank": "2", "expert_relevance": "1", "expert_top_k": "false", "unsafe_recommendation": "true", "system_flagged_unsafe": "false"},
        ]
        result = match_metrics(rows, top_k=1)
        self.assertEqual(result["runs"], 1)
        self.assertAlmostEqual(result["ndcgAt1"]["mean"] or 0, 1.0)
        self.assertAlmostEqual(result["expertTop1Agreement"]["mean"] or 0, 1.0)
        self.assertAlmostEqual(result["unsafeRecommendationRate"]["value"] or 0, 0.5)
        # An unsafe candidate the system never flagged is a false negative.
        self.assertEqual(result["unsafeDetection"]["falseNegative"], 1)


class PrimaryMetricsRunnerTests(unittest.TestCase):
    def test_runner_refuses_demo_inputs_unless_allowed(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "results"
            self.assertEqual(run_primary_metrics(["--output-dir", str(output)]), 2)
            self.assertFalse(output.exists())

    def test_runner_computes_every_report_and_records_input_hashes(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "results"
            self.assertEqual(run_primary_metrics(["--output-dir", str(output), "--allow-demo"]), 0)
            index = json.loads((output / "primary_metrics.index.json").read_text(encoding="utf-8"))
            names = {report["name"] for report in index["reports"]}
            self.assertEqual(names, {"travel", "guide", "match", "items"})
            for report in index["reports"]:
                self.assertTrue(Path(report["outputJson"]).is_file())
                self.assertEqual(len(report["inputSha256"]), 64)
                self.assertIn("DEMO_RESEARCH_GENERATED", report["dataStatuses"])


if __name__ == "__main__":
    unittest.main()
