import Link from "next/link";
import { ArrowRight, BadgePercent, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import Hero from "@/components/hero";
import SizeFinder from "@/components/size-finder";
import SizeDecoder from "@/components/size-decoder";
import PatternCard from "@/components/pattern-card";
import Reveal from "@/components/reveal";
import TreadCanvas from "@/components/tread-canvas";
import { categories, lineOrderUrl, patterns, products, volumeTiers } from "@/data/catalog";

const catTread = { ev: "ev", hp: "hp", uhp: "uhp", suv: "suv", at: "at", van: "van" } as const;

export default function Home() {
  const inStock = products.reduce((n, p) => n + p.stock, 0);

  return (
    <>
      <Hero />

      {/* Size finder */}
      <section id="finder" className="relative z-10 mx-auto -mt-16 max-w-5xl scroll-mt-24 px-4 sm:px-6">
        <Reveal>
          <p className="mb-3 text-center text-sm text-mute">
            เลือกขนาดยางจากแก้มยางเดิมของคุณ — มีให้เลือก <b className="text-white">{products.length}</b> ขนาด พร้อมส่ง{" "}
            <b className="text-white">{inStock.toLocaleString()}</b> เส้น
          </p>
          <SizeFinder />
        </Reveal>
      </section>

      {/* Categories */}
      <section className="mx-auto mt-32 max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.25em] text-accent">SHOP BY VEHICLE</p>
          <h2 className="mt-3 font-display text-4xl font-black italic tracking-tight sm:text-5xl">เลือกตามประเภทรถ</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {categories.map((c, i) => {
            const n = products.filter((p) => patterns.find((x) => x.slug === p.pattern)?.category === c.id).length;
            return (
              <Reveal key={c.id} delay={i * 0.05}>
                <Link
                  href={`/tyres?cat=${c.id}`}
                  className="group relative flex h-48 overflow-hidden rounded-3xl border border-line bg-card p-5 transition hover:border-amber/40 sm:h-56 sm:p-7"
                >
                  <div className="relative z-10 flex flex-col">
                    <span className="font-display text-5xl font-black italic leading-none text-outline transition group-hover:[-webkit-text-stroke-color:var(--color-amber)] sm:text-7xl">
                      {c.label}
                    </span>
                    <span className="mt-3 font-display text-lg font-semibold sm:text-xl">{c.th}</span>
                    <span className="mt-1 hidden text-sm text-mute sm:block">{c.desc}</span>
                    <span className="mt-auto text-xs text-mute">{n > 0 ? `${n} ขนาด` : "เร็วๆ นี้"}</span>
                  </div>
                  <div className="absolute -right-4 top-1/2 h-[140%] w-24 -translate-y-1/2 rotate-[18deg] opacity-40 transition duration-700 group-hover:rotate-[10deg] group-hover:opacity-90 sm:right-6 sm:w-28">
                    <TreadCanvas tread={catTread[c.id]} className="h-full w-full" />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Patterns */}
      <section className="mx-auto mt-32 max-w-7xl px-4 sm:px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-accent">THE LINEUP</p>
            <h2 className="mt-3 font-display text-4xl font-black italic tracking-tight sm:text-5xl">ดอกยางทุกรุ่น</h2>
            <p className="mt-3 max-w-lg text-mute">วางเมาส์บนการ์ดเพื่อดูดอกยางหมุน — ภาพทุกภาพสร้างจากโค้ดตามโครงสร้างดอกยางจริงของแต่ละรุ่น</p>
          </div>
          <Link href="/tyres" className="btn-ghost">
            ดูทั้งหมด <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patterns.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.08}>
              <PatternCard p={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Trust band */}
      <section className="mt-32 overflow-hidden border-y border-line bg-surface py-5">
        <div className="marquee flex w-max gap-12 whitespace-nowrap font-display text-2xl font-bold italic text-white/25">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["DOT", "ECE R117", "GCC", "SNI", "NOM", "INMETRO", "ISO9001", "3C", "ROLLING FORWARD"].map((t) => (
              <span key={`${k}-${t}`} className="flex items-center gap-12">
                {t} <span className="h-2 w-2 rotate-45 bg-amber/60" />
              </span>
            )),
          )}
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-4">
        {[
          { big: "No.150", small: "Global Fortune 500 Company", note: "กลุ่มบริษัทผู้ผลิต" },
          { big: "No.45", small: "Tire Business Top 75", note: "ผู้ผลิตยางระดับโลก ปี 2024" },
          { big: `${products.length}`, small: "ขนาดพร้อมส่ง", note: "ขอบ 13″ ถึง 20″" },
          { big: "20%", small: "ส่วนลดสูงสุด", note: "เมื่อสั่ง 60 เส้นขึ้นไป" },
        ].map((s, i) => (
          <Reveal key={s.big} delay={i * 0.06}>
            <div className="h-full rounded-3xl border border-line bg-card p-7">
              <p className="font-display text-5xl font-black italic text-accent">{s.big}</p>
              <p className="mt-3 font-semibold">{s.small}</p>
              <p className="text-sm text-mute">{s.note}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Decoder */}
      <section className="mx-auto mt-32 max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SizeDecoder />
        </Reveal>
      </section>

      {/* Dealer teaser */}
      <section className="mx-auto mt-32 max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-amber p-8 text-coal sm:p-14">
            <div className="pointer-events-none absolute -right-10 -top-10 select-none font-display text-[12rem] font-black italic leading-none text-coal/[0.07] sm:text-[18rem]">
              KICK
            </div>
            <div className="relative grid gap-10 lg:grid-cols-2">
              <div>
                <p className="text-xs font-bold tracking-[0.25em]">DEALER PROGRAM 2026-01</p>
                <h2 className="mt-3 font-display text-4xl font-black italic leading-tight sm:text-6xl">KICK STARTER</h2>
                <p className="mt-4 max-w-md text-coal/75">
                  ร้านยางและอู่ที่ต้องการเป็นตัวแทน รับส่วนลดสูงสุด 20% ทุกขนาดทุกรุ่น ระยะเวลาโปรแกรม 1 ก.ย. – 31 ต.ค. 2026
                </p>
                <Link href="/dealer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-coal px-6 py-3.5 font-semibold text-[#fff] transition hover:-translate-y-0.5">
                  คำนวณส่วนลดของคุณ <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex items-end gap-3">
                {[...volumeTiers].reverse().map((t, i) => (
                  <div key={t.min} className="flex flex-1 flex-col items-center gap-2">
                    <span className="font-display text-2xl font-black italic sm:text-3xl">{t.rate * 100}%</span>
                    <div className="w-full rounded-t-2xl bg-coal" style={{ height: `${70 + i * 45}px` }} />
                    <span className="text-sm font-semibold">{t.min}+ เส้น</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Why */}
      <section className="mx-auto mt-24 grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3">
        {[
          { icon: ShieldCheck, t: "มาตรฐานสากล", d: "ผ่านการรับรอง DOT, ECE, SNI, INMETRO และควบคุมคุณภาพตาม ISO9001" },
          { icon: BadgePercent, t: "ยิ่งซื้อยิ่งลด", d: "ส่วนลดอัตโนมัติ 10% – 20% ตามจำนวนเส้นในตะกร้า ไม่ต้องใช้โค้ด" },
          { icon: Truck, t: "สต็อกพร้อมส่ง", d: "ตรวจสอบจำนวนคงเหลือได้ทันทีทุกขนาด สั่งผ่าน LINE ได้เลย" },
        ].map(({ icon: Icon, t, d }, i) => (
          <Reveal key={t} delay={i * 0.06}>
            <div className="h-full rounded-3xl border border-line p-7">
              <Icon className="h-7 w-7 text-accent" />
              <p className="mt-5 font-display text-xl font-semibold">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">{d}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto mt-32 max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="font-display text-4xl font-black italic tracking-tight sm:text-5xl">ไม่แน่ใจว่ารุ่นไหนเหมาะกับรถคุณ?</h2>
          <p className="mt-4 text-mute">ส่งรุ่นรถหรือรูปแก้มยางมาทาง LINE ทีมงานช่วยแนะนำให้ฟรี</p>
          <a href={lineOrderUrl("สวัสดีครับ อยากให้ช่วยแนะนำยาง TERCELO")} target="_blank" rel="noreferrer" className="btn-amber mt-8">
            <MessageCircle className="h-4 w-4" /> ปรึกษาทาง LINE
          </a>
        </Reveal>
      </section>
    </>
  );
}
