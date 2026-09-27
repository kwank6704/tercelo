import { baht, volumeDiscount } from "@/data/catalog";

// Kick Starter C: instant discount by order size, plus a 10% credit voucher on what was paid.
const tiersC = [
  { min: 60, rate: 0.1 },
  { min: 40, rate: 0.075 },
  { min: 20, rate: 0.05 },
  { min: 12, rate: 0.025 },
];

export type DealerPlan = {
  id: "A" | "B" | "C";
  name: string;
  rate: number;
  pay: number;
  voucher: number;
  save: number;
  eligible: boolean;
  note: string;
};

/** Dealer Program 2026-01 (Kick Starter A/B/C) for one order of `qty` tyres worth `gross` before discount. */
export function dealerPlans(qty: number, gross: number): DealerPlan[] {
  const eligible = qty >= 12 && qty <= 200;
  const rA = eligible ? 0.2 : 0;
  const rB = eligible ? volumeDiscount(qty) : 0;
  const rC = eligible ? (tiersC.find((t) => qty >= t.min)?.rate ?? 0) : 0;
  const payC = gross * (1 - rC);
  const voucher = eligible ? payC * 0.1 : 0;
  return [
    { id: "A", name: "Kick Starter A", rate: rA, pay: gross * (1 - rA), voucher: 0, save: gross * rA, eligible, note: "ส่วนลด 20% คงที่ · ภายใน 14 วัน · ไม่เกิน 3 คำสั่งซื้อ" },
    { id: "B", name: "Kick Starter B", rate: rB, pay: gross * (1 - rB), voucher: 0, save: gross * rB, eligible, note: `ส่วนลดตามจำนวน ${rB * 100}% · ภายใน 21 วัน` },
    {
      id: "C",
      name: "Kick Starter C",
      rate: rC,
      pay: payC,
      voucher,
      save: gross * rC + voucher,
      eligible,
      note: `ลดทันที ${rC * 100}% + Credit Voucher ${baht(voucher)} ใช้กับคำสั่งซื้อถัดไป (ขั้นต่ำ ${baht(voucher / 0.2)})`,
    },
  ];
}
