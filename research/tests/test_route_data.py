"""Integrity checks for the draft RouteGraph and source registry in research/data."""

from __future__ import annotations

import json
import unittest
from collections import defaultdict, deque
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "data"
RISK_CLASSES = {"R0", "R1", "R2", "R3", "R4"}
NODE_TYPES = {"CITY", "DESTINATION", "HERITAGE", "MUSEUM", "NATURE", "TRAILHEAD", "TRANSPORT_HUB", "ACCOMMODATION", "OTHER"}
MODES = {"ROAD", "OFF_ROAD", "TREK", "BOAT", "AIR", "RAIL", "HORSE", "OTHER"}
ROUTE_FAMILIES = {"CENTRAL_HERITAGE", "GOBI", "KHUVSGUL", "WESTERN_ALTAI"}
AUTHORITY_LEVELS = {"GOVERNMENT", "LEGAL", "OFFICIAL_TOURISM", "UNESCO", "LOCAL_AUTHORITY", "MUSEUM", "PROTECTED_AREA", "VERIFIED_OPERATOR", "OTHER"}


def load(name: str):
    return json.loads((DATA / name).read_text("utf-8"))


class RouteGraphDataTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.sources = {source["id"]: source for source in load("sources.json")["sources"]}
        cls.pois = load("routegraph/pois.json")["pois"]
        cls.routes = load("routegraph/routes.json")
        cls.edges = load("routegraph/edges.json")["edges"]
        cls.poi_ids = {poi["id"] for poi in cls.pois}

    def test_ids_are_unique(self):
        for label, items in (("poi", self.pois), ("edge", self.edges), ("route", self.routes["routes"])):
            ids = [item["id"] for item in items]
            self.assertEqual(len(ids), len(set(ids)), f"duplicate {label} ids")

    def test_sources_are_pending_and_well_formed(self):
        for source in self.sources.values():
            self.assertEqual(source["reviewStatus"], "PENDING", source["id"])
            self.assertIn(source["authorityLevel"], AUTHORITY_LEVELS, source["id"])
            self.assertIn(source["authorityTier"], range(1, 7), source["id"])
            self.assertTrue(source["url"].startswith("https://"), source["id"])
            self.assertTrue(source["licenseOrUsageNote"].strip(), source["id"])

    def test_pois_are_inside_mongolia_and_cite_coordinates(self):
        for poi in self.pois:
            self.assertTrue(41.5 <= poi["latitude"] <= 52.2 and 87.7 <= poi["longitude"] <= 120.0, poi["id"])
            self.assertIn(poi["type"], NODE_TYPES, poi["id"])
            self.assertIn(poi["coordinate"]["source"], {"wikidata", "osm", "wikipedia"}, poi["id"])
            self.assertIn(poi["coordinate"]["precision"], {"POINT", "AREA_CENTROID", "COARSE"}, poi["id"])
            self.assertTrue(poi["coordinate"]["ref"], poi["id"])
            self.assertTrue(poi["nameMn"] and poi["nameEn"], poi["id"])
            for source_id in poi["sourceIds"]:
                self.assertIn(source_id, self.sources, poi["id"])

    def test_edges_are_consistent_with_topology(self):
        topology = {edge["id"]: edge for edge in self.routes["edges"]}
        self.assertEqual(set(topology), {edge["id"] for edge in self.edges}, "edges.json is stale: re-run compute_route_distances.py")
        for edge in self.edges:
            self.assertIn(edge["from"], self.poi_ids, edge["id"])
            self.assertIn(edge["to"], self.poi_ids, edge["id"])
            self.assertNotEqual(edge["from"], edge["to"], edge["id"])
            self.assertIn(edge["mode"], MODES, edge["id"])
            self.assertIn(edge["riskClass"], RISK_CLASSES, edge["id"])
            self.assertIn(edge["sourceId"], self.sources, edge["id"])
            self.assertGreater(edge["distanceKm"], 0, edge["id"])
            self.assertGreater(edge["nominalMinutes"], 0, edge["id"])
            self.assertEqual(edge["mode"], topology[edge["id"]]["mode"], "edges.json is stale")
            months = edge["openMonths"]
            self.assertTrue(months == "all" or (months and set(months) <= set(range(1, 13))), edge["id"])
            if edge["riskClass"] in {"R2", "R3", "R4"}:
                self.assertIn("first-aid", edge["requiredSkills"], edge["id"])

    def test_each_route_is_connected_and_reaches_its_core_sequence(self):
        for route in self.routes["routes"]:
            self.assertIn(route["routeFamily"], ROUTE_FAMILIES)
            self.assertIn(route["riskClass"], RISK_CLASSES)
            self.assertIn(route["sourceId"], self.sources)
            members = set(route["poiIds"])
            self.assertLessEqual(members, self.poi_ids, route["id"])
            self.assertLessEqual(set(route["coreSequence"]), members, route["id"])
            adjacency = defaultdict(set)
            for edge in self.edges:
                if edge["from"] in members and edge["to"] in members:
                    adjacency[edge["from"]].add(edge["to"])
                    adjacency[edge["to"]].add(edge["from"])
            start = route["coreSequence"][0]
            seen, queue = {start}, deque([start])
            while queue:
                for neighbour in adjacency[queue.popleft()] - seen:
                    seen.add(neighbour)
                    queue.append(neighbour)
            self.assertEqual(seen, members, f"{route['id']} has unreachable nodes: {sorted(members - seen)}")

    def test_core_sequence_follows_direct_edges(self):
        # The validator's ROUTE_CONNECTIVITY rule requires a direct edge between consecutive stops.
        pairs = {frozenset((edge["from"], edge["to"])) for edge in self.edges}
        for route in self.routes["routes"]:
            sequence = route["coreSequence"]
            for left, right in zip(sequence, sequence[1:]):
                self.assertIn(frozenset((left, right)), pairs, f"{route['id']}: no edge {left} -> {right}")

    def test_meets_plan_scale_target(self):
        # Plan section 10.1: 100-250 POIs/segments for the core prototype.
        self.assertGreaterEqual(len(self.pois) + len(self.edges), 100)


if __name__ == "__main__":
    unittest.main()
