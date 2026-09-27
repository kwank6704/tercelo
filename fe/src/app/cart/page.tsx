"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Copy, MessageCircle, Trash2 } from "lucide-react";
import { baht, lineOrderUrl, patternBySlug } from "@/data/catalog";
import { useCart } from "@/components/cart";
import { QtyStepper, TierProgress } from "@/components/cart-drawer";
import TreadCanvas from "@/components/tread-canvas";

export default function CartPage() {
  const { lines, count, subtotal, discount, discountRate, total, setQty, remove, clear } = useCart();
  const [copied, setCopied] = useState(false);

  // No backend: the order is sent as a LINE message the shop confirms manually.
  const message = [
    "สั่งซื้อยาง TERCELO",
    ...lines.map(({ product: p, qty }) => `• ${patternBySlug[p.pattern].name} ${p.size} ${p.loadSpeed} × ${qty} เส้น = ${baht(p.price * qty)}`),
    `รวม ${count} เส้น ${baht(subtotal)}`,
    discount > 0 ? `ส่วนลด ${discountRate * 100}% −${baht(discount)}` : "",
    `ยอดสุทธิ ${baht(total)} (รวม VAT)`,
  ]
    .filter(Boolean)
    .join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-28 sm:px-6">
      <p className="text-xs font-semibold tracking-[0.25em] text-accent">CHECKOUT</p>
      <h1 className="mt-2 font-display text-5xl font-black italic tracking-tight">สรุปคำสั่งซื้อ</h1>

      {lines.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-line p-16 text-center">
          <p className="text-mute">ตะกร้ายังว่างอยู่</p>
          <Link href="/tyres" className="btn-amber mt-6">
            เลือกยาง
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-3">
            {lines.map(({ id, qty, product: p }) => {
              const pat = patternBySlug[p.pattern];
              return (
                // Phones: controls drop to their own row under the tyre so large text never overflows.
                <div
                  key={id}
                  className="group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 gap-y-3 rounded-3xl border border-line bg-card p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-5"
                >
                  <div className="h-28 w-12 shrink-0">
                    <TreadCanvas tread={pat.tread} className="h-full w-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wider text-accent">{pat.name}</p>
                    <p className="font-display text-2xl font-bold">{p.size}</p>
                    <p className="text-sm text-mute">
                      {p.loadSpeed} · {baht(p.price)} / เส้น
                    </p>
                  </div>
                  <div className="col-span-2 flex flex-row-reverse flex-wrap items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end">
                    <p className="font-display text-xl font-bold tabular-nums">{baht(p.price * qty)}</p>
                    <div className="flex items-center gap-3">
                      <QtyStepper value={qty} max={p.stock} onChange={(n) => setQty(id, n)} />
                      <button onClick={() => remove(id)} className="text-mute hover:text-red-400" aria-label="ลบ">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            <button onClick={clear} className="text-sm text-mute hover:text-white">
              ล้างตะกร้า
            </button>
          </div>

          <aside className="h-fit space-y-4 rounded-3xl border border-line bg-card p-6 lg:sticky lg:top-24">
            <TierProgress count={count} />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-mute">
                <span>{count} เส้น</span>
                <span className="tabular-nums">{baht(subtotal)}</span>
              </div>
              <div className="flex justify-between text-mute">
                <span>ส่วนลด {discountRate > 0 && `${discountRate * 100}%`}</span>
                <span className="tabular-nums text-accent">−{baht(discount)}</span>
              </div>
              <div className="flex items-end justify-between border-t border-line pt-3">
                <span>ยอดสุทธิ (รวม VAT)</span>
                <span className="font-display text-3xl font-bold tabular-nums">{baht(total)}</span>
              </div>
            </div>
            <a href={lineOrderUrl(message)} target="_blank" rel="noreferrer" className="btn-amber w-full justify-center">
              <MessageCircle className="h-4 w-4" /> ส่งคำสั่งซื้อทาง LINE
            </a>
            <button onClick={copy} className="btn-ghost w-full justify-center text-sm">
              {copied ? <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? "คัดลอกแล้ว" : "คัดลอกรายการสั่งซื้อ"}
            </button>
            <p className="text-center text-xs leading-relaxed text-mute">ทีมงานจะยืนยันสต็อก ค่าจัดส่ง และช่องทางชำระเงินกับคุณทาง LINE</p>
          </aside>
        </div>
      )}
    </div>
  );
}
