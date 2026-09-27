import type { Metadata } from "next";
import { CalendarDays, MessageCircle, PackageCheck, Ticket } from "lucide-react";
import DealerCalculator from "@/components/dealer-calculator";
import Reveal from "@/components/reveal";
import { LINE_OA, lineOrderUrl } from "@/data/catalog";

export const metadata: Metadata = { title: "โปรแกรมตัวแทนจำหน่าย Kick Starter" };

const programs = [
  {
    id: "A",
    title: "ส่วนลด 20% ทุกขนาด ทุกรุ่น",
    rows: [
      ["ขั้นต่ำต่อคำสั่งซื้อ", "12 เส้น"],
      ["จำนวนรวมสูงสุด", "200 เส้น"],
      ["ระยะเวลา", "14 วัน"],
      ["จำนวนคำสั่งซื้อ", "ไม่เกิน 3 ครั้ง"],
    ],
  },
  {
    id: "B",
    title: "ส่วนลดตามขนาดคำสั่งซื้อ",
    rows: [
      ["12 เส้นขึ้นไป", "10%"],
      ["20 เส้นขึ้นไป", "15%"],
      ["40 เส้นขึ้นไป", "17.5%"],
      ["60 เส้นขึ้นไป", "20%"],
    ],
    foot: "รวมไม่เกิน 200 เส้น ภายใน 21 วัน",
  },
  {
    id: "C",
    title: "ส่วนลดทันที + Credit Voucher 10%",
    rows: [
      ["12 เส้นขึ้นไป", "2.5% + Voucher"],
      ["20 เส้นขึ้นไป", "5% + Voucher"],
      ["40 เส้นขึ้นไป", "7.5% + Voucher"],
      ["60 เส้นขึ้นไป", "10% + Voucher"],
    ],
    foot: "รวมไม่เกิน 200 เส้น ภายใน 21 วัน",
  },
];

export default function DealerPage() {
  return (
    <>
      <section className="grain relative isolate overflow-hidden pb-16 pt-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(242,165,22,0.25),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold tracking-[0.3em] text-accent">TERCELO PCLT DEALER PROGRAM 2026-01</p>
          <h1 className="mt-5 font-display text-6xl font-black italic leading-none tracking-tight sm:text-8xl lg:text-9xl">
            KICK
            <span className="text-outline"> STARTER</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-mute">
            โปรแกรมสำหรับร้านยาง อู่ และผู้ค้าส่งรายใหม่ เลือกรูปแบบส่วนลดที่เหมาะกับการสั่งซื้อของคุณ
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-5 py-2.5 text-sm">
            <CalendarDays className="h-4 w-4 text-accent" /> เริ่มโปรแกรมได้ 1 ก.ย. – 31 ต.ค. 2026
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-3">
        {programs.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-line bg-card p-7 transition hover:border-amber/40">
              <span className="pointer-events-none absolute -right-4 -top-10 font-display text-[10rem] font-black italic leading-none text-white/[0.04] transition group-hover:text-accent/10">
                {p.id}
              </span>
              <p className="text-xs font-semibold tracking-[0.25em] text-accent">KICK STARTER {p.id}</p>
              <h2 className="mt-3 font-display text-2xl font-bold">{p.title}</h2>
              <dl className="mt-6 divide-y divide-line">
                {p.rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between py-3 text-sm">
                    <dt className="text-mute">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              {p.foot && <p className="mt-4 text-xs text-mute">{p.foot}</p>}
            </div>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.25em] text-accent">CALCULATOR</p>
          <h2 className="mb-8 mt-3 font-display text-4xl font-black italic tracking-tight">เทียบว่าแบบไหนคุ้มกับคุณ</h2>
          <DealerCalculator />
        </Reveal>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="grid gap-6 rounded-3xl border border-line p-7 sm:p-10 lg:grid-cols-2">
            <div>
              <Ticket className="h-8 w-8 text-accent" />
              <h2 className="mt-4 font-display text-3xl font-bold italic">Credit Voucher ทำงานอย่างไร</h2>
              <p className="mt-4 leading-relaxed text-mute">
                ตัวอย่าง: สั่งมากกว่า 60 เส้น มูลค่า 100,000 บาท รับส่วนลดทันที 10% (จ่าย 90,000 บาท) และได้ Credit Voucher 10% ของ 90,000 = <b className="text-white">9,000 บาท</b>
              </p>
              <p className="mt-3 leading-relaxed text-mute">
                ใช้ Voucher ได้เมื่อซื้อครบ 200 เส้น หรือครบ 21 วัน โดยใช้แทนส่วนลด 20% ของคำสั่งซื้อใหม่ได้ครั้งเดียว คำสั่งซื้อใหม่ต้องมีมูลค่า 45,000 บาทก่อนส่วนลดจึงจะใช้ได้เต็มมูลค่า
                หากน้อยกว่า มูลค่าส่วนที่เหลือจะถูกยกเลิก
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3">
              {[
                { icon: PackageCheck, t: "ยืนยันผ่านผู้แทนขาย หรือ Contact Center เพื่อกำหนดวันเริ่มโปรแกรม" },
                { icon: MessageCircle, t: `ติดต่อ LINE Official ${LINE_OA.toUpperCase()}` },
              ].map(({ icon: Icon, t }) => (
                <div key={t} className="flex items-center gap-4 rounded-2xl bg-white/[0.03] p-5">
                  <Icon className="h-6 w-6 shrink-0 text-accent" />
                  <span>{t}</span>
                </div>
              ))}
              <a href={lineOrderUrl("สนใจสมัครโปรแกรมตัวแทน TERCELO Kick Starter")} target="_blank" rel="noreferrer" className="btn-amber mt-2 justify-center">
                สมัครเป็นตัวแทนทาง LINE
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
