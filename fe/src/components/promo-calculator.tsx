"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, Plus, ShoppingBag, Store, Trash2, TrendingUp } from "lucide-react";
import { baht, nextTier, patternBySlug, patterns, productById, products, productsOf, volumeDiscount, volumeTiers } from "@/data/catalog";
import { dealerPlans } from "@/lib/promo";
import { useCart } from "./cart";
import { QtyStepper } from "./cart-drawer";
import TreadCanvas from "./tread-canvas";

type Line = { key: number; id: string; qty: number };

const firstPassenger = products.filter((p) => !p.commercial && !p.lt).sort((a, b) => b.stock - a.stock)[0];
const ladder = [{ min: 0, rate: 0 }, ...[...volumeTiers].reverse()];

/** "Buy this, get that": pick tyres and quantities, see which discount applies and what it costs. */
export default function PromoCalculator() {
  const { add } = useCart();
  const [lines, setLines] = useState<Line[]>([{ key: 1, id: firstPassenger.id, qty: 4 }]);
  const [dealer, setDealer] = useState(false);
  const [added, setAdded] = useState(false);

  const rows = lines.map((l) => ({ ...l, p: productById[l.id] }));
  const count = rows.reduce((n, r) => n + r.qty, 0);
  const gross = rows.reduce((n, r) => n + r.qty * r.p.price, 0);
  const rate = volumeDiscount(count);
  const discount = Math.round(gross * rate);
  const net = gross - discount;

  const next = nextTier(count);
  const top = rows[0];
  const canTopUp = next && top && top.qty + (next.min - count) <= top.p.stock;
  const upsell =
    next && top
      ? (() => {
          const addQty = next.min - count;
          const g = gross + addQty * top.p.price;
          const n = Math.round(g * (1 - next.rate));
          return { addQty, net: n, avg: n / next.min, extra: n - net };
        })()
      : null;

  const update = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  const changePattern = (key: number, slug: string) => {
    const p = productsOf(slug).sort((a, b) => b.stock - a.stock)[0];
    update(key, { id: p.id, qty: Math.min(4, p.stock) });
  };
  const addLine = () => setLines((ls) => [...ls, { key: Date.now(), id: firstPassenger.id, qty: 4 }]);

  const addAll = () => {
    rows.forEach((r) => add(r.id, r.qty));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
      {/* Picks */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {rows.map((r) => {
            const pat = patternBySlug[r.p.pattern];
            return (
              <motion.div
                key={r.key}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40 }}
                className="group flex gap-4 rounded-3xl border border-line bg-card p-4"
              >
                <div className="hidden h-28 w-11 shrink-0 sm:block">
                  <TreadCanvas tread={pat.tread} className="h-full w-full" />
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label>
                      <span className="mb-1 block text-xs text-mute">รุ่น</span>
                      <select className="select-field" value={r.p.pattern} onChange={(e) => changePattern(r.key, e.target.value)}>
                        {patterns.map((p) => (
                          <option key={p.slug} value={p.slug}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="mb-1 block text-xs text-mute">ขนาด</span>
                      <select
                        className="select-field"
                        value={r.id}
                        onChange={(e) => update(r.key, { id: e.target.value, qty: Math.min(r.qty, productById[e.target.value].stock) })}
                      >
                        {productsOf(r.p.pattern).map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.size} {p.loadSpeed} · {baht(p.price)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <QtyStepper value={r.qty} max={r.p.stock} onChange={(n) => update(r.key, { qty: Math.max(1, Math.min(n, r.p.stock)) })} />
                      <span className="text-xs text-mute">สต็อก {r.p.stock}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-lg font-bold tabular-nums">{baht(r.qty * r.p.price)}</span>
                      {rows.length > 1 && (
                        <button onClick={() => setLines((ls) => ls.filter((l) => l.key !== r.key))} className="text-mute hover:text-red-500" aria-label="ลบรายการ">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <button onClick={addLine} className="btn-ghost w-full justify-center text-sm">
          <Plus className="h-4 w-4" /> เพิ่มยางอีกรายการ (รวมจำนวนเพื่อรับส่วนลด)
        </button>

        {/* Tier ladder */}
        <div className="rounded-3xl border border-line bg-card p-5">
          <p className="mb-4 text-sm font-semibold">ขั้นส่วนลดตามจำนวนเส้นรวม</p>
          <div className="grid grid-cols-5 gap-2">
            {ladder.map((t, i) => {
              const upper = ladder[i + 1]?.min ?? Infinity;
              const on = count >= t.min && count < upper;
              return (
                <div key={t.min} className={`rounded-2xl border p-2 text-center transition sm:p-3 ${on ? "border-amber bg-amber text-coal" : "border-line"}`}>
                  <p className="font-display text-lg font-black italic sm:text-2xl">{t.rate ? `${t.rate * 100}%` : "0%"}</p>
                  <p className={`text-[11px] ${on ? "text-coal/70" : "text-mute"}`}>{t.min ? `${t.min}+ เส้น` : "1–11 เส้น"}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl bg-coal p-6 text-[#f4f4f5] sm:p-7">
          <p className="text-xs font-semibold tracking-[0.2em] text-amber">ผลการคำนวณ</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-[#9a9aa2]">
              <span>รวม {count} เส้น (ราคารวม VAT)</span>
              <span className="tabular-nums">{baht(gross)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9a9aa2]">ส่วนลดตามจำนวน</span>
              <span className="font-semibold text-amber tabular-nums">{rate ? `−${rate * 100}% (−${baht(discount)})` : "ยังไม่ได้ส่วนลด"}</span>
            </div>
          </div>
          <div className="mt-5 border-t border-white/10 pt-5">
            <p className="text-sm text-[#9a9aa2]">จ่ายจริง</p>
            <motion.p key={net} initial={{ scale: 0.96, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="font-display text-5xl font-black italic tabular-nums">
              {baht(net)}
            </motion.p>
            <p className="mt-1 text-sm text-[#9a9aa2]">เฉลี่ย {baht(count ? net / count : 0)} / เส้น</p>
          </div>

          {upsell && (
            <div className="mt-5 rounded-2xl bg-amber/15 p-4">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-amber">
                <TrendingUp className="h-4 w-4" /> ซื้อเพิ่มอีก {upsell.addQty} เส้น ลด {next!.rate * 100}%
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#c9c9cf]">
                รวม {next!.min} เส้น จ่าย {baht(upsell.net)} · เฉลี่ยเหลือ {baht(upsell.avg)} / เส้น (จ่ายเพิ่ม {baht(upsell.extra)})
              </p>
              {canTopUp && (
                <button
                  onClick={() => update(top.key, { qty: top.qty + upsell.addQty })}
                  className="mt-3 rounded-full bg-amber px-4 py-2 text-xs font-semibold text-coal transition hover:scale-105"
                >
                  + เพิ่ม {top.p.size} อีก {upsell.addQty} เส้น
                </button>
              )}
            </div>
          )}
          {!next && <p className="mt-5 rounded-2xl bg-amber/15 p-4 text-sm font-semibold text-amber">ได้ส่วนลดสูงสุด 20% แล้ว</p>}

          <button onClick={addAll} className="btn-amber mt-6 w-full justify-center">
            <ShoppingBag className="h-4 w-4" /> {added ? "ใส่ตะกร้าแล้ว" : "ใส่ทั้งหมดลงตะกร้า"}
          </button>
        </div>

        {/* Dealer view */}
        <div className="rounded-3xl border border-line bg-card p-5">
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Store className="h-4 w-4 text-accent" /> ฉันเป็นร้านค้า — เทียบโปรตัวแทน
            </span>
            <input type="checkbox" checked={dealer} onChange={(e) => setDealer(e.target.checked)} className="h-5 w-5 accent-[#f2a516]" />
          </label>
          <AnimatePresence>
            {dealer && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                {(() => {
                  const plans = dealerPlans(count, gross);
                  if (!plans[0].eligible)
                    return <p className="mt-4 text-sm text-mute">โปรแกรม Kick Starter ต้องสั่ง 12–200 เส้นต่อคำสั่งซื้อ (ตอนนี้ {count} เส้น)</p>;
                  const best = plans.reduce((a, b) => (b.save > a.save ? b : a));
                  return (
                    <div className="mt-4 space-y-2">
                      {plans.map((p) => (
                        <div key={p.id} className={`rounded-2xl border p-3 ${p.id === best.id ? "border-amber bg-amber/[0.07]" : "border-line"}`}>
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="font-semibold">
                              {p.name}
                              {p.id === best.id && <Crown className="ml-1 inline h-3.5 w-3.5 text-accent" />}
                            </span>
                            <span className="font-display font-bold tabular-nums">{baht(p.pay)}</span>
                          </div>
                          <p className="mt-0.5 text-xs text-mute">{p.note}</p>
                          <p className="mt-1 text-xs font-semibold text-accent">ประหยัดรวม {baht(p.save)}</p>
                        </div>
                      ))}
                      <p className="pt-1 text-[11px] text-mute">คำนวณจากราคารวม VAT ในรายการ ใช้ร่วมกับโปรอื่นไม่ได้</p>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
