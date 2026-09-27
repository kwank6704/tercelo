import type { CategoryId } from "@/data/catalog";

export type TyreSize = { width: number; aspect: number; rim: number };

/** Overall tyre diameter in millimetres. Sizes without a series (e.g. 195R14C) are nominally 80. */
export function diameter({ width, aspect, rim }: TyreSize) {
  return rim * 25.4 + (2 * width * (aspect || 80)) / 100;
}

export function fmtSize(s: TyreSize) {
  return `${s.width}/${s.aspect}R${s.rim}`;
}

export type FitLevel = "great" | "ok" | "bad";

export function fitCheck(stock: TyreSize, next: TyreSize) {
  const d0 = diameter(stock);
  const d1 = diameter(next);
  const diffPct = ((d1 - d0) / d0) * 100;
  const abs = Math.abs(diffPct);
  const level: FitLevel = abs <= 2 ? "great" : abs <= 3.5 ? "ok" : "bad";
  return {
    diffPct,
    level,
    // Speedometer reads from the stock size; real speed scales with diameter.
    realAt100: 100 * (d1 / d0),
    widthDelta: next.width - stock.width,
    sidewallDelta: (next.width * (next.aspect || 80)) / 100 - (stock.width * (stock.aspect || 80)) / 100,
    sameRim: stock.rim === next.rim,
  };
}

export type Car = {
  id: string;
  label: string;
  hint: string;
  stock: TyreSize;
  suits: CategoryId[];
  /** Side profile in a 1000×360 box: front wheel x, rear wheel x, stock wheel radius (px), sill y. */
  wheels: [number, number];
  R: number;
  sill: number;
  /** Outline from front-bottom over the roof to rear-bottom; arches are added in code. */
  top: string;
  windows: string[];
  head: string;
  tail: string;
  lines?: string[];
};

export const GROUND = 330;

