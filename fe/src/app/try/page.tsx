import type { Metadata } from "next";
import TryOn from "@/components/try-on";

export const metadata: Metadata = {
  title: "ลองใส่กับรถคุณ",
  description: "จำลองยาง TERCELO บนรถของคุณ เช็คขนาดว่าเข้ากับซุ้มล้อไหม และความเร็วบนหน้าปัดคลาดเคลื่อนเท่าไร",
};

export default function TryPage() {
  return <TryOn />;
}
