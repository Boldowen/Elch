"""Wikipedia collector for build_corpus.py (CC BY-SA 4.0, discovery tier).

Each article becomes its own source (pinned to the fetched revision) so a
citation always resolves to the exact text that was chunked. Medical and
first-aid articles are deliberately excluded: first-aid content must come from
certified training material (plan section 8.6).
"""

from __future__ import annotations

import json
import re
import time
import urllib.parse
from pathlib import Path
from typing import Any, Callable

# (language, title, routeFamily or None, region or None, category)
ARTICLES: list[tuple[str, str, str | None, str | None, str]] = [
    # Central Mongolia heritage
    ("en", "Ulaanbaatar", "CENTRAL_HERITAGE", "Ulaanbaatar", "DESTINATION_INFORMATION"),
    ("en", "Chinggis Khaan National Museum", "CENTRAL_HERITAGE", "Ulaanbaatar", "HISTORY"),
    ("en", "Gandantegchinlen Monastery", "CENTRAL_HERITAGE", "Ulaanbaatar", "CULTURE"),
    ("en", "Choijin Lama Temple", "CENTRAL_HERITAGE", "Ulaanbaatar", "CULTURE"),
    ("en", "Bogd Khan Palace Museum", "CENTRAL_HERITAGE", "Ulaanbaatar", "HISTORY"),
    ("en", "Khustain Nuruu National Park", "CENTRAL_HERITAGE", "Tuv", "NATURE"),
    ("en", "Przewalski's horse", "CENTRAL_HERITAGE", "Tuv", "NATURE"),
    ("en", "Kharkhorin", "CENTRAL_HERITAGE", "Uvurkhangai", "DESTINATION_INFORMATION"),
    ("en", "Karakorum", "CENTRAL_HERITAGE", "Uvurkhangai", "HISTORY"),
    ("en", "Erdene Zuu Monastery", "CENTRAL_HERITAGE", "Uvurkhangai", "CULTURE"),
    ("en", "Orkhon Valley", "CENTRAL_HERITAGE", "Uvurkhangai", "HISTORY"),
    ("en", "Orkhon inscriptions", "CENTRAL_HERITAGE", "Arkhangai", "HISTORY"),
    ("en", "Ordu-Baliq", "CENTRAL_HERITAGE", "Arkhangai", "HISTORY"),
    ("en", "Uyghur Khaganate", "CENTRAL_HERITAGE", None, "HISTORY"),
    ("en", "Göktürks", "CENTRAL_HERITAGE", None, "HISTORY"),
    ("en", "Second Turkic Khaganate", "CENTRAL_HERITAGE", None, "HISTORY"),
    ("en", "Bilge Qaghan", "CENTRAL_HERITAGE", None, "HISTORY"),
    ("en", "Kul Tigin", "CENTRAL_HERITAGE", None, "HISTORY"),
    ("en", "Shankh Monastery", "CENTRAL_HERITAGE", "Uvurkhangai", "CULTURE"),
    ("en", "Tövkhön Monastery", "CENTRAL_HERITAGE", "Uvurkhangai", "CULTURE"),
    ("en", "Zanabazar", "CENTRAL_HERITAGE", None, "CULTURE"),
    ("en", "Orkhon River", "CENTRAL_HERITAGE", None, "GEOGRAPHY"),
    ("en", "Ulaan Tsutgalan Waterfall", "CENTRAL_HERITAGE", "Uvurkhangai", "NATURE"),
    ("en", "Arkhangai Province", "CENTRAL_HERITAGE", "Arkhangai", "GEOGRAPHY"),
    ("en", "Övörkhangai Province", "CENTRAL_HERITAGE", "Uvurkhangai", "GEOGRAPHY"),
    ("en", "Tsetserleg, Arkhangai", "CENTRAL_HERITAGE", "Arkhangai", "DESTINATION_INFORMATION"),
    ("en", "Terkhiin Tsagaan Lake", "CENTRAL_HERITAGE", "Arkhangai", "NATURE"),
    ("en", "Khorgo", "CENTRAL_HERITAGE", "Arkhangai", "NATURE"),
    ("en", "Khangai Mountains", "CENTRAL_HERITAGE", None, "GEOGRAPHY"),
    ("en", "Amarbayasgalant Monastery", "KHUVSGUL", "Selenge", "CULTURE"),
    # History and society (general guide knowledge)
    ("en", "History of Mongolia", None, None, "HISTORY"),
    ("en", "Xiongnu", None, None, "HISTORY"),
    ("en", "Rouran Khaganate", None, None, "HISTORY"),
    ("en", "Liao dynasty", None, None, "HISTORY"),
    ("en", "Mongol Empire", None, None, "HISTORY"),
    ("en", "Genghis Khan", None, None, "HISTORY"),
    ("en", "Ögedei Khan", None, None, "HISTORY"),
    ("en", "Möngke Khan", None, None, "HISTORY"),
    ("en", "Kublai Khan", None, None, "HISTORY"),
    ("en", "Yuan dynasty", None, None, "HISTORY"),
    ("en", "Northern Yuan", None, None, "HISTORY"),
    ("en", "Mongolia under Qing rule", None, None, "HISTORY"),
    ("en", "Bogd Khanate of Mongolia", None, None, "HISTORY"),
    ("en", "Mongolian People's Republic", None, None, "HISTORY"),
    ("en", "Mongolian Revolution of 1990", None, None, "HISTORY"),
    ("en", "Politics of Mongolia", None, None, "LAW"),
    ("en", "Administrative divisions of Mongolia", None, None, "GEOGRAPHY"),
    ("en", "Economy of Mongolia", None, None, "TOURISM_GUIDANCE"),
    ("en", "Demographics of Mongolia", None, None, "CULTURE"),
    ("en", "Tourism in Mongolia", None, None, "TOURISM_GUIDANCE"),
    ("en", "Visa policy of Mongolia", None, None, "TOURISM_GUIDANCE"),
    ("en", "Mongolian tögrög", None, None, "TOURISM_GUIDANCE"),
    # Religion and culture
    ("en", "Buddhism in Mongolia", None, None, "CULTURE"),
    ("en", "Tengrism", None, None, "CULTURE"),
    ("en", "Ovoo", None, None, "CULTURE"),
    ("en", "Naadam", None, None, "CULTURE"),
    ("en", "Mongolian wrestling", None, None, "CULTURE"),
    ("en", "Tsagaan Sar", None, None, "CULTURE"),
    ("en", "Yurt", None, None, "CULTURE"),
    ("en", "Mongolian cuisine", None, None, "CULTURE"),
    ("en", "Airag", None, None, "CULTURE"),
    ("en", "Morin khuur", None, None, "CULTURE"),
    ("en", "Khöömei", None, None, "CULTURE"),
    ("en", "Mongolian script", None, None, "CULTURE"),
    ("en", "Deel (clothing)", None, None, "CULTURE"),
    ("en", "Deer stone", None, None, "HISTORY"),
    ("en", "Slab-grave culture", None, None, "HISTORY"),
    # Geography and nature
    ("en", "Geography of Mongolia", None, None, "GEOGRAPHY"),
    ("en", "Climate of Mongolia", None, None, "GEOGRAPHY"),
    ("en", "Protected areas of Mongolia", None, None, "NATURE"),
    ("en", "Wildlife of Mongolia", None, None, "NATURE"),
    ("en", "Snow leopard", None, None, "NATURE"),
    ("en", "Argali", None, None, "NATURE"),
    ("en", "Mongolian gazelle", None, None, "NATURE"),
    # Gobi
    ("en", "Gobi Desert", "GOBI", None, "GEOGRAPHY"),
    ("en", "Ömnögovi Province", "GOBI", "Umnugovi", "GEOGRAPHY"),
    ("en", "Dundgovi Province", "GOBI", "Dundgovi", "GEOGRAPHY"),
    ("en", "Dalanzadgad", "GOBI", "Umnugovi", "DESTINATION_INFORMATION"),
    ("en", "Mandalgovi", "GOBI", "Dundgovi", "DESTINATION_INFORMATION"),
    ("en", "Gobi Gurvansaikhan National Park", "GOBI", "Umnugovi", "NATURE"),
    ("en", "Yolyn Am", "GOBI", "Umnugovi", "NATURE"),
    ("en", "Khongoryn Els", "GOBI", "Umnugovi", "NATURE"),
    ("en", "Flaming Cliffs", "GOBI", "Umnugovi", "HISTORY"),
    ("en", "Djadochta Formation", "GOBI", "Umnugovi", "GEOGRAPHY"),
    ("en", "Nemegt Formation", "GOBI", "Umnugovi", "GEOGRAPHY"),
    ("en", "Barun Goyot Formation", "GOBI", "Umnugovi", "GEOGRAPHY"),
    ("en", "Velociraptor", "GOBI", None, "NATURE"),
    ("en", "Protoceratops", "GOBI", None, "NATURE"),
    ("en", "Oviraptor", "GOBI", None, "NATURE"),
    ("en", "Tarbosaurus", "GOBI", None, "NATURE"),
    ("en", "Fighting Dinosaurs", "GOBI", None, "HISTORY"),
    ("en", "Roy Chapman Andrews", "GOBI", None, "HISTORY"),
    ("en", "Ongi Monastery", "GOBI", "Dundgovi", "CULTURE"),
    ("en", "Bactrian camel", "GOBI", None, "NATURE"),
    ("en", "Gobi bear", "GOBI", None, "NATURE"),
    ("en", "Haloxylon ammodendron", "GOBI", None, "NATURE"),
    # Khuvsgul
    ("en", "Lake Khövsgöl", "KHUVSGUL", "Khuvsgul", "NATURE"),
    ("en", "Khövsgöl Province", "KHUVSGUL", "Khuvsgul", "GEOGRAPHY"),
    ("en", "Mörön, Khövsgöl", "KHUVSGUL", "Khuvsgul", "DESTINATION_INFORMATION"),
    ("en", "Khatgal", "KHUVSGUL", "Khuvsgul", "DESTINATION_INFORMATION"),
    ("en", "Darkhad Valley", "KHUVSGUL", "Khuvsgul", "GEOGRAPHY"),
    ("en", "Dukha people", "KHUVSGUL", "Khuvsgul", "CULTURE"),
    ("en", "Selenga River", "KHUVSGUL", None, "GEOGRAPHY"),
    ("en", "Bulgan Province", "KHUVSGUL", "Bulgan", "GEOGRAPHY"),
    ("en", "Uran Togoo - Tulga Uul Natural Monument", "KHUVSGUL", "Bulgan", "NATURE"),
    ("en", "Siberian larch", "KHUVSGUL", None, "NATURE"),
    # Western Altai
    ("en", "Bayan-Ölgii Province", "WESTERN_ALTAI", "Bayan-Ulgii", "GEOGRAPHY"),
    ("en", "Ölgii", "WESTERN_ALTAI", "Bayan-Ulgii", "DESTINATION_INFORMATION"),
    ("en", "Kazakhs in Mongolia", "WESTERN_ALTAI", "Bayan-Ulgii", "CULTURE"),
    ("en", "Berkutchi", "WESTERN_ALTAI", "Bayan-Ulgii", "CULTURE"),
    ("en", "Golden Eagle Festival", "WESTERN_ALTAI", "Bayan-Ulgii", "CULTURE"),
    ("en", "Altai Tavan Bogd National Park", "WESTERN_ALTAI", "Bayan-Ulgii", "NATURE"),
    ("en", "Khüiten Peak", "WESTERN_ALTAI", "Bayan-Ulgii", "GEOGRAPHY"),
    ("en", "Potanin Glacier", "WESTERN_ALTAI", "Bayan-Ulgii", "GEOGRAPHY"),
    ("en", "Khoton Lake", "WESTERN_ALTAI", "Bayan-Ulgii", "NATURE"),
    ("en", "Khurgan Lake", "WESTERN_ALTAI", "Bayan-Ulgii", "NATURE"),
    ("en", "Tolbo Lake", "WESTERN_ALTAI", "Bayan-Ulgii", "NATURE"),
    ("en", "Petroglyphic Complexes of the Mongolian Altai", "WESTERN_ALTAI", "Bayan-Ulgii", "HISTORY"),
    ("en", "Altai Mountains", "WESTERN_ALTAI", None, "GEOGRAPHY"),
    ("en", "Pazyryk culture", "WESTERN_ALTAI", None, "HISTORY"),
    ("en", "Balbal", "WESTERN_ALTAI", None, "HISTORY"),
    ("en", "Tuvans", "WESTERN_ALTAI", None, "CULTURE"),
    # Mongolian-language articles
    ("mn", "Улаанбаатар", "CENTRAL_HERITAGE", "Ulaanbaatar", "DESTINATION_INFORMATION"),
    ("mn", "Хархорум", "CENTRAL_HERITAGE", "Uvurkhangai", "HISTORY"),
    ("mn", "Эрдэнэ зуу", "CENTRAL_HERITAGE", "Uvurkhangai", "CULTURE"),
    ("mn", "Орхоны хөндий", "CENTRAL_HERITAGE", "Uvurkhangai", "HISTORY"),
    ("mn", "Орхон гол", "CENTRAL_HERITAGE", None, "GEOGRAPHY"),
    ("mn", "Хөшөө цайдамын дурсгал", "CENTRAL_HERITAGE", "Arkhangai", "HISTORY"),
    ("mn", "Хар балгас", "CENTRAL_HERITAGE", "Arkhangai", "HISTORY"),
    ("mn", "Төвхөн хийд", "CENTRAL_HERITAGE", "Uvurkhangai", "CULTURE"),
    ("mn", "Занабазар", "CENTRAL_HERITAGE", None, "CULTURE"),
    ("mn", "Архангай", "CENTRAL_HERITAGE", "Arkhangai", "GEOGRAPHY"),
    ("mn", "Өвөрхангай", "CENTRAL_HERITAGE", "Uvurkhangai", "GEOGRAPHY"),
    ("mn", "Тэрхийн цагаан нуур", "CENTRAL_HERITAGE", "Arkhangai", "NATURE"),
    ("mn", "Хустайн нуруу", "CENTRAL_HERITAGE", "Tuv", "NATURE"),
    ("mn", "Тахь", "CENTRAL_HERITAGE", "Tuv", "NATURE"),
    ("mn", "Гандантэгчэнлин хийд", "CENTRAL_HERITAGE", "Ulaanbaatar", "CULTURE"),
    ("mn", "Амарбаясгалант хийд", "KHUVSGUL", "Selenge", "CULTURE"),
    ("mn", "Монголын түүх", None, None, "HISTORY"),
    ("mn", "Хүннү", None, None, "HISTORY"),
    ("mn", "Түрэгийн хаант улс", None, None, "HISTORY"),
    ("mn", "Уйгурын хаант улс", None, None, "HISTORY"),
    ("mn", "Их Монгол Улс", None, None, "HISTORY"),
    ("mn", "Чингис хаан", None, None, "HISTORY"),
    ("mn", "Богд хаант Монгол Улс", None, None, "HISTORY"),
    ("mn", "Монгол дахь Буддын шашин", None, None, "CULTURE"),
    ("mn", "Наадам", None, None, "CULTURE"),
    ("mn", "Цагаан сар", None, None, "CULTURE"),
    ("mn", "Монгол гэр", None, None, "CULTURE"),
    ("mn", "Морин хуур", None, None, "CULTURE"),
    ("mn", "Хөөмий", None, None, "CULTURE"),
    ("mn", "Монгол бөх", None, None, "CULTURE"),
    ("mn", "Буган хөшөө", None, None, "HISTORY"),
    ("mn", "Овоо", None, None, "CULTURE"),
    ("mn", "Монгол Улсын газарзүй", None, None, "GEOGRAPHY"),
    ("mn", "Говь", "GOBI", None, "GEOGRAPHY"),
    ("mn", "Өмнөговь", "GOBI", "Umnugovi", "GEOGRAPHY"),
    ("mn", "Дундговь", "GOBI", "Dundgovi", "GEOGRAPHY"),
    ("mn", "Говь гурван сайхан", "GOBI", "Umnugovi", "NATURE"),
    ("mn", "Ёлын ам", "GOBI", "Umnugovi", "NATURE"),
    ("mn", "Хонгорын элс", "GOBI", "Umnugovi", "NATURE"),
    ("mn", "Баянзаг", "GOBI", "Umnugovi", "HISTORY"),
    ("mn", "Тарбозавр", "GOBI", None, "NATURE"),
    ("mn", "Хоёр бөхт тэмээ", "GOBI", None, "NATURE"),
    ("mn", "Мазаалай", "GOBI", None, "NATURE"),
    ("mn", "Хөвсгөл нуур", "KHUVSGUL", "Khuvsgul", "NATURE"),
    ("mn", "Хөвсгөл аймаг", "KHUVSGUL", "Khuvsgul", "GEOGRAPHY"),
    ("mn", "Мөрөн", "KHUVSGUL", "Khuvsgul", "DESTINATION_INFORMATION"),
    ("mn", "Цаатан", "KHUVSGUL", "Khuvsgul", "CULTURE"),
    ("mn", "Дархадын хотгор", "KHUVSGUL", "Khuvsgul", "GEOGRAPHY"),
    ("mn", "Баян-Өлгий", "WESTERN_ALTAI", "Bayan-Ulgii", "GEOGRAPHY"),
    ("mn", "Алтай Таван Богд", "WESTERN_ALTAI", "Bayan-Ulgii", "NATURE"),
    ("mn", "Хүйтэн оргил", "WESTERN_ALTAI", "Bayan-Ulgii", "GEOGRAPHY"),
    ("mn", "Монгол Алтайн нуруу", "WESTERN_ALTAI", None, "GEOGRAPHY"),
    ("mn", "Монгол Алтайн нурууны хадны зургийн цогцолбор", "WESTERN_ALTAI", "Bayan-Ulgii", "HISTORY"),
    ("mn", "Ирвэс", None, None, "NATURE"),
]

