"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { products } from "@/data/catalog";

/** Width → aspect → rim, each list narrowed to sizes that actually exist in stock. */
export default function SizeFinder() {
  const router = useRouter();
  const [w, setW] = useState("");
  const [a, setA] = useState("");
  const [r, setR] = useState("");

  const widths = useMemo(() => [...new Set(products.map((p) => p.width))].sort((x, y) => x - y), []);
  const aspects = useMemo(
    () => [...new Set(products.filter((p) => !w || p.width === +w).map((p) => p.aspect ?? 0))].sort((x, y) => x - y),
    [w],
  );
  const rims = useMemo(
    () =>
      [...new Set(products.filter((p) => (!w || p.width === +w) && (!a || (p.aspect ?? 0) === +a)).map((p) => p.rim))].sort((x, y) => x - y),
    [w, a],
  );
  const matches = products.filter((p) => (!w || p.width === +w) && (!a || (p.aspect ?? 0) === +a) && (!r || p.rim === +r)).length;

  const go = () => {
    const q = new URLSearchParams();
    if (w) q.set("w", w);
    if (a) q.set("a", a);
    if (r) q.set("r", r);
    router.push(`/tyres?${q}`);
  };

  return (
    <div className="rounded-3xl border border-line bg-card/80 p-3 shadow-2xl shadow-black/10 dark:shadow-black/50 backdrop-blur-xl sm:p-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <label className="block">
          <span className="mb-1.5 block px-1 text-xs text-mute">หน้ากว้าง</span>
          <select className="select-field" value={w} onChange={(e) => (setW(e.target.value), setA(""), setR(""))}>
            <option value="">ทั้งหมด</option>
            {widths.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block px-1 text-xs text-mute">ซีรีส์ (แก้มยาง)</span>
          <select className="select-field" value={a} onChange={(e) => (setA(e.target.value), setR(""))}>
            <option value="">ทั้งหมด</option>
            {aspects.map((x) => (
              <option key={x} value={x}>
                {x || "R (ไม่มีซีรีส์)"}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block px-1 text-xs text-mute">ขอบล้อ (นิ้ว)</span>
          <select className="select-field" value={r} onChange={(e) => setR(e.target.value)}>
            <option value="">ทั้งหมด</option>
            {rims.map((x) => (
              <option key={x} value={x}>
                R{x}
              </option>
            ))}
          </select>
        </label>
        <button onClick={go} className="btn-amber h-[50px] self-end justify-center sm:px-7">
          <Search className="h-4 w-4" /> ค้นหา <span className="rounded-full bg-coal/15 px-2 text-xs">{matches}</span>
        </button>
      </div>
    </div>
  );
}
