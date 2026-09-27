"""Integrity checks for the draft guide question bank in research/data/question-bank."""

from __future__ import annotations

import json
import re
import unittest
from collections import Counter
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "data"
CATEGORIES = {"HISTORY_ARCHAEOLOGY", "RELIGION_CULTURE", "GEOGRAPHY_NATURE", "LAW_ETHICS", "SOCIETY_ECONOMY", "ROUTE_SPECIFIC", "SAFETY", "FIRST_AID_THEORY", "LANGUAGE", "GUIDE_SKILL"}
ARTICLE_REF = re.compile(r"(\d+[¹²³]?)\s*(?:дугаар|дүгээр)\s+зүйл")
PARAGRAPH_REF = re.compile(r"\b(\d+[¹²³]?(?:\.\d+)+)(?=[-\s.,;)]|$)")


def load_jsonl(directory: Path) -> list[dict]:
    rows = []
    for path in sorted(directory.glob("*.jsonl")):
        rows += [json.loads(line) for line in path.read_text("utf-8").splitlines() if line.strip()]
    return rows


class QuestionBankTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.items = load_jsonl(DATA / "question-bank")
        cls.corpus = {row["id"]: row for row in load_jsonl(DATA / "corpus")}

    def test_bank_is_not_empty_and_ids_are_unique(self):
        self.assertGreater(len(self.items), 0)
        duplicates = [key for key, count in Counter(item["id"] for item in self.items).items() if count > 1]
        self.assertEqual(duplicates, [])

    def test_items_are_well_formed_evaluation_only_drafts(self):
        for item in self.items:
            self.assertIn(item["category"], CATEGORIES, item["id"])
            self.assertIn(item["difficulty"], {"BASIC", "INTERMEDIATE", "ADVANCED"}, item["id"])
            self.assertTrue(item["evaluationOnly"], item["id"])
            self.assertEqual(item["dataStatus"], "SOURCE_DERIVED_DRAFT", item["id"])
            self.assertFalse(item["provenance"]["humanReviewed"], item["id"])
            if item["questionType"] == "MULTIPLE_CHOICE":
                options = item["responseOptions"]
                self.assertEqual([option[:2] for option in options], ["A.", "B.", "C.", "D."], item["id"])
                self.assertEqual(len({option[3:].strip().lower() for option in options}), 4, f"{item['id']}: duplicate options")
                self.assertIn(item["answerKey"]["correctOption"], {"A", "B", "C", "D"}, item["id"])

    def test_every_item_quotes_its_evidence_verbatim(self):
        for item in self.items:
            self.assertTrue(item["evidence"], item["id"])
            for evidence in item["evidence"]:
                chunk = self.corpus.get(evidence["corpusId"])
                self.assertIsNotNone(chunk, f"{item['id']}: unknown corpus chunk {evidence['corpusId']}")
                self.assertIn(evidence["quote"], chunk["content"], f"{item['id']}: quote not found verbatim")
                self.assertIn(chunk["sourceId"], item["provenance"]["sourceIds"], item["id"])

    def test_legal_references_in_explanations_match_the_evidence(self):
        # Explanations are free text; any article/paragraph they cite must appear in the quoted chunk.
        for item in self.items:
            # Only legal evidence has article/paragraph numbering ("3.3 million" is not a paragraph).
            if not any(e["corpusId"].startswith(("law-", "reg-")) for e in item["evidence"]):
                continue
            evidence_text = "\n".join(self.corpus[e["corpusId"]]["content"] for e in item["evidence"])
            explanation = item["answerKey"].get("explanation", "")
            for article in ARTICLE_REF.findall(explanation):
                self.assertRegex(evidence_text, rf"(?<![\d.]){re.escape(article)}\s*(?:дугаар|дүгээр)\s*зүйл", f"{item['id']}: article {article}")
            for paragraph in PARAGRAPH_REF.findall(explanation):
                self.assertIn(f"{paragraph}.", evidence_text, f"{item['id']}: paragraph {paragraph} not in evidence")

    def test_answer_keys_are_balanced(self):
        # A skewed key (e.g. mostly "B") lets candidates guess; keep every letter between 15% and 40%.
        keys = Counter(item["answerKey"]["correctOption"] for item in self.items if item["questionType"] == "MULTIPLE_CHOICE")
        total = sum(keys.values())
        for letter in "ABCD":
            self.assertGreaterEqual(keys[letter] / total, 0.15, f"too few {letter} keys: {dict(keys)}")
            self.assertLessEqual(keys[letter] / total, 0.40, f"too many {letter} keys: {dict(keys)}")


if __name__ == "__main__":
    unittest.main()
