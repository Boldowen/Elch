#!/usr/bin/env python3
"""Rotate multiple-choice options so correct answers are spread evenly over A-D.

Deterministic: items are processed in id order and assigned target letters round
robin; the correct option moves to its target slot and the distractors keep
their relative order. Re-running on a balanced bank is a no-op.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

LETTERS = "ABCD"


def rebalance(items: list[dict]) -> list[dict]:
    choice_items = sorted((item for item in items if item["questionType"] == "MULTIPLE_CHOICE"), key=lambda item: item["id"])
    for index, item in enumerate(choice_items):
        texts = [option[3:] for option in item["responseOptions"]]
        correct = texts.pop(LETTERS.index(item["answerKey"]["correctOption"]))
        target = LETTERS[index % 4]
        texts.insert(LETTERS.index(target), correct)
        item["responseOptions"] = [f"{letter}. {text}" for letter, text in zip(LETTERS, texts)]
        item["answerKey"]["correctOption"] = target
    return items


def main(paths: list[str]) -> int:
    files = {Path(path): [json.loads(line) for line in Path(path).read_text("utf-8").splitlines() if line.strip()] for path in paths}
    rebalance([item for items in files.values() for item in items])
    for path, items in files.items():
        path.write_text("".join(json.dumps(item, ensure_ascii=False) + "\n" for item in items), "utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
