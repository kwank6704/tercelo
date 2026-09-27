"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, MousePointer2 } from "lucide-react";
import { patternBySlug } from "@/data/catalog";
import Tire3D from "./tire-3d-lazy";

const showcase = ["sport-d1", "tamir-ev01", "solitude", "wzr505"].map((s) => patternBySlug[s]);
const audiences = ["รถยนต์ไฟฟ้า", "รถเก๋ง", "SUV", "สายออฟโรด", "รถตู้"];

// Fixed (not random) so server and client render the same streaks.
const streaks = [
  { top: 18, w: 22, dur: 2.6, delay: 0 },
  { top: 31, w: 14, dur: 1.9, delay: 1.1 },
  { top: 44, w: 30, dur: 3.2, delay: 0.4 },
  { top: 57, w: 12, dur: 1.6, delay: 2.0 },
  { top: 66, w: 26, dur: 2.8, delay: 1.5 },
  { top: 78, w: 18, dur: 2.2, delay: 0.7 },
  { top: 86, w: 10, dur: 1.4, delay: 2.6 },
];

const ease = [0.2, 0.8, 0.2, 1] as const;

/** One headline line that slides up from behind a mask. Padding keeps Thai tone marks from being clipped. */
function RevealLine({ children, delay, className = "" }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className="-my-[0.14em] block overflow-hidden py-[0.14em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "115%", skewY: 6 }}
        animate={{ y: "0%", skewY: 0 }}
        transition={{ delay, duration: 0.9, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Rotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % audiences.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    // Own line on phones so words of different lengths never make the paragraph jump.
    <span className="relative grid overflow-hidden sm:inline-grid sm:align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.b
          key={audiences[i]}
          className="col-start-1 row-start-1 whitespace-nowrap font-semibold text-accent"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          {audiences[i]}
        </motion.b>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const pat = showcase[idx];
  const ref = useRef<HTMLElement>(null);

  // Background letters drift with the pointer; content lifts and fades as you scroll away.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(useTransform(mx, (v) => v * -40), { stiffness: 60, damping: 20 });
  const py = useSpring(useTransform(my, (v) => v * -25), { stiffness: 60, damping: 20 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const onPointerMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <MotionConfig reducedMotion="user">
      <section ref={ref} onPointerMove={onPointerMove} className="grain relative isolate overflow-hidden pt-16">
        {/* backdrop */}
        <div className="hero-glow absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_45%,rgba(242,165,22,0.22),transparent_70%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent_60%,var(--color-ink))]" />
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          {streaks.map((s, i) => (
            <span
              key={i}
              className="streak absolute left-0 h-px"
              style={{ top: `${s.top}%`, width: `${s.w}vw`, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
            />
          ))}
        </div>
        <motion.div
          style={{ x: px, y: py }}
          className="pointer-events-none absolute -right-10 top-24 -z-10 select-none font-display text-[26vw] font-black italic leading-none text-outline opacity-40 lg:text-[18vw]"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={pat.category}
              initial={{ opacity: 0, x: 80, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -80, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease }}
              className="block"
            >
              {pat.category.toUpperCase()}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
          <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 pt-8 lg:pt-0">
            <motion.p
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-3 py-1 text-xs font-semibold tracking-[0.25em] text-accent"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber" />
              </span>
              ROLLING FORWARD
            </motion.p>
            <h1 className="font-display text-5xl font-black italic leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl">
              <RevealLine delay={0.15}>ทุกเส้นทาง</RevealLine>
              <RevealLine delay={0.3} className="text-shimmer">
                ไปได้ไกลกว่า
              </RevealLine>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6, ease }}
              className="mt-6 max-w-md text-lg leading-relaxed text-mute"
            >
              ยาง TERCELO มาตรฐานโลก สำหรับ <Rotator />
              <br className="hidden sm:inline" />
              ราคารวม VAT ยิ่งซื้อมากยิ่งลด สูงสุด <b className="text-white">20%</b>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <a href="#finder" className="btn-amber btn-shine group">
                ค้นหายางตามขนาด <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link href={`/tyres/${pat.slug}`} className="btn-ghost">
                ดูรุ่น {pat.name}
              </Link>
            </motion.div>

            <div className="mt-12">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }} className="mb-3 text-xs tracking-[0.2em] text-mute">
                เปลี่ยนดอกยาง
              </motion.p>
              <div className="flex flex-wrap gap-2">
                {showcase.map((p, i) => (
                  <motion.button
                    key={p.slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + i * 0.07, duration: 0.4, ease }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIdx(i)}
                    className={`relative rounded-full border px-4 py-2 text-sm transition-colors ${
                      i === idx ? "border-amber text-coal" : "border-line bg-white/5 text-mute hover:border-amber/50 hover:text-white"
                    }`}
                  >
                    {i === idx && <motion.span layoutId="hero-pick" className="absolute inset-0 -z-10 rounded-full bg-amber" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                    {p.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 1.1, ease }}
            className="relative -mx-4 h-[420px] sm:h-[520px] lg:mx-0 lg:h-[680px]"
          >
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
          </motion.div>
        </div>

        {/* road */}
        <div className="absolute bottom-20 left-0 right-0 h-[3px] overflow-hidden opacity-60">
          <div className="road-lines h-full w-full" />
        </div>
      </section>
    </MotionConfig>
  );
}
