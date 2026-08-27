#!/usr/bin/env python3
"""Shared, standard-library helpers for the research command-line tools."""

from __future__ import annotations

import hashlib
import json
import math
import re
import unicodedata
from collections.abc import Iterable, Iterator, Mapping, Sequence
from pathlib import Path
from typing import Any


JsonObject = dict[str, Any]
_WHITESPACE = re.compile(r"[ \t\f\v]+")
_TOKEN = re.compile(r"[^\W_]+", re.UNICODE)


class JsonlError(ValueError):
    """Raised when a JSONL input cannot be parsed safely."""


def read_jsonl(path: Path) -> Iterator[tuple[int, JsonObject]]:
    """Yield one JSON object per non-empty line with its one-based line number."""

    try:
        handle = path.open("r", encoding="utf-8")
    except OSError as exc:
        raise JsonlError(f"Cannot open {path}: {exc}") from exc
    with handle:
        for line_number, raw_line in enumerate(handle, start=1):
            if not raw_line.strip():
                continue
            try:
                value = json.loads(raw_line)
            except json.JSONDecodeError as exc:
                raise JsonlError(
                    f"{path}:{line_number}: invalid JSON: {exc.msg} at column {exc.colno}",
                ) from exc
            if not isinstance(value, dict):
                raise JsonlError(f"{path}:{line_number}: each JSONL row must be an object")
            yield line_number, value


def write_jsonl(path: Path, records: Iterable[Mapping[str, Any]]) -> None:
    """Write records atomically enough for local research workflows."""

    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.tmp")
    with temporary.open("w", encoding="utf-8", newline="\n") as handle:
        for record in records:
            handle.write(canonical_json(record))
            handle.write("\n")
    temporary.replace(path)


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def get_path(value: Mapping[str, Any], dotted_path: str) -> Any:
    current: Any = value
    for part in dotted_path.split("."):
        if not isinstance(current, Mapping) or part not in current:
            return None
        current = current[part]
    return current


def normalize_text(value: str, *, single_line: bool = False) -> str:
    """Normalize Unicode and whitespace without translating or paraphrasing content."""

    normalized = unicodedata.normalize("NFKC", value)
    normalized = "".join(
        character
        for character in normalized
        if character in "\n\t" or unicodedata.category(character) != "Cc"
    )
    normalized = normalized.replace("\r\n", "\n").replace("\r", "\n")
    lines = [_WHITESPACE.sub(" ", line).strip() for line in normalized.split("\n")]
    if single_line:
        return " ".join(line for line in lines if line).strip()
    return "\n".join(lines).strip()


def normalize_value(value: Any) -> Any:
    if isinstance(value, str):
        return normalize_text(value)
    if isinstance(value, list):
        return [normalize_value(item) for item in value]
    if isinstance(value, dict):
        return {str(key): normalize_value(item) for key, item in value.items()}
    return value


def text_for_fields(record: Mapping[str, Any], fields: Sequence[str]) -> str:
    values: list[str] = []
    for field in fields:
        value = get_path(record, field)
        if value is None:
            continue
        if isinstance(value, str):
            values.append(value)
        else:
            values.append(canonical_json(value))
    return normalize_text(" ".join(values), single_line=True)


def content_fingerprint(record: Mapping[str, Any], fields: Sequence[str]) -> str:
    text = text_for_fields(record, fields).casefold()
    compact = " ".join(_TOKEN.findall(text))
    return hashlib.sha256(compact.encode("utf-8")).hexdigest()


def token_set(record: Mapping[str, Any], fields: Sequence[str]) -> set[str]:
    return set(_TOKEN.findall(text_for_fields(record, fields).casefold()))


def jaccard(left: set[str], right: set[str]) -> float:
    if not left and not right:
        return 1.0
    union = left | right
    return len(left & right) / len(union) if union else 0.0


def stable_bucket(seed: str, value: str) -> float:
    digest = hashlib.sha256(f"{seed}\0{value}".encode("utf-8")).digest()
    return int.from_bytes(digest[:8], "big") / float(2**64)


def group_value(record: Mapping[str, Any], fields: Sequence[str]) -> str:
    values: list[Any] = []
    for field in fields:
        value = get_path(record, field)
        if value in (None, "", []):
            raise ValueError(f"missing split group field {field!r}")
        values.append(value)
    return canonical_json(values)


def parse_csv_list(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def as_float(value: Any) -> float | None:
    if value is None or value == "":
        return None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return number if math.isfinite(number) else None


def as_bool(value: Any) -> bool | None:
    if isinstance(value, bool):
        return value
    if value is None:
        return None
    normalized = str(value).strip().casefold()
    if normalized in {"1", "true", "yes", "y", "pass", "passed", "positive"}:
        return True
    if normalized in {"0", "false", "no", "n", "fail", "failed", "negative"}:
        return False
    return None


def percentile(values: Sequence[float], probability: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    if len(ordered) == 1:
        return ordered[0]
    position = (len(ordered) - 1) * probability
    lower = math.floor(position)
    upper = math.ceil(position)
    if lower == upper:
        return ordered[lower]
    weight = position - lower
    return ordered[lower] * (1 - weight) + ordered[upper] * weight
