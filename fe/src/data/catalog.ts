import raw from "./products.json";

export type TreadStyle = "ev" | "hp" | "uhp" | "tu" | "suv" | "ht" | "at" | "van";

export type CategoryId = "ev" | "hp" | "uhp" | "suv" | "at" | "van";

export type Product = {
  id: string;
  pattern: string;
  size: string;
  loadSpeed: string;
  width: number;
  aspect: number | null;
  rim: number;
  zr: boolean;
  commercial: boolean;
  lt: boolean;
  stock: number;
  netPrice: number;
  price: number;
};

export type Pattern = {
  slug: string;
  name: string;
  category: CategoryId;
  tread: TreadStyle;
  tagline: string;
  blurb: string;
  features: { title: string; text: string }[];
  // 0–100 scores used for the performance bars
  ratings: { comfort: number; quiet: number; grip: number; handling: number; mileage: number; offroad: number };
  badges: string[];
};

export const categories: { id: CategoryId; label: string; th: string; desc: string }[] = [
  { id: "ev", label: "EV", th: "รถยนต์ไฟฟ้า", desc: "เงียบ ประหยัดพลังงาน วิ่งได้ไกลขึ้น" },
  { id: "hp", label: "HP", th: "รถเก๋ง / รถในเมือง", desc: "นุ่มสบาย ทนทาน คุ้มค่า" },
  { id: "uhp", label: "UHP", th: "สปอร์ต / สมรรถนะสูง", desc: "ยึดเกาะแน่น ควบคุมแม่นยำ" },
  { id: "suv", label: "SUV", th: "SUV / PPV", desc: "นิ่ง เงียบ รับน้ำหนักได้ดี" },
  { id: "at", label: "A/T", th: "ออฟโรด / กระบะ", desc: "ลุยได้ทุกเส้นทาง" },
  { id: "van", label: "VAN", th: "รถตู้ / รถเพื่อการพาณิชย์", desc: "บรรทุกหนัก อายุการใช้งานยาว" },
];

