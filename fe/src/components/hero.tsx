"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MousePointer2 } from "lucide-react";
import { patternBySlug } from "@/data/catalog";
import Tire3D from "./tire-3d-lazy";


const showcase = ["sport-d1", "tamir-ev01", "solitude", "wzr505"].map((s) => patternBySlug[s]);

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const pat = showcase[idx];

  return (
    <section className="grain relative isolate overflow-hidden pt-16">
      {/* backdrop */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_45%,rgba(242,165,22,0.22),transparent_70%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent_60%,var(--color-ink))]" />
      <div className="pointer-events-none absolute -right-10 top-24 -z-10 select-none font-display text-[26vw] font-black italic leading-none text-outline opacity-40 lg:text-[18vw]">
        <AnimatePresence mode="wait">
          <motion.span key={pat.category} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.5 }} className="block">
            {pat.category.toUpperCase()}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative z-10 pt-8 lg:pt-0">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-3 py-1 text-xs font-semibold tracking-[0.25em] text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber" /> ROLLING FORWARD
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            className="font-display text-5xl font-black italic leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl"
          >
            ทุกเส้นทาง
            <br />
            <span className="bg-gradient-to-r from-accent via-[var(--grad-mid)] to-accent bg-clip-text text-transparent">ไปได้ไกลกว่า</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-6 max-w-md text-lg leading-relaxed text-mute">
            ยาง TERCELO มาตรฐานโลก สำหรับ EV รถเก๋ง SUV ออฟโรด และรถตู้ ราคารวม VAT ยิ่งซื้อมากยิ่งลด สูงสุด <b className="text-white">20%</b>
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-9 flex flex-wrap gap-3">
            <a href="#finder" className="btn-amber">
              ค้นหายางตามขนาด <ArrowRight className="h-4 w-4" />
            </a>
            <Link href={`/tyres/${pat.slug}`} className="btn-ghost">
              ดูรุ่น {pat.name}
            </Link>
          </motion.div>

          <div className="mt-12">
            <p className="mb-3 text-xs tracking-[0.2em] text-mute">เปลี่ยนดอกยาง</p>
            <div className="flex flex-wrap gap-2">
              {showcase.map((p, i) => (
                <button
                  key={p.slug}
                  onClick={() => setIdx(i)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    i === idx ? "border-amber bg-amber text-coal" : "border-line bg-white/5 text-mute hover:border-amber/50 hover:text-white"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative -mx-4 h-[420px] sm:h-[520px] lg:mx-0 lg:h-[680px]">
          <Tire3D tread={pat.tread} label={pat.name} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
          <AnimatePresence mode="wait">
            <motion.div
              key={pat.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="pointer-events-none absolute bottom-4 right-4 max-w-[240px] rounded-2xl border border-line bg-ink/70 p-4 backdrop-blur-md sm:bottom-10"
            >
              <p className="text-[10px] font-semibold tracking-[0.25em] text-accent">{pat.category.toUpperCase()} · TERCELO</p>
              <p className="font-display text-xl font-bold italic">{pat.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-mute">{pat.tagline}</p>
            </motion.div>
          </AnimatePresence>
          <p className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5 text-xs text-mute sm:left-8">
            <MousePointer2 className="h-3.5 w-3.5" /> ลากเพื่อหมุนล้อ
          </p>
        </div>
      </div>

      {/* road */}
      <div className="absolute bottom-20 left-0 right-0 h-[3px] overflow-hidden opacity-60">
        <div className="road-lines h-full w-full" />
      </div>
    </section>
  );
}
