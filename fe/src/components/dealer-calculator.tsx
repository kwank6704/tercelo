"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { baht } from "@/data/catalog";
import { dealerPlans } from "@/lib/promo";

export default function DealerCalculator() {
  const [qty, setQty] = useState(60);
  const [avg, setAvg] = useState(1667);
  const gross = qty * avg;
  const plans = dealerPlans(qty, gross);
  const best = plans.reduce((a, b) => (b.save > a.save ? b : a));
  const maxSave = Math.max(...plans.map((p) => p.save), 1);

  return (
    <div className="rounded-[2rem] border border-line bg-card p-6 sm:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-8">
          <div>
            <div className="mb-3 flex items-end justify-between">
              <label htmlFor="qty" className="text-sm text-mute">
                จำนวนต่อคำสั่งซื้อ
              </label>
              <span className="font-display text-4xl font-black italic text-accent tabular-nums">
                {qty} <span className="text-lg text-white/60">เส้น</span>
              </span>
            </div>
            <input id="qty" type="range" min={12} max={200} value={qty} onChange={(e) => setQty(+e.target.value)} className="w-full accent-[#f2a516]" />
            <div className="mt-1 flex justify-between text-xs text-mute">
              <span>12</span>
              <span>200</span>
            </div>
          </div>
          <div>
            <label htmlFor="avg" className="mb-3 block text-sm text-mute">
              ราคาเฉลี่ยต่อเส้น (ก่อนส่วนลด)
            </label>
            <div className="flex items-center gap-3">
              <input
                id="avg"
                type="number"
                min={500}
                step={50}
                value={avg}
                onChange={(e) => setAvg(Math.max(0, +e.target.value))}
                className="select-field !bg-none font-display text-2xl"
              />
              <span className="text-mute">บาท</span>
            </div>
          </div>
          <div className="rounded-2xl bg-white/[0.03] p-5">
            <p className="text-sm text-mute">มูลค่าสั่งซื้อก่อนส่วนลด</p>
            <p className="font-display text-3xl font-bold tabular-nums">{baht(gross)}</p>
          </div>
        </div>

        <div className="space-y-3">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`relative overflow-hidden rounded-2xl border p-5 transition ${p.id === best.id ? "border-amber bg-amber/[0.07]" : "border-line"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl font-display text-xl font-black italic ${p.id === best.id ? "bg-amber text-coal" : "bg-white/5"}`}>
                    {p.id}
                  </span>
                  <div>
                    <p className="font-semibold">
                      {p.name}{" "}
                      {p.id === best.id && (
                        <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-amber px-2 py-0.5 text-[10px] font-bold text-coal">
                          <Crown className="h-3 w-3" /> คุ้มสุด
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-mute">{p.note}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-mute">จ่ายรอบนี้</p>
                  <p className="font-display text-xl font-bold tabular-nums">{baht(p.pay)}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-deep to-amber" animate={{ width: `${(p.save / maxSave) * 100}%` }} />
                </div>
                <span className="w-28 text-right text-sm font-semibold text-accent tabular-nums">ประหยัด {baht(p.save)}</span>
              </div>
            </div>
          ))}
          <p className="pt-2 text-xs leading-relaxed text-mute">
            ตัวเลขเป็นการประมาณเพื่อเปรียบเทียบ มูลค่าประหยัดของโปรแกรม C รวม Credit Voucher ที่ใช้แทนส่วนลด 20% ของคำสั่งซื้อใหม่ได้ครั้งเดียว
            ไม่สามารถใช้ร่วมกับรายการส่งเสริมการขายอื่น
          </p>
        </div>
      </div>
    </div>
  );
}
