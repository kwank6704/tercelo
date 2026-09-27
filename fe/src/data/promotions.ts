/*
 * Promotions shown on /promotions. Add, edit or remove entries here —
 * the page renders whatever is in this list. Dates are ISO (YYYY-MM-DD, inclusive).
 */

export type Promotion = {
  id: string;
  kind: "retail" | "dealer";
  badge: string;
  title: string;
  headline: string; // big number / hook, e.g. "20%"
  summary: string;
  details: string[];
  start: string;
  end: string;
  cta: { label: string; href: string };
};

export const promotions: Promotion[] = [
  {
    id: "volume",
    kind: "retail",
    badge: "ทุกคำสั่งซื้อ",
    title: "ยิ่งซื้อ ยิ่งลด",
    headline: "สูงสุด 20%",
    summary: "ส่วนลดอัตโนมัติตามจำนวนเส้นในตะกร้า รวมได้ทุกรุ่นทุกขนาด ไม่ต้องใช้โค้ด",
    details: ["12 เส้นขึ้นไป ลด 10%", "20 เส้นขึ้นไป ลด 15%", "40 เส้นขึ้นไป ลด 17.5%", "60 เส้นขึ้นไป ลด 20%"],
    start: "2026-09-01",
    end: "2026-10-31",
    cta: { label: "เลือกยาง", href: "/tyres" },
  },
  {
    id: "kick-a",
    kind: "dealer",
    badge: "ตัวแทนจำหน่าย",
    title: "Kick Starter A",
    headline: "20% ทุกรุ่น",
    summary: "ส่วนลดคงที่ 20% ทุกขนาดและรุ่น สำหรับร้านที่ต้องการเริ่มต้นเร็ว",
    details: ["ขั้นต่ำ 12 เส้นต่อคำสั่งซื้อ", "รวมไม่เกิน 200 เส้น ภายใน 14 วัน", "ไม่เกิน 3 คำสั่งซื้อ"],
    start: "2026-09-01",
    end: "2026-10-31",
    cta: { label: "ดูรายละเอียด", href: "/dealer" },
  },
  {
    id: "kick-b",
    kind: "dealer",
    badge: "ตัวแทนจำหน่าย",
    title: "Kick Starter B",
    headline: "10–20%",
    summary: "ส่วนลดขั้นบันไดตามขนาดคำสั่งซื้อ ยิ่งสั่งต่อครั้งมาก ยิ่งได้ส่วนลดมาก",
    details: ["12 / 20 / 40 / 60 เส้นขึ้นไป", "ลด 10% / 15% / 17.5% / 20%", "รวมไม่เกิน 200 เส้น ภายใน 21 วัน"],
    start: "2026-09-01",
    end: "2026-10-31",
    cta: { label: "ดูรายละเอียด", href: "/dealer" },
  },
  {
    id: "kick-c",
    kind: "dealer",
    badge: "ตัวแทนจำหน่าย",
    title: "Kick Starter C",
    headline: "ลดทันที + Voucher 10%",
    summary: "รับส่วนลดทันที 2.5–10% พร้อม Credit Voucher 10% ไว้ใช้กับคำสั่งซื้อถัดไป",
    details: ["60 เส้น มูลค่า 100,000 บาท → จ่าย 90,000 บาท", "รับ Voucher 9,000 บาท", "ใช้แทนส่วนลด 20% ของคำสั่งซื้อใหม่ ขั้นต่ำ 45,000 บาท"],
    start: "2026-09-01",
    end: "2026-10-31",
    cta: { label: "คำนวณความคุ้ม", href: "/dealer" },
  },
];

export function isActive(p: Promotion, now = new Date()) {
  return new Date(`${p.start}T00:00:00+07:00`) <= now && now <= new Date(`${p.end}T23:59:59+07:00`);
}
