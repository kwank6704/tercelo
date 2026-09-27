"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FONT_KEY, FONT_SIZES, type FontSize } from "@/lib/theme";

const labels: Record<FontSize, string> = { md: "ปกติ", lg: "ใหญ่", xl: "ใหญ่มาก" };
const glyph: Record<FontSize, string> = { md: "text-sm", lg: "text-base", xl: "text-xl" };

/** Lets visitors enlarge all text; the choice is saved and applied before paint by themeInitScript. */
export default function FontSizeControl() {
  const [size, setSize] = useState<FontSize>("md");
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cur = document.documentElement.dataset.font as FontSize | undefined;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the size the init script applied
    if (cur && FONT_SIZES.includes(cur)) setSize(cur);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const choose = (s: FontSize) => {
    document.documentElement.setAttribute("data-font", s);
    try {
      localStorage.setItem(FONT_KEY, s);
    } catch {}
    setSize(s);
  };

  return (
    <div ref={box} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`grid h-10 w-10 place-items-center rounded-full border bg-white/5 font-display font-bold transition hover:border-amber/60 hover:bg-amber/10 ${
          open ? "border-amber" : "border-line"
        }`}
        aria-label="ปรับขนาดตัวอักษร"
        aria-expanded={open}
        title="ขนาดตัวอักษร"
      >
        <span className="leading-none">
          <span className="text-xs">ก</span>
          <span className="text-base">ก</span>
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 w-56 origin-top-right rounded-2xl border border-line bg-card p-3 shadow-2xl shadow-black/20"
            role="menu"
          >
            <p className="mb-2 px-1 text-xs text-mute">ขนาดตัวอักษร</p>
            <div className="grid grid-cols-3 gap-1.5">
              {FONT_SIZES.map((s) => (
                <button
                  key={s}
                  role="menuitemradio"
                  aria-checked={size === s}
                  onClick={() => choose(s)}
                  className={`flex flex-col items-center gap-1 rounded-xl border py-2.5 transition ${
                    size === s ? "border-amber bg-amber text-coal" : "border-line hover:border-amber/50"
                  }`}
                >
                  <span className={`font-display font-bold leading-none ${glyph[s]}`}>ก</span>
                  <span className={`text-[11px] ${size === s ? "text-coal/80" : "text-mute"}`}>{labels[s]}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
