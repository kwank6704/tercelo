"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { baht, nextTier, patternBySlug } from "@/data/catalog";
import { useCart } from "./cart";
import TreadCanvas from "./tread-canvas";

export function QtyStepper({ value, onChange, max }: { value: number; onChange: (n: number) => void; max: number }) {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white/5">
      <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10" onClick={() => onChange(value - 1)} aria-label="ลดจำนวน">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm tabular-nums">{value}</span>
      <button
        className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10 disabled:opacity-30"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="เพิ่มจำนวน"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function TierProgress({ count }: { count: number }) {
  const next = nextTier(count);
  const pct = Math.min(100, (count / 60) * 100);
  return (
    <div className="rounded-2xl border border-amber/25 bg-amber/[0.06] p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-mute">ส่วนลดตามจำนวน</span>
        <span className="font-semibold text-accent">
          {next ? `อีก ${next.min - count} เส้น รับ ${next.rate * 100}%` : "ได้รับส่วนลดสูงสุด 20% แล้ว"}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-white/10">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-deep to-amber" animate={{ width: `${pct}%` }} />
        {[12, 20, 40, 60].map((t) => (
          <span key={t} className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-ink" style={{ left: `${(t / 60) * 100}%` }} />
        ))}
      </div>
      <div className="relative mt-1.5 h-4 text-[10px] text-mute">
        {[12, 20, 40, 60].map((t) => (
          <span key={t} className="absolute -translate-x-1/2" style={{ left: `${Math.min(96, (t / 60) * 100)}%` }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { open, setOpen, lines, count, subtotal, discount, discountRate, total, setQty, remove } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-line bg-surface"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            role="dialog"
            aria-label="ตะกร้าสินค้า"
          >
            <div className="flex items-center justify-between border-b border-line p-5">
              <h2 className="font-display text-2xl font-bold italic">
                ตะกร้า <span className="text-accent">{count}</span> เส้น
              </h2>
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10" aria-label="ปิด">
                <X className="h-5 w-5" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="h-40 w-16 opacity-60">
                  <TreadCanvas tread="hp" roll="always" speed={0.6} className="h-full w-full" />
                </div>
                <p className="text-mute">ยังไม่มียางในตะกร้า</p>
                <Link href="/tyres" onClick={() => setOpen(false)} className="btn-amber">
                  เลือกยางเลย
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-5">
                  <TierProgress count={count} />
                  {lines.map(({ id, qty, product }) => {
                    const pat = patternBySlug[product.pattern];
                    return (
                      <div key={id} className="group flex gap-4 rounded-2xl border border-line bg-white/[0.02] p-3">
                        <div className="h-24 w-10 shrink-0">
                          <TreadCanvas tread={pat.tread} className="h-full w-full" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold tracking-wider text-accent">{pat.name}</p>
                          <p className="font-display text-lg font-semibold">
                            {product.size} <span className="text-sm text-mute">{product.loadSpeed}</span>
                          </p>
                          <p className="text-sm text-mute">{baht(product.price)} / เส้น</p>
                          <div className="mt-2 flex items-center justify-between">
                            <QtyStepper value={qty} max={product.stock} onChange={(n) => setQty(id, n)} />
                            <button onClick={() => remove(id)} className="text-mute hover:text-red-400" aria-label="ลบ">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2 border-t border-line p-5 text-sm">
                  <div className="flex justify-between text-mute">
                    <span>ราคาสินค้า (รวม VAT)</span>
                    <span className="tabular-nums">{baht(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-mute">
                    <span>ส่วนลดตามจำนวน {discountRate > 0 && `(${discountRate * 100}%)`}</span>
                    <span className="tabular-nums text-accent">−{baht(discount)}</span>
                  </div>
                  <div className="flex items-end justify-between pt-2">
                    <span>ยอดรวม</span>
                    <span className="font-display text-3xl font-bold tabular-nums">{baht(total)}</span>
                  </div>
                  <Link href="/cart" onClick={() => setOpen(false)} className="btn-amber mt-3 w-full justify-center">
                    ดำเนินการสั่งซื้อ
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
