import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import Tire3D from "@/components/tire-3d-lazy";
import TreadCanvas from "@/components/tread-canvas";
import RatingRadar from "@/components/rating-radar";
import SizeTable from "@/components/size-table";
import PatternCard from "@/components/pattern-card";
import Reveal from "@/components/reveal";
import { baht, categories, patternBySlug, patterns, priceRange, productsOf } from "@/data/catalog";

export function generateStaticParams() {
  return patterns.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tyres/[slug]">): Promise<Metadata> {
  const p = patternBySlug[(await params).slug];
  return p ? { title: p.name, description: p.blurb } : {};
}

export default async function PatternPage({ params }: PageProps<"/tyres/[slug]">) {
  const { slug } = await params;
  const p = patternBySlug[slug];
  if (!p) notFound();

  const items = productsOf(slug);
  const { min, max } = priceRange(slug);
  const cat = categories.find((c) => c.id === p.category)!;
  const related = patterns.filter((x) => x.slug !== slug && x.category === p.category).concat(patterns.filter((x) => x.category !== p.category)).slice(0, 3);

  return (
    <>
      <section className="grain relative isolate overflow-hidden pt-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_30%_50%,rgba(242,165,22,0.18),transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-8 right-0 -z-10 select-none font-display text-[22vw] font-black italic leading-none text-outline opacity-30">
          {cat.label}
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-4 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-2">
          <div className="relative order-2 h-[380px] sm:h-[520px] lg:order-1">
            <Tire3D tread={p.tread} label={p.name} className="absolute inset-0 cursor-grab" speed={0.4} />
          </div>
          <div className="order-1 lg:order-2">
            <Link href="/tyres" className="inline-flex items-center gap-1.5 text-sm text-mute hover:text-white">
              <ArrowLeft className="h-4 w-4" /> ยางทั้งหมด
            </Link>
            <p className="mt-6 text-xs font-semibold tracking-[0.25em] text-accent">
              {cat.label} · {cat.th}
            </p>
            <h1 className="mt-2 font-display text-5xl font-black italic tracking-tight sm:text-7xl">{p.name}</h1>
            <p className="mt-3 font-display text-xl text-white/85">{p.tagline}</p>
            <p className="mt-5 max-w-xl leading-relaxed text-mute">{p.blurb}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {p.badges.map((b) => (
                <span key={b} className="rounded-full border border-line bg-white/5 px-3 py-1 text-xs">
                  {b}
                </span>
              ))}
              <span className="rounded-full border border-line bg-white/5 px-3 py-1 text-xs">M+S</span>
            </div>
            <div className="mt-8 flex flex-wrap items-end gap-8">
              <div>
                <p className="text-xs text-mute">ราคาต่อเส้น (รวม VAT)</p>
                <p className="font-display text-4xl font-bold text-accent">
                  {baht(min)}
                  {max > min && <span className="text-2xl text-white/60"> – {baht(max)}</span>}
                </p>
              </div>
              <a href="#sizes" className="btn-amber">
                เลือกขนาด ({items.length})
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.25em] text-accent">TECHNOLOGY</p>
          <h2 className="mt-3 font-display text-4xl font-black italic tracking-tight">เทคโนโลยีดอกยาง</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-[220px_1fr]">
          <Reveal className="hidden lg:block">
            <div className="sticky top-24 h-[480px] w-[200px] drop-shadow-[0_40px_40px_rgba(0,0,0,0.7)]">
              <TreadCanvas tread={p.tread} roll="always" speed={0.35} className="h-full w-full" />
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {p.features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="group h-full rounded-3xl border border-line bg-card p-7 transition hover:border-amber/40">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-amber/15 font-display font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <Sparkles className="h-4 w-4 text-accent/0 transition group-hover:text-accent" />
                  </div>
                  <p className="mt-5 font-display text-xl font-semibold">{f.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="rounded-3xl border border-line bg-card p-6 sm:p-10">
            <p className="text-xs font-semibold tracking-[0.25em] text-accent">PERFORMANCE</p>
            <h2 className="mb-8 mt-3 font-display text-3xl font-black italic tracking-tight">คุณสมบัติโดยรวม</h2>
            <RatingRadar ratings={p.ratings} />
          </div>
        </Reveal>
      </section>

      <section id="sizes" className="mx-auto mt-24 max-w-7xl scroll-mt-24 px-4 sm:px-6">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.25em] text-accent">SIZES & PRICES</p>
          <h2 className="mb-8 mt-3 font-display text-4xl font-black italic tracking-tight">ขนาดที่มีจำหน่าย</h2>
          <SizeTable items={items} />
          <p className="mt-4 text-sm text-mute">สั่ง 12 เส้นขึ้นไป (รวมทุกรุ่นในตะกร้า) รับส่วนลดอัตโนมัติ 10% · 20 เส้น 15% · 40 เส้น 17.5% · 60 เส้น 20%</p>
        </Reveal>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <h2 className="mb-8 font-display text-3xl font-black italic tracking-tight">รุ่นอื่นที่น่าสนใจ</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <PatternCard key={r.slug} p={r} />
          ))}
        </div>
      </section>
    </>
  );
}
