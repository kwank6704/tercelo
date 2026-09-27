import Link from "next/link";
import Logo from "./logo";
import { categories, LINE_OA } from "@/data/catalog";

export default function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-line">
      <div className="pointer-events-none absolute -bottom-10 left-0 right-0 select-none text-center font-display text-[22vw] font-black italic leading-none text-white/[0.025]">
        TERCELO
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="skew-x-[-8deg] inline-block">
            <Logo className="skew-x-[8deg]" />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-mute">
            ยาง TERCELO มาตรฐานสากล DOT · ECE R117 · GCC · SNI · INMETRO และระบบคุณภาพ ISO9001
            สำหรับรถยนต์นั่ง EV SUV ออฟโรด และรถเพื่อการพาณิชย์
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-xs font-semibold tracking-[0.2em] text-accent">ประเภทยาง</h3>
          <ul className="space-y-2 text-sm text-mute">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/tyres?cat=${c.id}`} className="hover:text-white">
                  {c.label} — {c.th}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-xs font-semibold tracking-[0.2em] text-accent">ติดต่อ</h3>
          <ul className="space-y-2 text-sm text-mute">
            <li>LINE Official {LINE_OA.toUpperCase()}</li>
            <li>
              <Link href="/dealer" className="hover:text-white">
                สมัครเป็นตัวแทนจำหน่าย
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-line py-6 text-center text-xs text-mute">© {new Date().getFullYear()} TERCELO Thailand · Rolling Forward</div>
    </footer>
  );
}