SKIP_SECTIONS = re.compile(
    r"^(references|see also|external links|notes|further reading|bibliography|sources|citations|gallery|footnotes|"
    r"эх сурвалж|ишлэл|мөн үзэх|гадаад холбоос|холбоос|тайлбар|зүүлт|ном зүй|цомог)$",
    re.IGNORECASE,
)
MIN_PARAGRAPH = 40


def source_id(language: str, title: str) -> str:
    import hashlib
    ascii_part = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return f"wikipedia-{language}-" + (ascii_part if ascii_part else hashlib.sha1(title.encode()).hexdigest()[:10])


def fetch(target: Path, curl: Callable[[str], str]) -> None:
    target.mkdir(parents=True, exist_ok=True)
    missing = []
    for language, title, *_ in ARTICLES:
        path = target / f"{source_id(language, title)}.json"
        if path.exists():
            continue
        query = urllib.parse.urlencode({
            "action": "query", "prop": "extracts|revisions|info", "explaintext": 1, "exsectionformat": "wiki",
            "rvprop": "ids|timestamp", "inprop": "url", "redirects": 1, "titles": title, "format": "json", "formatversion": 2,
        })
        body = None
        for attempt in range(5):
            try:
                body = json.loads(curl(f"https://{language}.wikipedia.org/w/api.php?{query}"))
                break
            except (ValueError, RuntimeError):
                time.sleep(5 + attempt * 10)  # throttled or transient error page
        if body is None:
            missing.append(f"{language}:{title} (request failed)")
            continue
        page = body["query"]["pages"][0]
        if page.get("missing") or not page.get("extract"):
            missing.append(f"{language}:{title}")
            continue
        path.write_text(json.dumps({
            "language": language, "requestedTitle": title, "title": page["title"], "pageid": page["pageid"],
            "revid": page["revisions"][0]["revid"], "revisionTimestamp": page["revisions"][0]["timestamp"],
            "url": page["fullurl"], "extract": page["extract"],
        }, ensure_ascii=False, indent=1), "utf-8")
        print(f"{language}:{page['title']} rev {page['revisions'][0]['revid']} ({len(page['extract'])} chars)")
        time.sleep(1.0)
    if missing:
        print("Missing or empty:", ", ".join(missing))


