import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, Check, Tag } from "lucide-react";
import Countdown from "@/components/countdown";
import PromoCalculator from "@/components/promo-calculator";
import Reveal from "@/components/reveal";
import TreadCanvas from "@/components/tread-canvas";
import { baht, patternBySlug, products, volumeDiscount } from "@/data/catalog";
import { promotions } from "@/data/promotions";

export const metadata: Metadata = { title: "โปรโมชั่น", description: "โปรโมชั่นยาง TERCELO ส่วนลดตามจำนวนสูงสุด 20% และโปรแกรมตัวแทน Kick Starter" };

const thDate = (iso: string) => new Date(`${iso}T00:00:00+07:00`).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });

export default function PromotionsPage() {
  const retail = promotions.filter((p) => p.kind === "retail");
  const dealer = promotions.filter((p) => p.kind === "dealer");
  const lastEnd = promotions.map((p) => p.end).sort().at(-1)!;
  // Worked example: the passenger-car size with the most stock.
  const hero = products.filter((p) => !p.commercial && !p.lt).sort((a, b) => b.stock - a.stock)[0];
  const heroPat = patternBySlug[hero.pattern];

  return (
    <>
      <section className="grain relative isolate overflow-hidden pb-12 pt-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_20%_10%,rgba(242,165,22,0.28),transparent_70%)]" />
        <div className="mx-auto grid max-w-7xl items-end gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-amber px-3 py-1 text-xs font-bold tracking-[0.2em] text-coal">
              <Tag className="h-3.5 w-3.5" /> PROMOTION
            </p>
            <h1 className="mt-5 font-display text-5xl font-black italic leading-[1.05] tracking-tight sm:text-7xl">
              ลดสูงสุด <span className="text-accent">20%</span>
              <br />
              ทุกรุ่น ทุกขนาด
            </h1>
            <p className="mt-5 max-w-lg text-lg text-mute">
              ระยะเวลาโปรโมชั่น {thDate(promotions[0].start)} – {thDate(lastEnd)}
            </p>
            <a href="#calculator" className="btn-amber mt-7">
              <Calculator className="h-4 w-4" /> คำนวณส่วนลดของคุณ
            </a>
          </div>
          <div>
            <p className="mb-3 text-sm text-mute">โปรโมชั่นจะสิ้นสุดใน</p>
            <Countdown end={lastEnd} />
          </div>
        </div>
      </section>

      {retail.map((p) => (
        <section key={p.id} className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="relative grid gap-8 overflow-hidden rounded-[2rem] bg-amber p-7 text-coal sm:p-12 lg:grid-cols-[1fr_1.1fr]">
              <div className="pointer-events-none absolute -bottom-16 -right-6 select-none font-display text-[11rem] font-black italic leading-none text-coal/[0.07] sm:text-[16rem]">
                SALE
              </div>
              <div className="relative">
                <p className="text-xs font-bold tracking-[0.25em]">{p.badge}</p>
                <h2 className="mt-2 font-display text-4xl font-black italic sm:text-5xl">{p.title}</h2>
                <p className="mt-1 font-display text-2xl font-bold">{p.headline}</p>
                <p className="mt-4 max-w-md text-coal/75">{p.summary}</p>
                <ul className="mt-6 grid grid-cols-2 gap-2">
                  {p.details.map((d) => (
                    <li key={d} className="flex items-center gap-2 rounded-xl bg-coal/10 px-3 py-2 text-sm font-semibold">
                      <Check className="h-4 w-4 shrink-0" /> {d}
                    </li>
                  ))}
                </ul>
                <Link href={p.cta.href} className="mt-8 inline-flex items-center gap-2 rounded-full bg-coal px-6 py-3.5 font-semibold text-[#fff] transition hover:-translate-y-0.5">
                  {p.cta.label} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Worked example with a real SKU */}
              <div className="relative rounded-3xl bg-coal p-6 text-[#f4f4f5]">
                <div className="flex items-center gap-4">
                  <div className="h-24 w-10 shrink-0">
                    <TreadCanvas tread={heroPat.tread} roll="always" speed={0.5} className="h-full w-full" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-amber">ตัวอย่าง · {heroPat.name}</p>
                    <p className="font-display text-2xl font-bold">{hero.size}</p>
                    <p className="text-sm text-[#9a9aa2]">{baht(hero.price)} / เส้น</p>
                  </div>
                </div>
                <div className="mt-5 divide-y divide-white/10">
                  {[4, 12, 20, 40, 60].map((q) => {
                    const rate = volumeDiscount(q);
                    const full = hero.price * q;
                    return (
                      <div key={q} className="flex items-center justify-between py-3 text-sm">
                        <span className="w-16 font-semibold">{q} เส้น</span>
                        <span className="w-14 text-amber">{rate ? `−${rate * 100}%` : "—"}</span>
                        <span className="flex-1 text-right">
                          {rate > 0 && <span className="mr-2 text-xs text-[#9a9aa2] line-through">{baht(full)}</span>}
                          <span className="font-display text-lg font-bold">{baht(Math.round(full * (1 - rate)))}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      ))}

      <section id="calculator" className="mx-auto mt-20 max-w-7xl scroll-mt-24 px-4 sm:px-6">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.25em] text-accent">CALCULATOR</p>
          <h2 className="mt-3 font-display text-4xl font-black italic tracking-tight">คำนวณโปรโมชั่น</h2>
          <p className="mb-8 mt-2 max-w-2xl text-mute">เลือกรุ่น ขนาด และจำนวน ผสมหลายรุ่นได้ ส่วนลดคิดจากจำนวนเส้นรวมทั้งหมด</p>
        </Reveal>
        <PromoCalculator />
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.25em] text-accent">FOR DEALERS</p>
          <h2 className="mt-3 font-display text-4xl font-black italic tracking-tight">โปรแกรมสำหรับร้านค้า</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {dealer.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.07}>
              <div className="group flex h-full flex-col rounded-3xl border border-line bg-card p-7 transition hover:-translate-y-1 hover:border-amber/50">
                <span className="w-fit rounded-full bg-amber/15 px-3 py-1 text-xs font-semibold text-accent">{p.badge}</span>
                <h3 className="mt-4 font-display text-2xl font-bold italic">{p.title}</h3>
                <p className="mt-1 font-display text-3xl font-black text-accent">{p.headline}</p>
                <p className="mt-3 text-sm text-mute">{p.summary}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.details.map((d) => (
                    <li key={d} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {d}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs text-mute">
                  {thDate(p.start)} – {thDate(p.end)}
                </p>
                <Link href={p.cta.href} className="btn-ghost mt-5 justify-center text-sm">
                  {p.cta.label} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-xs text-mute">ขอสงวนสิทธิ์ไม่สามารถใช้สิทธิ์ร่วมกับรายการส่งเสริมการขายอื่น · โปรแกรมตัวแทนเข้าร่วมผ่านผู้แทนขายหรือ Contact Center</p>
      </section>
    </>
  );
}
