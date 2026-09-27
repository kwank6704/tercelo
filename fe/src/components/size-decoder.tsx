"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const parts = [
  { key: "w", text: "205", label: "หน้ากว้าง", desc: "ความกว้างของหน้ายาง หน่วยมิลลิเมตร" },
  { key: "a", text: "/55", label: "ซีรีส์", desc: "ความสูงแก้มยางเป็น % ของหน้ากว้าง (55% × 205 ≈ 113 มม.)" },
  { key: "c", text: " R", label: "โครงสร้าง", desc: "R = Radial โครงยางเรเดียล (ZR = รองรับความเร็วสูงเกิน 240 กม./ชม.)" },
  { key: "r", text: "16", label: "ขอบล้อ", desc: "เส้นผ่านศูนย์กลางกระทะล้อ หน่วยนิ้ว" },
  { key: "l", text: " 94", label: "ดัชนีรับน้ำหนัก", desc: "94 = รับน้ำหนักได้ 670 กก. ต่อเส้น" },
  { key: "s", text: "W", label: "ดัชนีความเร็ว", desc: "W = ความเร็วสูงสุด 270 กม./ชม. (H 210 · V 240 · Y 300)" },
];

/** Interactive sidewall: hover each part of the size code to learn what it means. */
export default function SizeDecoder() {
  const [active, setActive] = useState("w");
  const cur = parts.find((p) => p.key === active)!;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-card p-6 sm:p-10">
      <svg viewBox="0 0 800 260" className="pointer-events-none absolute -bottom-40 left-1/2 w-[140%] max-w-none -translate-x-1/2 opacity-70" aria-hidden>
        <defs>
          <radialGradient id="sw" cx="50%" cy="100%" r="80%">
            <stop offset="0" stopColor="var(--sw-1)" />
            <stop offset="1" stopColor="var(--sw-2)" />
          </radialGradient>
        </defs>
        <circle cx="400" cy="420" r="400" fill="url(#sw)" />
        {Array.from({ length: 14 }).map((_, i) => (
          <circle key={i} cx="400" cy="420" r={300 + i * 7} fill="none" stroke="currentColor" strokeOpacity={0.05} />
        ))}
        <circle cx="400" cy="420" r="280" fill="var(--color-card)" />
      </svg>

      <p className="relative text-xs font-semibold tracking-[0.25em] text-accent">อ่านขนาดยางเป็นใน 10 วินาที</p>
      <div className="relative mt-6 flex flex-wrap items-baseline font-display text-5xl font-black italic tracking-tight sm:text-7xl" role="tablist">
        {parts.map((p) => (
          <button
            key={p.key}
            role="tab"
            aria-selected={active === p.key}
            onMouseEnter={() => setActive(p.key)}
            onFocus={() => setActive(p.key)}
            onClick={() => setActive(p.key)}
            className={`relative whitespace-pre transition-colors ${active === p.key ? "text-accent" : "text-white/40 hover:text-white/70"}`}
          >
            {p.text}
            {active === p.key && <motion.span layoutId="dec-underline" className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-amber" />}
          </button>
        ))}
      </div>
      <motion.div key={cur.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative mt-8 min-h-[72px]">
        <p className="font-display text-2xl font-semibold">{cur.label}</p>
        <p className="mt-1 text-mute">{cur.desc}</p>
      </motion.div>
    </div>
  );
}
