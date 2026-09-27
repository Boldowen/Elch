#!/usr/bin/env python3
"""Fill RouteGraph edge distances and nominal travel times.

Road and off-road edges use OSRM driving distances over the OpenStreetMap road
network; trek and boat edges use great-circle distance times a route factor; air
edges use great-circle distance. Travel minutes come from the documented speed
model in routes.json, so every value records how it was derived.

OSRM responses are cached in osrm-cache.json so the output is reproducible
offline; pass --refresh to query again. Quality flags mark edges whose OSRM
result is doubtful (waypoints snapped far from the node, or a road distance far
above the straight-line distance). Every value still needs field verification.
"""

from __future__ import annotations

import argparse
import json
import math
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parents[1] / "data" / "routegraph"
OSRM_URL = "https://router.project-osrm.org/route/v1/driving/{coords}?overview=false"
USER_AGENT = "ElchThesisResearch/1.0 (bachelor thesis route data)"
SNAP_WARNING_METERS = 3_000
DETOUR_WARNING_RATIO = 2.5
# OSRM results are rejected (not merely flagged) when the OSM network clearly lacks
# the track: a huge detour, a waypoint snapped far away, or a collapsed route.
REJECT_SNAP_METERS = 15_000
OFFROAD_FALLBACK_FACTOR = 1.4


def haversine_km(a: dict[str, Any], b: dict[str, Any]) -> float:
    lat1, lon1, lat2, lon2 = map(math.radians, (a["latitude"], a["longitude"], b["latitude"], b["longitude"]))
    h = math.sin((lat2 - lat1) / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin((lon2 - lon1) / 2) ** 2
    return 2 * 6371.0088 * math.asin(math.sqrt(h))


def osrm_route(a: dict[str, Any], b: dict[str, Any]) -> dict[str, Any]:
    coords = f"{a['longitude']},{a['latitude']};{b['longitude']},{b['latitude']}"
    for attempt in range(4):
        result = subprocess.run(
            ["curl", "-s", "-4", "--max-time", "60", "-A", USER_AGENT, OSRM_URL.format(coords=coords)],
            capture_output=True, text=True, check=False,
        )
        try:
            body = json.loads(result.stdout)
        except ValueError:
            body = None
        if body and body.get("code") == "Ok":
            route = body["routes"][0]
            return {
                "distanceKm": round(route["distance"] / 1000, 1),
                "durationMinutes": round(route["duration"] / 60),
                "snapMeters": [round(waypoint["distance"]) for waypoint in body["waypoints"]],
            }
        if body and body.get("code") in {"NoRoute", "NoSegment"}:
            return {"error": body["code"]}
        time.sleep(2 + attempt * 5)
    raise RuntimeError(f"OSRM request failed for {coords}")


def compute(pois: dict[str, dict[str, Any]], routes: dict[str, Any], cache: dict[str, Any], refresh: bool) -> list[dict[str, Any]]:
    speeds = routes["speedModel"]["kmPerHour"]
    factor = routes["speedModel"]["routeFactorForNonRoadModes"]
    air_fixed = routes["speedModel"]["airFixedMinutes"]
    output = []
    for edge in routes["edges"]:
        a, b = pois[edge["from"]], pois[edge["to"]]
        straight = haversine_km(a, b)
        flags: list[str] = []
        osrm = None
        if edge["mode"] in {"ROAD", "OFF_ROAD"}:
            key = f"{edge['from']}->{edge['to']}"
            if refresh or key not in cache:
                cache[key] = osrm_route(a, b)
                time.sleep(1)
            osrm = cache[key]
        rejected = None
        if osrm and "distanceKm" in osrm:
            snap = max(osrm["snapMeters"])
            ratio = osrm["distanceKm"] / straight if straight > 1 else 1.0
            if snap > SNAP_WARNING_METERS:
                flags.append(f"OSRM_SNAPPED_{snap}M_FROM_NODE")
            if ratio > DETOUR_WARNING_RATIO:
                flags.append(f"DETOUR_RATIO_{ratio:.1f}")
            if ratio > DETOUR_WARNING_RATIO or ratio < 0.5 or snap > REJECT_SNAP_METERS:
                rejected = osrm["distanceKm"]
        if osrm and "distanceKm" in osrm and rejected is None:
            distance = osrm["distanceKm"]
            basis = "OSRM_OSM_ROAD_NETWORK"
        elif rejected is not None:
            flags.append("OSRM_REJECTED")
            distance = round(max(straight * OFFROAD_FALLBACK_FACTOR, 0.5), 1)
            basis = f"GREAT_CIRCLE_X{OFFROAD_FALLBACK_FACTOR}_OSRM_REJECTED"
        else:
            if osrm:
                flags.append(f"OSRM_{osrm['error']}")
            multiplier = 1.0 if edge["mode"] == "AIR" else factor
            distance = round(max(straight * multiplier, 0.5), 1)
            basis = "GREAT_CIRCLE" if edge["mode"] == "AIR" else f"GREAT_CIRCLE_X{factor}"
        if edge.get("knownIssue"):
            flags.append("KNOWN_ISSUE")
        minutes = distance / speeds[edge["terrain"]] * 60 + (air_fixed if edge["mode"] == "AIR" else 0)
        output.append({
            **edge,
            "distanceKm": distance,
            "distanceBasis": basis,
            "greatCircleKm": round(straight, 1),
            "nominalMinutes": max(5, int(round(minutes / 5) * 5)),
            "timeBasis": f"SPEED_MODEL_{edge['terrain'].upper()}",
            "osrmDistanceKm": osrm.get("distanceKm") if osrm else None,
            "osrmDurationMinutes": osrm.get("durationMinutes") if osrm else None,
            "quality": "LOW" if flags else "ESTIMATE",
            "qualityFlags": flags,
            "openMonthsBasis": "RESEARCH_ASSUMPTION",
            "verificationStatus": "PENDING_FIELD_VERIFICATION",
        })
    return output


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data-dir", type=Path, default=DATA_DIR)
    parser.add_argument("--refresh", action="store_true", help="re-query OSRM instead of using the cache")
    args = parser.parse_args(argv)

    pois = {poi["id"]: poi for poi in json.loads((args.data_dir / "pois.json").read_text("utf-8"))["pois"]}
    routes = json.loads((args.data_dir / "routes.json").read_text("utf-8"))
    missing = sorted({node for edge in routes["edges"] for node in (edge["from"], edge["to"])} - pois.keys())
    if missing:
        print(f"Edges reference unknown POIs: {missing}", file=sys.stderr)
        return 1
    cache_path = args.data_dir / "osrm-cache.json"
    cache = json.loads(cache_path.read_text("utf-8")) if cache_path.exists() else {}
    try:
        edges = compute(pois, routes, cache, args.refresh)
    finally:
        cache_path.write_text(json.dumps(cache, ensure_ascii=False, indent=1, sort_keys=True) + "\n", "utf-8")
    (args.data_dir / "edges.json").write_text(json.dumps({
        "schemaVersion": 1,
        "notice": "Generated by research/scripts/compute_route_distances.py - do not edit by hand; change routes.json/pois.json and re-run. Distances derive from © OpenStreetMap contributors (ODbL).",
        "edges": edges,
    }, ensure_ascii=False, indent=1) + "\n", "utf-8")
    low = [edge for edge in edges if edge["quality"] == "LOW"]
    print(f"{len(edges)} edges written; {len(low)} flagged LOW quality")
    for edge in low:
        print(f"  {edge['id']}: {', '.join(edge['qualityFlags'])} ({edge['distanceKm']} km, straight {edge['greatCircleKm']} km)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
