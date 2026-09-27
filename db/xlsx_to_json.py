"""Convert the TERCELO price sheet (ราคา.xlsx) into the JSON the website reads.

Usage:
    python db/xlsx_to_json.py "C:/Users/ASUS/Downloads/ราคา.xlsx"

Writes fe/src/data/products.json. Rows with the same size + load index + pattern
are merged and their stock quantities summed.
"""

import json
import re
import sys
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "fe" / "src" / "data" / "products.json"

SIZE_RE = re.compile(r"^(LT)?(\d{3})(?:/(\d{2}))?(Z?R)(\d{2})(C|LT)?$")


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def parse_size(size: str):
    m = SIZE_RE.match(size.replace(" ", "").upper())
    if not m:
        raise ValueError(f"Unrecognised size: {size}")
    lt_prefix, width, aspect, construction, rim, suffix = m.groups()
    return {
        "width": int(width),
        "aspect": int(aspect) if aspect else None,
        "rim": int(rim),
        "zr": construction == "ZR",
        "commercial": suffix == "C",
        "lt": bool(lt_prefix) or suffix == "LT",
    }


def main(path: str):
    ws = openpyxl.load_workbook(path, data_only=True).active
    merged: dict[str, dict] = {}
    for row in ws.iter_rows(min_row=2, values_only=True):
        size, li, pattern, qty, net, _incl = row[:6]
        if not size or not pattern:
            continue
        size = str(size).strip().upper()
        li = re.sub(r"\s+", "", str(li).strip().upper())
        pattern = str(pattern).strip().upper()
        key = f"{size}|{li}|{pattern}"
        if key in merged:
            merged[key]["stock"] += int(qty or 0)
            continue
        merged[key] = {
            "id": slug(f"{pattern}-{size}-{li}"),
            "pattern": slug(pattern),
            "size": size,
            "loadSpeed": li,
            **parse_size(size),
            "stock": int(qty or 0),
            "netPrice": float(net),
            # Price shown on the site: net + 7% VAT, rounded to whole baht.
            "price": round(float(net) * 1.07),
        }
    items = sorted(merged.values(), key=lambda p: (p["pattern"], p["rim"], p["width"], p["aspect"] or 0))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(items, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Wrote {len(items)} SKUs to {OUT}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else str(Path.home() / "Downloads" / "ราคา.xlsx"))
