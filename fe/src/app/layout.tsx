import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Kanit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart";
import Header from "@/components/header";
import CartDrawer from "@/components/cart-drawer";
import Footer from "@/components/footer";
import { themeInitScript } from "@/lib/theme";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const plex = IBM_Plex_Sans_Thai({
  variable: "--font-plex",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: { default: "TERCELO — ยางรถยนต์ Rolling Forward", template: "%s · TERCELO" },
  description: "ร้านยาง TERCELO ยางรถยนต์ EV, HP, UHP, SUV, All-Terrain และรถตู้ ค้นหาตามขนาด ราคารวม VAT พร้อมส่วนลดตามจำนวน",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" data-theme="light" data-font="md" suppressHydrationWarning className={`${kanit.variable} ${plex.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