export const cars: Car[] = [
  {
    id: "city",
    label: "รถเล็ก / อีโคคาร์",
    hint: "Yaris, City, Almera, Mazda2",
    stock: { width: 185, aspect: 60, rim: 15 },
    suits: ["hp", "uhp", "ev"],
    wheels: [230, 720],
    R: 58,
    sill: 292,
    top: "M 100 292 Q 92 272 94 246 Q 96 212 128 204 L 290 186 Q 350 124 420 112 L 640 110 Q 700 112 740 150 L 800 196 Q 812 206 812 230 L 810 272 Q 808 292 786 292",
    windows: ["M 312 184 Q 366 132 424 122 L 520 120 L 520 184 Z", "M 534 120 L 636 120 Q 690 124 724 156 L 760 184 L 534 184 Z"],
    head: "M 96 220 L 158 210 L 156 224 L 96 230 Z",
    tail: "M 796 200 L 812 208 L 812 232 L 796 228 Z",
    lines: ["M 527 190 L 527 280"],
  },
  {
    id: "sedan",
    label: "รถเก๋ง",
    hint: "Civic, Altis, Camry, Accord",
    stock: { width: 215, aspect: 55, rim: 17 },
    suits: ["hp", "uhp"],
    wheels: [235, 745],
    R: 62,
    sill: 290,
    top: "M 92 290 Q 84 270 86 240 Q 88 205 122 196 L 300 178 Q 362 120 425 110 L 605 108 Q 675 112 742 170 L 878 182 Q 912 188 916 218 L 914 270 Q 912 290 890 290",
    windows: ["M 322 176 Q 375 128 430 120 L 522 118 L 522 176 Z", "M 536 118 L 602 118 Q 660 122 712 172 L 536 176 Z"],
    head: "M 90 214 Q 110 204 152 200 L 148 214 Q 112 218 90 224 Z",
    tail: "M 898 194 L 916 200 L 916 222 L 890 218 Z",
    lines: ["M 529 182 L 529 280"],
  },
  {
    id: "ev",
    label: "รถยนต์ไฟฟ้า",
    hint: "BYD Atto 3, Tesla Model Y, ORA",
    stock: { width: 215, aspect: 55, rim: 18 },
    suits: ["ev", "uhp", "hp"],
    wheels: [240, 760],
    R: 66,
    sill: 288,
    top: "M 88 288 Q 80 268 82 236 Q 86 200 124 190 L 292 170 Q 385 100 480 92 L 610 92 Q 735 104 862 172 Q 914 184 918 216 L 916 266 Q 914 288 892 288",
    windows: ["M 320 166 Q 396 110 480 102 L 566 102 L 566 166 Z", "M 580 102 L 612 102 Q 720 112 808 166 L 580 166 Z"],
    head: "M 84 212 L 190 200 L 190 206 L 84 220 Z",
    tail: "M 872 178 L 918 190 L 918 198 L 868 188 Z",
    lines: ["M 573 172 L 573 276"],
  },
  {
    id: "suv",
    label: "SUV / Crossover",
    hint: "CR-V, CX-5, Corolla Cross, HR-V",
    stock: { width: 225, aspect: 60, rim: 18 },
    suits: ["suv", "ev", "uhp"],
    wheels: [245, 755],
    R: 72,
    sill: 282,
    top: "M 84 282 Q 76 262 78 226 Q 80 188 112 180 L 262 164 L 332 94 Q 342 84 362 84 L 796 84 Q 826 86 842 104 L 902 164 Q 922 172 924 200 L 924 258 Q 922 282 898 282",
    windows: [
      "M 280 162 L 342 100 L 520 100 L 520 162 Z",
      "M 534 100 L 700 100 L 700 162 L 534 162 Z",
      "M 714 100 L 792 100 Q 812 102 824 116 L 866 162 L 714 162 Z",
    ],
    head: "M 80 196 L 150 188 L 146 204 L 80 210 Z",
    tail: "M 906 172 L 924 178 L 924 204 L 904 200 Z",
    lines: ["M 360 78 L 800 78", "M 527 168 L 527 272"],
  },
  {
    id: "pickup",
    label: "กระบะ / PPV",
    hint: "Hilux, D-Max, Ranger, Fortuner",
    stock: { width: 265, aspect: 65, rim: 17 },
    suits: ["at", "suv"],
    wheels: [225, 775],
    R: 76,
    sill: 280,
    top: "M 70 280 Q 64 262 66 222 Q 68 180 100 174 L 290 160 L 362 94 Q 370 86 388 86 L 560 86 Q 578 86 582 104 L 592 164 L 928 164 L 932 256 Q 930 280 906 280",
    windows: ["M 312 158 L 372 102 L 468 102 L 468 158 Z", "M 482 102 L 562 102 Q 568 102 570 110 L 578 158 L 482 158 Z"],
    head: "M 68 190 L 140 182 L 136 198 L 68 204 Z",
    tail: "M 918 176 L 932 176 L 932 206 L 918 206 Z",
    lines: ["M 592 164 L 592 262", "M 600 178 L 922 178"],
  },
  {
    id: "van",
    label: "รถตู้",
    hint: "Commuter, Hiace, H-1, Staria",
    stock: { width: 215, aspect: 70, rim: 15 },
    suits: ["van"],
    wheels: [215, 800],
    R: 64,
    sill: 290,
    top: "M 72 290 Q 64 270 66 230 Q 68 186 108 172 L 172 160 Q 245 74 330 64 L 900 64 Q 932 66 934 100 L 936 266 Q 934 290 908 290",
    windows: [
      "M 196 156 Q 252 88 322 80 L 392 80 L 392 156 Z",
      "M 406 80 L 560 80 L 560 150 L 406 150 Z",
      "M 574 80 L 730 80 L 730 150 L 574 150 Z",
      "M 744 80 L 900 80 Q 918 82 920 100 L 920 150 L 744 150 Z",
    ],
    head: "M 70 196 L 140 186 L 138 202 L 70 210 Z",
    tail: "M 922 110 L 936 110 L 936 170 L 922 170 Z",
    lines: ["M 400 160 L 400 280", "M 566 160 L 566 280"],
  },
];

/** Full body outline: roofline + bottom edge with a wheel arch cut around each wheel. */
export function bodyPath(car: Car) {
  const cy = GROUND - car.R;
  const ra = car.R * 1.22;
  const dx = Math.sqrt(Math.max(0, ra * ra - (car.sill - cy) ** 2));
  const [xf, xr] = car.wheels;
  const startX = Number(car.top.split(" ")[1]);
  return (
    `${car.top} L ${xr + dx} ${car.sill} A ${ra} ${ra} 0 1 0 ${xr - dx} ${car.sill} ` +
    `L ${xf + dx} ${car.sill} A ${ra} ${ra} 0 1 0 ${xf - dx} ${car.sill} L ${startX} ${car.sill} Z`
  );
}

export const paints = [
  { id: "white", label: "ขาวมุก", hex: "#e9e9ec" },
  { id: "black", label: "ดำ", hex: "#1c1d21" },
  { id: "silver", label: "เงิน", hex: "#a9adb4" },
  { id: "red", label: "แดง", hex: "#b3202a" },
  { id: "blue", label: "น้ำเงิน", hex: "#1f4fa3" },
  { id: "amber", label: "TERCELO", hex: "#f2a516" },
];

export function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.round(Math.min(255, Math.max(0, amt >= 0 ? c + (255 - c) * amt : c * (1 + amt))));
  const r = f(n >> 16);
  const g = f((n >> 8) & 255);
  const b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
