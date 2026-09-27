#!/usr/bin/env python3
"""Build the tourism RAG corpus (research/data/corpus/*.jsonl) from cited sources.

Two collectors, both reproducible from cached raw text:

* laws      - official legalinfo.mn texts. Mongolian official legal texts are not
              protected by copyright, so articles are kept verbatim and chunked
              per article with a "law / chapter / article" header.
* wikipedia - Wikipedia articles (CC BY-SA 4.0) fetched through the MediaWiki API
              with their revision id. Discovery-tier (plan section 10.2 tier 6):
              retrieval ranks them below official sources and a reviewer must
              corroborate claims before verification.

    python3 -m research.scripts.build_corpus fetch-laws   # refresh raw law text
    python3 -m research.scripts.build_corpus fetch-wiki   # refresh raw articles
    python3 -m research.scripts.build_corpus build        # write corpus JSONL

Every row follows research/docs/DATASET_FORMATS.md (tourism knowledge rows) with
dataStatus SOURCE_DERIVED_DRAFT and provenance.humanReviewed=false.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import subprocess
import sys
import time
import urllib.parse
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
RAW = DATA / "raw"
CORPUS = DATA / "corpus"
USER_AGENT = "ElchThesisResearch/1.0 (bachelor thesis tourism corpus)"
MAX_CHARS = 1400
TARGET_CHARS = 1000
ACCESSED = "2026-09-28"

# id -> (legalinfo path, English translation is current?, metadata)
LAWS: dict[str, dict[str, Any]] = {
    "law-tourism-2023": {"path": "detail?lawId=16759637037101", "english": True, "titleMn": "Аялал жуулчлалын тухай хууль (2023, шинэчилсэн найруулга)", "titleEn": "Law on Tourism (2023, revised)", "category": "LAW"},
    "law-cultural-heritage": {"path": "detail/10439", "english": False, "titleMn": "Соёлын өвийг хамгаалах тухай хууль (2014)", "category": "LAW"},
    "law-protected-areas": {"path": "detail/479", "english": False, "titleMn": "Тусгай хамгаалалттай газар нутгийн тухай хууль", "category": "LAW"},
    "law-protected-area-buffer-zones": {"path": "detail/478", "english": False, "titleMn": "Тусгай хамгаалалттай газар нутгийн орчны бүсийн тухай хууль", "category": "LAW"},
    "law-museum-2021": {"path": "detail?lawId=16160832622081", "english": True, "titleMn": "Музейн тухай хууль (2021)", "titleEn": "Law on Museums (2021)", "category": "LAW"},
    "reg-visa-procedure": {"path": "detail?lawId=16230721365191", "english": False, "titleMn": "Монгол Улсын виз олгох журам", "category": "LAW"},
}

JUNK_LINE = re.compile(r"(lawId\)|\?php|^-->$|^Pdf$|^Word$|^Хэвлэх$|legalinstitute|^\+\(976\)|Сонсох|^A$|^x$|^Хуваалцах$)")
MN_ARTICLE = re.compile(r"^(\d+[⁰¹²³⁴⁵⁶⁷⁸⁹]*)\s*(?:дугаар|дүгээр)\s*зүйл\.?\s*(.*)$", re.IGNORECASE)
EN_ARTICLE = re.compile(r"^Article\s+(\d+)\.?\s*(.*)$", re.IGNORECASE)
MN_CHAPTER = re.compile(r"(БҮЛЭГ$|^(Нэг|Хоёр|Гурав|Дөрөв|Тав|Зургаа|Долоо|Найм|Ес|Арав)\.\S)")
EN_CHAPTER = re.compile(r"^CHAPTER\s+\w+", re.IGNORECASE)


def curl(url: str, timeout: int = 90) -> str:
    for attempt in range(4):
        result = subprocess.run(["curl", "-sSL", "-4", "--max-time", str(timeout), "-A", USER_AGENT, url],
                                capture_output=True, text=True, check=False)
        if result.returncode == 0 and result.stdout:
            return result.stdout
        time.sleep(3 + attempt * 5)
    raise RuntimeError(f"download failed: {url}")


SUPERSCRIPT = str.maketrans("0123456789", "⁰¹²³⁴⁵⁶⁷⁸⁹")


def html_to_lines(page: str) -> list[str]:
    page = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", "", page)
    # Inserted articles are numbered 2<sup>1</sup> ("2¹"); stripping the tag would turn them into article 21.
    page = re.sub(r"(?i)<sup>\s*(\d+)\s*</sup>", lambda match: match.group(1).translate(SUPERSCRIPT), page)
    page = re.sub(r"(?i)<br\s*/?>|</p>|</div>|</li>|</tr>|</h\d>", "\n", page)
    text = html.unescape(re.sub(r"<[^>]+>", "", page))
    text = re.sub(r"[ \t\xa0]+", " ", text)
    return [line.strip() for line in text.splitlines()]


def split_segments(lines: list[str]) -> list[list[str]]:
    segments, current = [], []
    for line in lines:
        if line.startswith("Сонсох"):
            segments.append(current)
            current = []
        else:
            current.append(line)
    segments.append(current)
    return segments


# Some legalinfo texts type the digit 3 as Cyrillic "З" in numbering ("1З дугаар зүйл",
# "З.Энэ зүйлийн"). Only numbering positions are normalised; prose is left verbatim.
MISTYPED_THREE = [
    (re.compile(r"(?<=\d)З(?=[\d.\s]*(?:дугаар|дүгээр)\s+зүйл)"), "3"),
    (re.compile(r"^З(?=\s*(?:дугаар|дүгээр)\s+зүйл)"), "3"),
    (re.compile(r"^З(?=\.\S)"), "3"),
    (re.compile(r"(?<=\d)З(?=\.\d)"), "3"),
]


def clean(lines: Iterable[str]) -> list[str]:
    out = []
    for line in lines:
        line = re.sub(r"^Хэвлэх", "", line).replace("www.Legalinfo.mn - Хуулийн нэгдсэн портал", "").strip()
        for pattern, replacement in MISTYPED_THREE:
            line = pattern.sub(replacement, line)
        if line and not JUNK_LINE.search(line):
            out.append(line)
    return out


def extract_law(page: str, english: bool) -> dict[str, list[str]]:
    segments = split_segments(html_to_lines(page))[1:]  # segment 0 carries the site navigation
    def lower(seg): return len(re.findall(r"[а-яөү]", " ".join(seg)))
    def upper(seg): return len(re.findall(r"[А-ЯӨҮ]", " ".join(seg)))
    mixed = [seg for seg in segments if lower(seg) > 1500 and upper(seg) < 0.2 * lower(seg)]
    if not mixed:
        raise ValueError("no mixed-case Mongolian body found")
    mn = clean(max(mixed, key=lower))
    head = " ".join(mn[:12])
    # Refuse repealed acts and amendment-only acts: they must never enter the corpus as current law.
    if re.search(r"хүчингүй болсонд тооцсон", head, re.IGNORECASE) or re.search(r"НЭМЭЛТ,? ӨӨРЧЛӨЛТ ОРУУЛАХ ТУХАЙ", head):
        raise ValueError(f"not a current consolidated act: {head[:160]}")
    end = next((i for i in range(len(mn) - 1, 0, -1) if re.search(r"(ИХ ХУРЛЫН ДАРГА|ЕРӨНХИЙ САЙД|САЙД\s)", mn[i])), len(mn) - 1)
    result = {"mn": mn[: end + 1]}
    if english:
        candidates = [seg for seg in segments if len(re.findall(r"\bshall\b", " ".join(seg))) > 20]
        if candidates:
            en = clean(max(candidates, key=lambda seg: len(re.findall(r"\bshall\b", " ".join(seg)))))
            start = next((i for i, line in enumerate(en) if line.startswith("LAW OF MONGOLIA")), 0)
            stop = next((i for i in range(len(en) - 1, start, -1) if "CHAIRMAN" in en[i].upper()), len(en) - 1)
            result["en"] = en[start: stop + 1]
    return result


def fetch_laws() -> None:
    target = RAW / "laws"
    target.mkdir(parents=True, exist_ok=True)
    for law_id, meta in LAWS.items():
        extracted = extract_law(curl(f"https://legalinfo.mn/mn/{meta['path']}"), meta["english"])
        for language, lines in extracted.items():
            (target / f"{law_id}.{language}.txt").write_text("\n".join(lines) + "\n", "utf-8")
            print(f"{law_id}.{language}: {len(lines)} lines, {sum(map(len, lines))} chars")


def pack(header: str, paragraphs: list[str]) -> list[str]:
    """Greedy paragraph packing under MAX_CHARS; every chunk repeats the header."""
    chunks, current = [], []
    for paragraph in paragraphs:
        while len(paragraph) > MAX_CHARS:  # rare: one very long paragraph
            cut = paragraph.rfind(" ", 0, TARGET_CHARS) or TARGET_CHARS
            paragraphs_head, paragraph = paragraph[:cut], paragraph[cut:].strip()
            if current:
                chunks.append(current)
                current = []
            chunks.append([paragraphs_head])
        if current and len("\n".join(current)) + len(paragraph) > TARGET_CHARS:
            chunks.append(current)
            current = []
        current.append(paragraph)
    if current:
        chunks.append(current)
    return [f"{header}\n" + "\n".join(chunk) for chunk in chunks]


def law_chunks(law_id: str, language: str, lines: list[str]) -> list[dict[str, Any]]:
    meta = LAWS[law_id]
    title = meta["titleMn"] if language == "mn" else meta["titleEn"]
    article_re, chapter_re = (MN_ARTICLE, MN_CHAPTER) if language == "mn" else (EN_ARTICLE, EN_CHAPTER)
    rows, chapter, chapter_index, article, body = [], "", 0, None, []

    def flush():
        if not body:
            return
        label = (f"Article {article[0]}" if language == "en" else article[2]) if article else ""
        heading = f"{title}" + (f" | {chapter}" if chapter else "") + (f" | {label}. {article[1]}" if article else "")
        for text in pack(heading.strip(), body):
            rows.append({"article": article[0] if article else f"ch{chapter_index}", "content": text})

    lines = list(lines)
    i = 0
    while i < len(lines):
        line = lines[i]
        if chapter_re.search(line) and len(line) < 60:
            flush(); body = []; article = None; chapter_index += 1
            # "ХОЁРДУГААР БҮЛЭГ" is followed by its title line; "Хоёр.Визийн ангилал" carries it inline.
            takes_title = line.endswith("БҮЛЭГ") or bool(EN_CHAPTER.match(line) and len(line.split()) <= 3)
            if takes_title and i + 1 < len(lines) and not article_re.match(lines[i + 1]):
                chapter = f"{line} {lines[i + 1]}"
                i += 2
            else:
                chapter = line
                i += 1
            continue
        match = article_re.match(line)
        if match:
            flush(); body = []
            # Keep the source's own "N дугаар/дүгээр зүйл" wording for the heading.
            article = (match.group(1), match.group(2).strip(), line[: len(line) - len(match.group(2))].strip().rstrip("."))
        else:
            body.append(line)
        i += 1
    flush()
    return [{
        "id": f"{law_id}.{language}.{index:04d}",
        "sourceId": law_id,
        "title": f"{title} - {row['article']}",
        "content": row["content"],
        "category": meta["category"],
        "language": language,
        "region": None,
        "routeFamily": None,
        "lastVerifiedAt": None,
        "splitGroup": f"{law_id}:art{row['article']}",
        "dataStatus": "SOURCE_DERIVED_DRAFT",
        "evaluationOnly": False,
        "provenance": {"sourceIds": [law_id], "humanReviewed": False, "licenseStatus": "OFFICIAL_TEXT_NOT_COPYRIGHTED", "accessedAt": ACCESSED,
                       "url": f"https://legalinfo.mn/mn/{meta['path']}"},
    } for index, row in enumerate(rows)]


def write_jsonl(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")


def build() -> None:
    law_rows = []
    for law_id in LAWS:
        for language in ("mn", "en"):
            path = RAW / "laws" / f"{law_id}.{language}.txt"
            if path.exists():
                law_rows += law_chunks(law_id, language, path.read_text("utf-8").splitlines())
    write_jsonl(CORPUS / "laws.jsonl", law_rows)
    print(f"laws.jsonl: {len(law_rows)} chunks")
    wiki_path = RAW / "wikipedia"
    if wiki_path.exists():
        from research.scripts.corpus_wikipedia import build_rows  # noqa: PLC0415
        from research.scripts.corpus_wikipedia import source_records  # noqa: PLC0415
        (DATA / "sources.wikipedia.json").write_text(json.dumps({
            "schemaVersion": 1,
            "notice": "Generated by build_corpus.py from the fetched Wikipedia revisions - do not edit by hand.",
            "sources": source_records(wiki_path),
        }, ensure_ascii=False, indent=1) + "\n", "utf-8")
        wiki_rows = build_rows(wiki_path, pack)
        write_jsonl(CORPUS / "wikipedia.jsonl", wiki_rows)
        print(f"wikipedia.jsonl: {len(wiki_rows)} chunks")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("command", choices=["fetch-laws", "fetch-wiki", "build"])
    args = parser.parse_args(argv)
    if args.command == "fetch-laws":
        fetch_laws()
    elif args.command == "fetch-wiki":
        from research.scripts.corpus_wikipedia import fetch  # noqa: PLC0415
        fetch(RAW / "wikipedia", curl)
    else:
        build()
    return 0


if __name__ == "__main__":
    sys.exit(main())
