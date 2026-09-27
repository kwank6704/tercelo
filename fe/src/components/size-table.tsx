"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { baht, type Product } from "@/data/catalog";
import { useCart } from "./cart";
import { QtyStepper } from "./cart-drawer";

export default function SizeTable({ items }: { items: Product[] }) {
  const rims = [...new Set(items.map((p) => p.rim))].sort((a, b) => a - b);
  const [rim, setRim] = useState<number | null>(null);
  const [qty, setQty] = useState<Record<string, number>>({});
  const { add, lines } = useCart();
  const inCart = new Set(lines.map((l) => l.id));
  const rows = items.filter((p) => rim === null || p.rim === rim);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {[null, ...rims].map((r) => (
          <button
            key={r ?? "all"}
            onClick={() => setRim(r)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              rim === r ? "border-amber bg-amber text-coal" : "border-line text-mute hover:border-amber/50 hover:text-white"
            }`}
          >
            {r === null ? "ทุกขอบ" : `R${r}`}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-line">
        <div className="hidden grid-cols-[1.4fr_0.8fr_0.9fr_1fr_1.6fr] gap-4 border-b border-line bg-white/[0.03] px-6 py-3 text-xs tracking-wider text-mute md:grid">
          <span>ขนาด</span>
          <span>ดัชนี</span>
          <span>สต็อก</span>
          <span className="text-right">ราคา/เส้น</span>
          <span />
        </div>
        {rows.map((p) => {
          const q = qty[p.id] ?? Math.min(4, p.stock);
          return (
            <div
              key={p.id}
              className="grid grid-cols-2 items-center gap-3 border-b border-line px-5 py-4 transition-colors last:border-0 hover:bg-white/[0.02] md:grid-cols-[1.4fr_0.8fr_0.9fr_1fr_1.6fr] md:gap-4 md:px-6"
            >
              <span className="font-display text-xl font-bold">{p.size}</span>
              <span className="text-right text-sm text-mute md:text-left">{p.loadSpeed}</span>
              <span className={`text-sm ${p.stock < 20 ? "text-orange-600 dark:text-orange-400" : "text-emerald-600 dark:text-emerald-400"}`}>● {p.stock} เส้น</span>
              <span className="text-right font-display text-lg font-semibold">{baht(p.price)}</span>
              <div className="col-span-2 flex items-center justify-end gap-2 md:col-span-1">
                <QtyStepper value={q} max={p.stock} onChange={(n) => setQty((s) => ({ ...s, [p.id]: Math.max(1, Math.min(n, p.stock)) }))} />
                <button
                  onClick={() => add(p.id, q)}
                  className="flex h-10 items-center gap-1.5 rounded-full bg-amber px-4 text-sm font-semibold text-coal transition hover:scale-105"
                >
                  {inCart.has(p.id) ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                  ใส่ตะกร้า
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