export const patterns: Pattern[] = [
  {
    slug: "tamir-ev01",
    name: "TAMIR EV01",
    category: "ev",
    tread: "ev",
    tagline: "ELEC TECH — ยางสำหรับรถยนต์ไฟฟ้าโดยเฉพาะ",
    blurb:
      "ออกแบบมาเพื่อรับแรงบิดทันทีและน้ำหนักแบตเตอรี่ของรถ EV ลดเสียงรบกวนในห้องโดยสาร และลดแรงต้านการหมุนเพื่อให้วิ่งได้ไกลขึ้นต่อการชาร์จหนึ่งครั้ง",
    features: [
      { title: "Wide Tread Profile", text: "หน้ายางกว้าง เพิ่มความแข็งแรงของบล็อกดอกยาง รับน้ำหนักได้ดีเยี่ยม" },
      { title: "Optimized Tread Pattern", text: "ปรับมุมร่องและแผ่นเหล็กให้ตอบสนองการควบคุมได้แม่นยำขึ้น" },
      { title: "Quiet Noise Reduction", text: "ร่องยางลึกไม่เท่ากัน ช่วยกระจายเสียง ลดเสียงบนถนน" },
      { title: "New Materials", text: "ยางสังเคราะห์ S-SBR รุ่นใหม่ ลดแรงต้านการหมุน เพิ่มระยะทางวิ่ง" },
    ],
    ratings: { comfort: 90, quiet: 95, grip: 82, handling: 84, mileage: 88, offroad: 20 },
    badges: ["Comfort", "Low noise", "Dry handling", "Long range"],
  },
  {
    slug: "sport-d1",
    name: "SPORT D1",
    category: "uhp",
    tread: "uhp",
    tagline: "สมรรถนะสูง ขับสนุกทุกโค้ง",
    blurb:
      "ดอกยางแบบอสมมาตรสำหรับรถสปอร์ตและรถเก๋งสมรรถนะสูง ไหล่ยางด้านนอกแข็งแรงเพื่อการเข้าโค้ง ร่องด้านในระบายน้ำเร็ว ยึดเกาะได้ทั้งถนนแห้งและเปียก",
    features: [
      { title: "Asymmetric Pattern", text: "ดอกด้านในและด้านนอกต่างกัน ระบายน้ำดี พร้อมไหล่ยางที่มั่นคงขณะเข้าโค้ง" },
      { title: "Geometric Chamfered", text: "ลบมุมบล็อกดอกยาง ป้องกันการม้วนตัวขณะเบรก กระจายแรงกดสม่ำเสมอ" },
      { title: "Noise Blocking", text: "แนวร่องต่อเนื่องที่ไหล่ยางช่วยกั้นเสียง ขับขี่เงียบขึ้น" },
      { title: "Variable Pitch", text: "จำลองด้วยคอมพิวเตอร์ ย้ายความถี่เสียงให้อยู่นอกช่วงที่หูได้ยินชัด" },
      { title: "Velvet Technology", text: "แก้มยางสัมผัสกำมะหยี่ โลโก้และลวดลายคมชัดโดดเด่น" },
    ],
    ratings: { comfort: 78, quiet: 80, grip: 94, handling: 95, mileage: 76, offroad: 10 },
    badges: ["Comfort", "High performance", "Asymmetrical"],
  },
  {
    slug: "citytrip-pro-c6",
    name: "CITYTRIP PRO C6",
    category: "hp",
    tread: "hp",
    tagline: "นุ่ม เงียบ ใช้ได้นาน สำหรับทุกวัน",
    blurb:
      "ยางรถเก๋งสำหรับการใช้งานในเมือง ดอกยางแบบ 5-pitch ลดเสียงรบกวน โครงสร้างแข็งแรงทนแรงกระแทก คุ้มค่าทุกกิโลเมตร",
    features: [
      { title: "Excellent Comfort", text: "เทคโนโลยีจำลองการออกแบบ ดอกยาง 5-pitch ลดเสียง ให้การขับขี่เงียบนุ่ม" },
      { title: "Long-lasting Durability", text: "สูตรเนื้อยางใหม่ ยืดหยุ่นและทนการสึกหรอ ใช้งานได้นานขึ้น" },
      { title: "Reliable Safety", text: "โครงยางเสริมเส้นใยความแข็งแรงสูง ต้านแรงกระแทก ลดความเสียหาย" },
    ],
    ratings: { comfort: 92, quiet: 88, grip: 80, handling: 78, mileage: 90, offroad: 15 },
    badges: ["Comfort", "High performance", "Asymmetrical"],
  },
  {
    slug: "citytrip-pro-c7",
    name: "CITYTRIP PRO C7",
    category: "hp",
    tread: "hp",
    tagline: "รุ่นใหม่ ยึดเกาะดีขึ้น เบรกสั้นลง",
    blurb:
      "พัฒนาต่อจาก C6 ด้วยร่องระบายน้ำที่กว้างขึ้นและสูตรเนื้อยางใหม่ เพิ่มการยึดเกาะบนถนนเปียก ยังคงความนุ่มเงียบสำหรับการใช้งานทุกวัน",
    features: [
      { title: "Wider Drainage Grooves", text: "ร่องตามยาวกว้าง ระบายน้ำเร็ว ลดโอกาสเกิดการเหินน้ำ" },
      { title: "Compact Contact Patch", text: "หน้าสัมผัสถนนสม่ำเสมอ ช่วยให้เบรกมั่นใจ" },
      { title: "Comfort Compound", text: "เนื้อยางที่ดูดซับแรงสั่นสะเทือน ขับขี่สบายตลอดทาง" },
    ],
    ratings: { comfort: 90, quiet: 86, grip: 85, handling: 82, mileage: 88, offroad: 15 },
    badges: ["Comfort", "Wet grip", "Long life"],
  },
  {
    slug: "tercesport-tu06",
    name: "TERCESPORT TU06",
    category: "uhp",
    tread: "tu",
    tagline: "SUV สายสปอร์ต ดุดันทุกสภาพถนน",
    blurb:
      "ยาง UHP สำหรับ SUV ขนาดใหญ่ ดอกยางอสมมาตรแบบมีร่องต่อเนื่องตรงกลาง ให้ความมั่นคงที่ความเร็วสูงพร้อมการยึดเกาะที่ยอดเยี่ยม",
    features: [
      { title: "Asymmetric Pattern", text: "ร่องด้านในต่อเนื่อง ระบายน้ำได้ดี ยึดเกาะบนพื้นดินมั่นคง" },
      { title: "Wide Grounding", text: "หน้าสัมผัสกว้าง เพิ่มแรงยึดเกาะถนน" },
      { title: "Central Continuous Ribs", text: "แนวดอกต่อเนื่องที่กลางหน้ายาง รักษาเสถียรภาพการขับตรง" },
      { title: "Variable Pitch", text: "ลดเสียงรบกวนและเพิ่มความสบายในการขับขี่" },
    ],
    ratings: { comfort: 80, quiet: 78, grip: 92, handling: 90, mileage: 80, offroad: 35 },
    badges: ["Comfort", "High performance", "Asymmetrical"],
  },
  {
    slug: "solitude",
    name: "SOLITUDE",
    category: "suv",
    tread: "suv",
    tagline: "ความเงียบระดับพรีเมียมสำหรับ SUV",
    blurb:
      "ยาง SUV ที่เน้นความเงียบและความนิ่งเป็นพิเศษ ด้วยระบบ Muffler Design ที่ดูดซับเสียงในร่องยาง เหมาะกับการเดินทางไกลทั้งครอบครัว",
    features: [
      { title: "Continuous Pattern Rib", text: "ร่องซิกแซก 3D กลางหน้ายาง มั่นคงที่ความเร็วสูงและขับตรงนิ่ง" },
      { title: "Stepped Transverse Groove", text: "ร่องขวางแบบขั้นบันได เพิ่มการยึดเกาะบนถนนเปียก ลดการสึกผิดปกติ" },
      { title: "Semi-closed Shoulder", text: "ไหล่ยางกึ่งปิด ลดการเกิดเสียง เพิ่มความแข็งแรงเมื่อเข้าโค้ง" },
      { title: "Muffler Design", text: "4 ร่องหลัก 12 กลุ่มตัวเก็บเสียง ทำลายคลื่นเสียงที่เกิดในร่อง" },
    ],
    ratings: { comfort: 92, quiet: 96, grip: 82, handling: 80, mileage: 86, offroad: 30 },
    badges: ["Comfort", "High performance", "Symmetrical"],
  },
  {
    slug: "citytrip-htx",
    name: "CITYTRIP HTX",
    category: "suv",
    tread: "ht",
    tagline: "H/T สำหรับ SUV และ PPV ใช้งานได้ทุกวัน",
    blurb:
      "ยางแบบ Highway Terrain สำหรับ SUV และรถ PPV ลดเสียงด้วยร่องรูปตัว Z โครงยางลวดเหล็กรับน้ำหนักสูง ทนทานต่อการเจาะทะลุ",
    features: [
      { title: "Z-shaped Noise Groove", text: "ร่องรูปตัว Z ขัดจังหวะการไหลของอากาศ ลดเสียงและการสั่น" },
      { title: "Virtual Analysis", text: "ออกแบบระยะดอกยางด้วยการจำลอง ลดการสั่นพ้อง ขับสบายขึ้น" },
      { title: "High-load Steel Belt", text: "โครงยางและเข็มขัดเหล็กความแข็งแรงสูง ทนการเจาะ ใช้งานได้นาน" },
      { title: "Wear-resistant Compound", text: "เนื้อยางใหม่ยึดโมเลกุลแน่นขึ้น ทนการสึกหรอ" },
    ],
    ratings: { comfort: 88, quiet: 86, grip: 80, handling: 78, mileage: 92, offroad: 45 },
    badges: ["Comfort", "High performance", "Symmetrical"],
  },
  {
    slug: "wzr505",
    name: "WZR505",
    category: "at",
    tread: "at",
    tagline: "All-Terrain ลุยได้ทั้งดิน หิน และทางดำ",
    blurb:
      "ยาง A/T สำหรับกระบะและรถออฟโรด บล็อกดอกขนาดใหญ่พร้อมแผ่นเสริมความแข็งแรง ร่องระบายกว้าง 2 แนว ยึดเกาะได้ทั้งทางลุยและถนนเปียก",
    features: [
      { title: "Two Wide Drainage Channels", text: "ระบายน้ำเร็ว ป้องกันการลื่นไถล ปลอดภัยบนถนนเปียก" },
      { title: "3D Chamfer", text: "ลบมุมแบบสามมิติหลายชั้น เพิ่มความแข็งแรงของบล็อก ป้องกันการสึกผิดปกติ" },
      { title: "Large Block & Stiffener", text: "บล็อกใหญ่พร้อมแท่งเสริม ยึดเกาะดีทั้งทางเรียบและทางลุย" },
      { title: "Multi-steel Structure", text: "โครงสร้างเหล็กพิเศษ รักษาความแข็งแรงของบล็อกและการยึดเกาะบนทางเปียก" },
    ],
    ratings: { comfort: 70, quiet: 62, grip: 86, handling: 76, mileage: 88, offroad: 92 },
    badges: ["Off-road", "Super high performance", "Symmetric"],
  },
  {
    slug: "wzt705",
    name: "WZT705",
    category: "van",
    tread: "van",
    tagline: "รถตู้และรถบรรทุกเล็ก บรรทุกหนัก ใช้งานคุ้ม",
    blurb:
      "ยางเพื่อการพาณิชย์ รับน้ำหนักสูง ทนการฉีกขาด และมีอายุการใช้งานยาวนาน เหมาะกับรถตู้ รถกระบะบรรทุก และรถขนส่ง",
    features: [
      { title: "Three Wide Drainage Channels", text: "3 ร่องหลักกว้าง ระบายน้ำดี ลดระยะเบรกบนถนนเปียก" },
      { title: "Multi-pitch Pattern", text: "ลดการสั่นและเสียงรบกวน ขับขี่สบายขึ้นแม้บรรทุกหนัก" },
      { title: "Crown Micro-grooves", text: "ร่องเล็กจำนวนมากบนหน้ายาง กระจายแรงอย่างสม่ำเสมอ ลดการสึกไม่เท่ากัน" },
    ],
    ratings: { comfort: 72, quiet: 74, grip: 80, handling: 72, mileage: 95, offroad: 30 },
    badges: ["Super load-bearing", "Longer mileage", "Anti-tearing"],
  },
];