def sections(extract: str) -> list[tuple[str, list[str]]]:
    """Split a plain-text extract on == headings ==, dropping reference-type sections."""
    result: list[tuple[str, list[str]]] = [("", [])]
    for line in extract.splitlines():
        heading = re.match(r"^(=+)\s*(.*?)\s*=+$", line.strip())
        if heading:
            result.append((heading.group(2), []))
        elif len(line.strip()) >= MIN_PARAGRAPH:
            result[-1][1].append(line.strip())
    return [(name, paragraphs) for name, paragraphs in result if paragraphs and not SKIP_SECTIONS.match(name)]


def build_rows(directory: Path, pack: Callable[[str, list[str]], list[str]]) -> list[dict[str, Any]]:
    meta = {(language, title): (family, region, category) for language, title, family, region, category in ARTICLES}
    rows: list[dict[str, Any]] = []
    for path in sorted(directory.glob("*.json")):
        article = json.loads(path.read_text("utf-8"))
        family, region, category = meta.get((article["language"], article["requestedTitle"]), (None, None, "DESTINATION_INFORMATION"))
        sid = path.stem
        index = 0
        for section, paragraphs in sections(article["extract"]):
            header = f"Wikipedia: {article['title']}" + (f" | {section}" if section else "")
            for text in pack(header, paragraphs):
                rows.append({
                    "id": f"{sid}.{index:04d}",
                    "sourceId": sid,
                    "title": f"{article['title']}" + (f" - {section}" if section else ""),
                    "content": text,
                    "category": category,
                    "language": article["language"],
                    "region": region,
                    "routeFamily": family,
                    "lastVerifiedAt": None,
                    "splitGroup": f"{sid}:{section or 'lead'}",
                    "dataStatus": "SOURCE_DERIVED_DRAFT",
                    "evaluationOnly": False,
                    "provenance": {
                        "sourceIds": [sid], "humanReviewed": False, "licenseStatus": "CC_BY_SA_4_0_ATTRIBUTION_REQUIRED",
                        "url": f"{article['url']}?oldid={article['revid']}", "revisionTimestamp": article["revisionTimestamp"],
                    },
                })
                index += 1
    return rows


def source_records(directory: Path) -> list[dict[str, Any]]:
    """Registry entries for every fetched article (merged by the importer)."""
    records = []
    for path in sorted(directory.glob("*.json")):
        article = json.loads(path.read_text("utf-8"))
        records.append({
            "id": path.stem,
            "title": f"Wikipedia ({article['language']}): {article['title']}",
            "organization": "Wikipedia contributors",
            "sourceType": "ARTICLE",
            "authorityLevel": "OTHER",
            "authorityTier": 6,
            "url": f"{article['url']}?oldid={article['revid']}",
            "language": article["language"],
            "publishedAt": article["revisionTimestamp"][:10],
            "accessedAt": "2026-09-28",
            "licenseOrUsageNote": "CC BY-SA 4.0: attribute Wikipedia contributors and link the revision; share-alike applies to derived text. Discovery tier - corroborate claims with official sources before verification.",
            "reviewStatus": "PENDING",
            "usedFor": ["tourism RAG corpus"],
        })
    return records
