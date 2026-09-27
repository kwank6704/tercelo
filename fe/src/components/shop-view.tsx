"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, SlidersHorizontal, X } from "lucide-react";
import { allAspects, allRims, allWidths, baht, categories, patternBySlug, patterns, products, type CategoryId } from "@/data/catalog";
import { useCart } from "./cart";
import TreadCanvas from "./tread-canvas";

type Init = { cat?: string; w?: string; a?: string; r?: string; q?: string };
type Sort = "popular" | "price-asc" | "price-desc" | "size";

export default function ShopView({ init }: { init: Init }) {
  const { add, lines } = useCart();
  const [cat, setCat] = useState<CategoryId | "">((categories.some((c) => c.id === init.cat) ? init.cat : "") as CategoryId | "");
  const [pattern, setPattern] = useState("");
  const [w, setW] = useState(init.w ?? "");
  const [a, setA] = useState(init.a ?? "");
  const [r, setR] = useState(init.r ?? "");
  const [q, setQ] = useState(init.q ?? "");
  const [sort, setSort] = useState<Sort>("popular");
  const [panel, setPanel] = useState(false);

  const list = useMemo(() => {
    const needle = q.replace(/\s/g, "").toUpperCase();
    const out = products.filter((p) => {
      const pat = patternBySlug[p.pattern];
      return (
        (!cat || pat.category === cat) &&
        (!pattern || p.pattern === pattern) &&
        (!w || p.width === +w) &&
        (!a || (p.aspect ?? 0) === +a) &&
        (!r || p.rim === +r) &&
        (!needle || p.size.replace(/Z/g, "").includes(needle.replace(/Z/g, "")) || pat.name.replace(/\s/g, "").includes(needle))
      );
    });
    const by: Record<Sort, (x: (typeof out)[0], y: (typeof out)[0]) => number> = {
      popular: (x, y) => y.stock - x.stock,
      "price-asc": (x, y) => x.price - y.price,
      "price-desc": (x, y) => y.price - x.price,
      size: (x, y) => x.rim - y.rim || x.width - y.width,
    };
    return out.sort(by[sort]);
  }, [cat, pattern, w, a, r, q, sort]);

  const inCart = new Set(lines.map((l) => l.id));
  const active = [cat && categories.find((c) => c.id === cat)?.label, pattern && patternBySlug[pattern].name, w && `กว้าง ${w}`, a && `ซีรีส์ ${a}`, r && `R${r}`].filter(Boolean);
  const reset = () => (setCat(""), setPattern(""), setW(""), setA(""), setR(""), setQ(""));

  const filters = (
    <div className="space-y-7">
      <div>
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-mute">ประเภทรถ</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => (setCat(cat === c.id ? "" : c.id), setPattern(""))}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                cat === c.id ? "border-amber bg-amber text-coal" : "border-line text-mute hover:border-amber/50 hover:text-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-mute">รุ่นดอกยาง</p>
        <div className="space-y-1">
          {patterns
            .filter((p) => !cat || p.category === cat)
            .map((p) => (
              <button
                key={p.slug}
                onClick={() => setPattern(pattern === p.slug ? "" : p.slug)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                  pattern === p.slug ? "bg-amber/15 text-accent" : "text-mute hover:bg-white/5 hover:text-white"
                }`}
              >
                {p.name}
                {pattern === p.slug && <Check className="h-4 w-4" />}
              </button>
            ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <label>
          <span className="mb-1.5 block text-xs text-mute">กว้าง</span>
          <select className="select-field !px-3 !pr-7 text-sm" value={w} onChange={(e) => setW(e.target.value)}>
            <option value="">-</option>
            {allWidths.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1.5 block text-xs text-mute">ซีรีส์</span>
          <select className="select-field !px-3 !pr-7 text-sm" value={a} onChange={(e) => setA(e.target.value)}>
            <option value="">-</option>
            {allAspects.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1.5 block text-xs text-mute">ขอบ</span>
          <select className="select-field !px-3 !pr-7 text-sm" value={r} onChange={(e) => setR(e.target.value)}>
            <option value="">-</option>
            {allRims.map((x) => (
              <option key={x} value={x}>
                R{x}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-28 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-accent">SHOP</p>
          <h1 className="mt-2 font-display text-5xl font-black italic tracking-tight sm:text-6xl">ยางทั้งหมด</h1>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหา เช่น 205/55R16 หรือ SPORT D1"
            className="select-field !bg-none flex-1 sm:w-80"
          />
          <button onClick={() => setPanel(true)} className="grid h-[50px] w-[50px] shrink-0 place-items-center rounded-2xl border border-line lg:hidden" aria-label="ตัวกรอง">
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">{filters}</div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-mute">
                พบ <b className="text-white">{list.length}</b> รายการ
              </span>
              {active.map((t) => (
                <span key={t as string} className="rounded-full bg-white/5 px-3 py-1 text-xs">
                  {t}
                </span>
              ))}
              {(active.length > 0 || q) && (
                <button onClick={reset} className="text-xs text-accent hover:underline">
                  ล้างตัวกรอง
                </button>
              )}
            </div>
            <select className="select-field !w-auto text-sm" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="popular">สต็อกมากสุด</option>
              <option value="price-asc">ราคา: ต่ำ → สูง</option>
              <option value="price-desc">ราคา: สูง → ต่ำ</option>
              <option value="size">ขนาดขอบล้อ</option>
            </select>
          </div>

          {list.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line p-16 text-center text-mute">
              ไม่พบขนาดที่ตรงกัน ลองปรับตัวกรอง หรือ{" "}
              <button onClick={reset} className="text-accent underline">
                ดูทั้งหมด
              </button>
            </div>
          ) : (
            <motion.div layout className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence initial={false}>
                {list.map((p) => {
                  const pat = patternBySlug[p.pattern];
                  const added = inCart.has(p.id);
                  return (
                    <motion.div
                      layout
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                      className="group relative flex gap-4 overflow-hidden rounded-3xl border border-line bg-card p-4 transition-colors hover:border-amber/40"
                    >
                      <Link href={`/tyres/${pat.slug}`} className="h-36 w-14 shrink-0">
                        <TreadCanvas tread={pat.tread} className="h-full w-full" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Link href={`/tyres/${pat.slug}`} className="text-xs font-semibold tracking-wider text-accent hover:underline">
                          {pat.name}
                        </Link>
                        <p className="mt-0.5 font-display text-2xl font-bold tracking-tight">{p.size}</p>
                        <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-mute">
                          <span className="rounded border border-line px-1.5">{p.loadSpeed}</span>
                          {p.zr && <span className="rounded border border-line px-1.5">ZR</span>}
                          {p.commercial && <span className="rounded border border-line px-1.5">Commercial</span>}
                          {p.lt && <span className="rounded border border-line px-1.5">LT</span>}
                        </div>
                        <p className={`mt-2 text-xs ${p.stock < 20 ? "text-orange-600 dark:text-orange-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                          ● {p.stock < 20 ? `เหลือ ${p.stock} เส้น` : `พร้อมส่ง ${p.stock} เส้น`}
                        </p>
                        <div className="mt-auto flex items-end justify-between pt-3">
                          <div>
                            <p className="font-display text-xl font-bold">{baht(p.price)}</p>
                            <p className="text-[11px] text-mute">ต่อเส้น รวม VAT</p>
                          </div>
                          <button
                            onClick={() => add(p.id, Math.min(4, p.stock))}
                            className={`flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition ${
                              added ? "bg-white/10 text-white" : "bg-amber text-coal hover:scale-105"
                            }`}
                          >
                            {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            {added ? "ในตะกร้า" : "4 เส้น"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {panel && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPanel(false)} />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85svh] overflow-y-auto rounded-t-3xl border-t border-line bg-surface p-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="font-display text-2xl font-bold italic">ตัวกรอง</p>
                <button onClick={() => setPanel(false)} className="grid h-9 w-9 place-items-center rounded-full bg-white/5" aria-label="ปิด">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {filters}
              <button onClick={() => setPanel(false)} className="btn-amber mt-8 w-full justify-center">
                ดู {list.length} รายการ
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
