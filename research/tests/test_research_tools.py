from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from research.scripts.clean_jsonl import clean_records
from research.scripts.common import content_fingerprint, normalize_text
from research.scripts.dedupe_jsonl import deduplicate
from research.scripts.evaluate_csv import cohen_kappa, confusion, fleiss_kappa, pearson, spearman
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


if __name__ == "__main__":
    unittest.main()
