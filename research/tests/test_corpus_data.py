"""Integrity checks for the draft tourism RAG corpus in research/data/corpus."""

from __future__ import annotations

import hashlib
import json
import unittest
from collections import Counter
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "data"
CATEGORIES = {"HISTORY", "CULTURE", "GEOGRAPHY", "NATURE", "LAW", "SAFETY", "FIRST_AID_REFERENCE", "ROUTE_INFORMATION", "DESTINATION_INFORMATION", "TOURISM_GUIDANCE"}
ROUTE_FAMILIES = {None, "CENTRAL_HERITAGE", "GOBI", "KHUVSGUL", "WESTERN_ALTAI"}


class CorpusDataTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.rows = []
        for path in sorted((DATA / "corpus").glob("*.jsonl")):
            cls.rows += [json.loads(line) for line in path.read_text("utf-8").splitlines() if line.strip()]
        registries = [DATA / "sources.json", DATA / "sources.wikipedia.json"]
        cls.sources = {source["id"]: source for path in registries if path.exists() for source in json.loads(path.read_text("utf-8"))["sources"]}

    def test_corpus_is_not_empty(self):
        self.assertGreater(len(self.rows), 0)

    def test_rows_are_well_formed_drafts(self):
        ids = Counter(row["id"] for row in self.rows)
        self.assertEqual([key for key, count in ids.items() if count > 1], [])
        for row in self.rows:
            self.assertIn(row["sourceId"], self.sources, row["id"])
            self.assertEqual(self.sources[row["sourceId"]]["reviewStatus"], "PENDING", row["id"])
            self.assertEqual(row["dataStatus"], "SOURCE_DERIVED_DRAFT", row["id"])
            self.assertFalse(row["provenance"]["humanReviewed"], row["id"])
            self.assertEqual(row["provenance"]["sourceIds"], [row["sourceId"]], row["id"])
            self.assertIn(row["category"], CATEGORIES, row["id"])
            self.assertIn(row["language"], {"mn", "en"}, row["id"])
            self.assertIn(row["routeFamily"], ROUTE_FAMILIES, row["id"])
            self.assertTrue(row["splitGroup"].startswith(row["sourceId"]), row["id"])
            self.assertTrue(40 <= len(row["content"]) <= 1600, f"{row['id']}: {len(row['content'])} chars")

    def test_no_duplicate_text_within_a_source(self):
        seen = Counter((row["sourceId"], row["language"], hashlib.sha256(row["content"].encode()).hexdigest()) for row in self.rows)
        self.assertEqual([key for key, count in seen.items() if count > 1], [])

    def test_wikipedia_rows_pin_a_revision_and_stay_discovery_tier(self):
        for row in self.rows:
            if row["sourceId"].startswith("wikipedia-"):
                self.assertIn("?oldid=", row["provenance"]["url"], row["id"])
                self.assertEqual(self.sources[row["sourceId"]]["authorityTier"], 6, row["id"])

    def test_first_aid_content_does_not_come_from_the_corpus(self):
        # Plan section 8.6: first-aid knowledge must come from certified training material.
        self.assertFalse([row["id"] for row in self.rows if row["category"] == "FIRST_AID_REFERENCE"])


if __name__ == "__main__":
    unittest.main()
