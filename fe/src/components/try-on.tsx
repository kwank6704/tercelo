"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Camera, Car as CarIcon, CheckCircle2, CircleDot, Gauge, Pause, Play, ShoppingBag, Sparkles } from "lucide-react";
import { baht, patternBySlug, products, type Product } from "@/data/catalog";
import { cars, diameter, fitCheck, fmtSize, paints, type TyreSize } from "@/lib/fitment";
import { useCart } from "./cart";
import CarStage from "./car-stage";
import PhotoFit from "./photo-fit";

const WIDTHS = Array.from({ length: 18 }, (_, i) => 145 + i * 10);
const ASPECTS = Array.from({ length: 11 }, (_, i) => 30 + i * 5);
const RIMS = Array.from({ length: 10 }, (_, i) => 13 + i);

const asSize = (p: Product): TyreSize => ({ width: p.width, aspect: p.aspect ?? 80, rim: p.rim });

const levelUi = {
  great: { text: "เข้ากับรถพอดี", cls: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500", icon: CheckCircle2 },
  ok: { text: "ใส่ได้ ควรเช็คซุ้มล้อ", cls: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500", icon: AlertTriangle },
  bad: { text: "ขนาดต่างมากเกินไป", cls: "text-red-600 dark:text-red-400", bg: "bg-red-500", icon: AlertTriangle },
};

export default function TryOn() {
  const { add } = useCart();
  const [carId, setCarId] = useState("sedan");
  const car = cars.find((c) => c.id === carId)!;
  const [paint, setPaint] = useState(paints[0].hex);
  const [stock, setStock] = useState<TyreSize>(car.stock);
  const [driving, setDriving] = useState(true);
  const [showStock, setShowStock] = useState(false);
  const [onlySuited, setOnlySuited] = useState(true);
  const [mode, setMode] = useState<"sample" | "photo">("sample");

  // Every TERCELO SKU ranked by how close its diameter is to the car's current tyre.
  const ranked = useMemo(() => {
    return products
      .map((p) => ({ p, fit: fitCheck(stock, asSize(p)), suited: car.suits.includes(patternBySlug[p.pattern].category) }))
      .filter((x) => Math.abs(x.fit.diffPct) <= 6 && (!onlySuited || x.suited))
      .sort((a, b) => Number(b.fit.sameRim) - Number(a.fit.sameRim) || Number(b.suited) - Number(a.suited) || Math.abs(a.fit.diffPct) - Math.abs(b.fit.diffPct))
      .slice(0, 12);
  }, [stock, car, onlySuited]);

  const [pickedId, setPickedId] = useState<string | null>(null);
  const picked = products.find((p) => p.id === pickedId) ?? ranked[0]?.p ?? null;
  const pat = picked ? patternBySlug[picked.pattern] : null;
  const fit = picked ? fitCheck(stock, asSize(picked)) : null;
  const suited = pat ? car.suits.includes(pat.category) : false;

  const chooseCar = (id: string) => {
    const c = cars.find((x) => x.id === id)!;
    setCarId(id);
    setStock(c.stock);
    setPickedId(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-28 sm:px-6">
      <p className="text-xs font-semibold tracking-[0.25em] text-accent">VIRTUAL FITMENT</p>
      <h1 className="mt-2 font-display text-4xl font-black italic tracking-tight sm:text-6xl">ลองใส่กับรถคุณ</h1>
      <p className="mt-3 max-w-2xl text-mute">
        เลือกประเภทรถและขนาดยางเดิม แล้วดูว่ายาง TERCELO แต่ละขนาดใส่แล้วเป็นอย่างไร เข้ากับซุ้มล้อไหม และความเร็วบนหน้าปัดคลาดเคลื่อนเท่าไร
      </p>

      {/* Car type */}
      <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {cars.map((c) => (
          <button
            key={c.id}
            onClick={() => chooseCar(c.id)}
            className={`shrink-0 rounded-2xl border px-4 py-2.5 text-left transition ${
              c.id === carId ? "border-amber bg-amber text-coal" : "border-line bg-card hover:border-amber/50"
            }`}
          >
            <span className="block text-sm font-semibold">{c.label}</span>
            <span className={`block text-[11px] ${c.id === carId ? "text-coal/70" : "text-mute"}`}>{c.hint}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Stage */}
        <div className="min-w-0 space-y-4">
          <div className="flex w-full rounded-full border border-line bg-card p-1 text-sm sm:inline-flex sm:w-auto" role="tablist">
            {(
              [
                ["sample", "รถตัวอย่าง", CarIcon],
                ["photo", "ใช้รูปรถของคุณ", Camera],
              ] as const
            ).map(([id, text, Icon]) => (
              <button
                key={id}
                role="tab"
                aria-selected={mode === id}
                onClick={() => setMode(id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 transition sm:flex-none sm:px-4 ${mode === id ? "bg-amber font-semibold text-coal" : "text-mute hover:text-white"}`}
              >
                <Icon className="h-4 w-4" /> {text}
              </button>
            ))}
          </div>

          {mode === "photo" ? (
            <PhotoFit stock={stock} tyre={picked ? asSize(picked) : stock} tread={pat?.tread ?? "hp"} label={pat?.name ?? ""} />
          ) : (
            <>
              <div className="relative overflow-hidden rounded-3xl border border-line bg-[linear-gradient(to_bottom,var(--stage),var(--color-card))]">
                <div className="pointer-events-none absolute left-5 top-4 z-10">
                  <p className="text-[10px] font-semibold tracking-[0.25em] text-mute">{car.label.toUpperCase()}</p>
                  <p className="font-display text-2xl font-black italic">{picked ? picked.size : fmtSize(stock)}</p>
                  {pat && <p className="text-sm font-semibold text-accent">{pat.name}</p>}
                </div>
                <div className="absolute right-4 top-4 z-10 flex gap-2">
                  <button
                    onClick={() => setShowStock((s) => !s)}
                    className={`flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs transition ${showStock ? "border-sky-400 bg-sky-400/15 text-sky-600 dark:text-sky-300" : "border-line bg-card/80"}`}
                  >
                    <CircleDot className="h-3.5 w-3.5" /> ขนาดเดิม
                  </button>
                  <button
                    onClick={() => setDriving((d) => !d)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card/80"
                    aria-label={driving ? "หยุด" : "ขับ"}
                  >
                    {driving ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                </div>
                <div className="aspect-[16/8] w-full px-2 pt-12 sm:aspect-[16/7]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={car.id}
                      className="h-full w-full"
                      initial={{ x: -80, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 80, opacity: 0 }}
                      transition={{ duration: 0.45 }}
                    >
                      <CarStage
                        car={car}
                        paint={paint}
                        tyre={picked ? asSize(picked) : stock}
                        tread={pat?.tread ?? "hp"}
                        label={pat?.name ?? ""}
                        driving={driving}
                        showStock={showStock}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="h-[3px] overflow-hidden bg-black/20">
                  <div className={`road-lines h-full w-full ${driving ? "" : "[animation-play-state:paused]"}`} />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-mute">สีรถ</span>
                {paints.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPaint(p.hex)}
                    title={p.label}
                    aria-label={p.label}
                    className={`h-8 w-8 rounded-full border-2 transition ${paint === p.hex ? "scale-110 border-amber" : "border-line"}`}
                    style={{ background: `linear-gradient(135deg, ${p.hex}, ${p.hex}99)` }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Current size */}
          <div className="rounded-3xl border border-line bg-card p-5">
            <p className="mb-3 text-sm font-semibold">
              ขนาดยางเดิมของรถคุณ <span className="font-normal text-mute">(ดูได้ที่แก้มยาง)</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["width", "หน้ากว้าง", WIDTHS, (v: number) => v],
                  ["aspect", "ซีรีส์", ASPECTS, (v: number) => v],
                  ["rim", "ขอบ", RIMS, (v: number) => `R${v}`],
                ] as const
              ).map(([key, label, opts, fmt]) => (
                <label key={key}>
                  <span className="mb-1 block text-xs text-mute">{label}</span>
                  <select
                    className="select-field"
                    value={stock[key]}
                    onChange={(e) => (setStock((s) => ({ ...s, [key]: +e.target.value })), setPickedId(null))}
                  >
                    {opts.map((o) => (
                      <option key={o} value={o}>
                        {fmt(o)}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-mute">เส้นผ่านศูนย์กลางรวม {Math.round(diameter(stock))} มม.</p>
          </div>
        </div>

        {/* Fit report + picks */}
        <div className="min-w-0 space-y-4">
          {picked && fit && pat ? (
            <motion.div
              key={picked.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-line bg-card p-5 sm:p-6"
            >
              {(() => {
                const ui = levelUi[fit.level];
                const Icon = ui.icon;
                return (
                  <div className={`flex items-center gap-2 font-display text-xl font-bold ${ui.cls}`}>
                    <Icon className="h-6 w-6" /> {ui.text}
                  </div>
                );
              })()}
              {/* diameter gauge: −6% … +6% */}
              <div className="mt-5">
                <div className="relative h-3 rounded-full bg-[linear-gradient(90deg,#ef4444_0%,#f97316_20%,#10b981_33%,#10b981_67%,#f97316_80%,#ef4444_100%)] opacity-80">
                  <motion.div
                    className="absolute top-1/2 h-6 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow ring-2 ring-coal/70"
                    animate={{ left: `${50 + (Math.max(-6, Math.min(6, fit.diffPct)) / 6) * 50}%` }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[10px] text-mute">
                  <span>เล็กลง 6%</span>
                  <span>พอดี</span>
                  <span>ใหญ่ขึ้น 6%</span>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/[0.04] p-3">
                  <dt className="text-xs text-mute">เส้นผ่านศูนย์กลาง</dt>
                  <dd className="font-display text-lg font-bold">
                    {fit.diffPct >= 0 ? "+" : ""}
                    {fit.diffPct.toFixed(1)}%
                  </dd>
                </div>
                <div className="rounded-2xl bg-white/[0.04] p-3">
                  <dt className="flex items-center gap-1 text-xs text-mute">
                    <Gauge className="h-3 w-3" /> หน้าปัด 100 กม./ชม.
                  </dt>
                  <dd className="font-display text-lg font-bold">วิ่งจริง {fit.realAt100.toFixed(1)}</dd>
                </div>
                <div className="rounded-2xl bg-white/[0.04] p-3">
                  <dt className="text-xs text-mute">หน้ายาง</dt>
                  <dd className="font-display text-lg font-bold">
                    {fit.widthDelta === 0 ? "เท่าเดิม" : `${fit.widthDelta > 0 ? "+" : ""}${fit.widthDelta} มม.`}
                  </dd>
                </div>
                <div className="rounded-2xl bg-white/[0.04] p-3">
                  <dt className="text-xs text-mute">แก้มยาง</dt>
                  <dd className="font-display text-lg font-bold">
                    {Math.abs(fit.sidewallDelta) < 1 ? "เท่าเดิม" : `${fit.sidewallDelta > 0 ? "+" : ""}${fit.sidewallDelta.toFixed(0)} มม.`}
                  </dd>
                </div>
              </dl>
              <ul className="mt-4 space-y-1.5 text-sm">
                <li className={fit.sameRim ? "text-emerald-600 dark:text-emerald-400" : "text-orange-600 dark:text-orange-400"}>
                  {fit.sameRim ? "✓ ใช้ล้อแม็กเดิมได้เลย" : `! ต้องใช้ล้อขอบ ${picked.rim} นิ้ว (เดิม ${stock.rim} นิ้ว)`}
                </li>
                <li className={suited ? "text-emerald-600 dark:text-emerald-400" : "text-orange-600 dark:text-orange-400"}>
                  {suited ? `✓ ${pat.name} เหมาะกับ${car.label}` : `! ${pat.name} ออกแบบมาสำหรับรถประเภทอื่น`}
                </li>
              </ul>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-5">
                <div>
                  <Link href={`/tyres/${pat.slug}`} className="text-xs font-semibold text-accent hover:underline">
                    {pat.name} · {picked.loadSpeed}
                  </Link>
                  <p className="font-display text-2xl font-bold">
                    {baht(picked.price * 4)} <span className="text-sm font-normal text-mute">/ 4 เส้น</span>
                  </p>
                </div>
                <button onClick={() => add(picked.id, Math.min(4, picked.stock))} className="btn-amber shrink-0">
                  <ShoppingBag className="h-4 w-4" /> ใส่ตะกร้า
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-3xl border border-dashed border-line p-8 text-center text-mute">
              ยังไม่มีขนาด TERCELO ที่ใกล้เคียงกับขนาดนี้ ลองเปลี่ยนขนาดยางเดิมหรือปิดตัวกรองด้านล่าง
            </div>
          )}

          <div className="rounded-3xl border border-line bg-card p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-accent" /> ขนาดที่แนะนำ
              </p>
              <label className="flex items-center gap-2 text-xs text-mute">
                <input
                  type="checkbox"
                  checked={onlySuited}
                  onChange={(e) => (setOnlySuited(e.target.checked), setPickedId(null))}
                  className="accent-[#f2a516]"
                />
                เฉพาะรุ่นที่เหมาะกับรถ
              </label>
            </div>
            <div className="max-h-[420px] space-y-1.5 overflow-y-auto pr-1">
              {ranked.map(({ p, fit: f }) => {
                const active = picked?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPickedId(p.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition ${
                      active ? "border-amber bg-amber/10" : "border-transparent hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${levelUi[f.level].bg}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {p.size} <span className="font-normal text-mute">{patternBySlug[p.pattern].name}</span>
                      </span>
                      <span className="block text-xs text-mute">
                        {f.diffPct >= 0 ? "+" : ""}
                        {f.diffPct.toFixed(1)}% · {f.sameRim ? "ล้อเดิม" : `ขอบ ${p.rim}`}
                      </span>
                    </span>
                    <span className="font-display text-sm font-bold">{baht(p.price)}</span>
                  </button>
                );
              })}
              {ranked.length === 0 && <p className="py-6 text-center text-sm text-mute">ไม่พบขนาดที่ใกล้เคียง</p>}
            </div>
          </div>
          <p className="text-xs leading-relaxed text-mute">
            ผลการจำลองเป็นค่าประมาณจากขนาดยาง ควรตรวจสอบระยะซุ้มล้อ ค่า offset ของล้อ และดัชนีรับน้ำหนักตามคู่มือรถก่อนติดตั้งจริง
          </p>
        </div>
      </div>
    </div>
  );
}
