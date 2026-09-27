"use client";

import { motion } from "framer-motion";
import type { Pattern } from "@/data/catalog";

const axes: { key: keyof Pattern["ratings"]; label: string }[] = [
  { key: "comfort", label: "นุ่มสบาย" },
  { key: "quiet", label: "เงียบ" },
  { key: "grip", label: "ยึดเกาะ" },
  { key: "handling", label: "ควบคุม" },
  { key: "mileage", label: "ทนทาน" },
  { key: "offroad", label: "ออฟโรด" },
];

export default function RatingRadar({ ratings }: { ratings: Pattern["ratings"] }) {
  const size = 300;
  const c = size / 2;
  const R = 100;
  const pt = (i: number, v: number) => {
    const ang = -Math.PI / 2 + (i / axes.length) * Math.PI * 2;
    return [c + Math.cos(ang) * R * v, c + Math.sin(ang) * R * v] as const;
  };
  const poly = (v: (i: number) => number) => axes.map((_, i) => pt(i, v(i)).join(",")).join(" ");
  const data = poly((i) => ratings[axes[i].key] / 100);

  return (
    <div className="grid items-center gap-6 sm:grid-cols-[300px_1fr]">
      <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[300px]" role="img" aria-label="กราฟคุณสมบัติยาง">
        {[0.25, 0.5, 0.75, 1].map((s) => (
          <polygon key={s} points={poly(() => s)} fill="none" stroke="currentColor" strokeOpacity={0.1} />
        ))}
        {axes.map((_, i) => {
          const [x, y] = pt(i, 1);
          return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="currentColor" strokeOpacity={0.1} />;
        })}
        {/* Plain SVG + CSS fade: iOS Safari leaves framer's scale transform on SVG polygons stuck at 0. */}
        <polygon points={data} fill="rgba(242,165,22,0.22)" stroke="#f2a516" strokeWidth={2} strokeLinejoin="round" className="radar-fade" />
        {axes.map((a, i) => {
          const [x, y] = pt(i, 1.22);
          return (
            <text key={a.key} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-mute text-[12px]">
              {a.label}
            </text>
          );
        })}
      </svg>
      <div className="space-y-3">
        {axes.map((a, i) => (
          <div key={a.key}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-mute">{a.label}</span>
              <span className="tabular-nums">{ratings[a.key]}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-deep to-amber"
                initial={{ width: 0 }}
                whileInView={{ width: `${ratings[a.key]}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.06 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