export const products = raw as Product[];

export const patternBySlug = Object.fromEntries(patterns.map((p) => [p.slug, p])) as Record<string, Pattern>;
export const productById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<string, Product>;

export function productsOf(slug: string) {
  return products.filter((p) => p.pattern === slug);
}

export function priceRange(slug: string) {
  const prices = productsOf(slug).map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function rimsOf(slug: string) {
  return [...new Set(productsOf(slug).map((p) => p.rim))].sort((a, b) => a - b);
}

export const allWidths = [...new Set(products.map((p) => p.width))].sort((a, b) => a - b);
export const allAspects = [...new Set(products.map((p) => p.aspect).filter((a): a is number => a !== null))].sort((a, b) => a - b);
export const allRims = [...new Set(products.map((p) => p.rim))].sort((a, b) => a - b);

// Kick Starter B (Dealer Program 2026-01): discount by total tyres in one order.
export const volumeTiers = [
  { min: 60, rate: 0.2 },
  { min: 40, rate: 0.175 },
  { min: 20, rate: 0.15 },
  { min: 12, rate: 0.1 },
];

export function volumeDiscount(qty: number) {
  return volumeTiers.find((t) => qty >= t.min)?.rate ?? 0;
}

export function nextTier(qty: number) {
  return [...volumeTiers].reverse().find((t) => qty < t.min) ?? null;
}

export const baht = (n: number) =>
  new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(n);

export const LINE_OA = "@motivemotive";
export const lineOrderUrl = (text: string) =>
  `https://line.me/R/oaMessage/${encodeURIComponent(LINE_OA)}/?${encodeURIComponent(text)}`;
