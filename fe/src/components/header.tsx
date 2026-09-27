"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import Logo from "./logo";
import { useCart } from "./cart";
import ThemeToggle from "./theme-toggle";
import FontSizeControl from "./font-size-control";

const nav = [
  { href: "/tyres", label: "ยางทั้งหมด" },
  { href: "/try", label: "ลองกับรถคุณ" },
  { href: "/promotions", label: "โปรโมชั่น" },
  { href: "/dealer", label: "ตัวแทนจำหน่าย" },
];

export default function Header() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close the mobile menu on navigation
  useEffect(() => setMenu(false), [path]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || menu ? "border-b border-line bg-ink/95 md:bg-ink/80 md:backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="TERCELO หน้าแรก" className="skew-x-[-8deg] transition-transform hover:scale-[1.03]">
          <Logo className="skew-x-[8deg]" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-full px-4 py-2 text-sm transition-colors hover:bg-white/5 hover:text-white ${
                path === n.href ? "bg-white/5 text-white" : "text-mute"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* On phones these live in the menu so the header never overflows at large text sizes. */}
          <div className="hidden items-center gap-2 md:flex">
            <FontSizeControl />
            <ThemeToggle />
          </div>
          <button
            onClick={() => setOpen(true)}
            className="relative flex h-10 items-center gap-2 rounded-full border border-line bg-white/5 px-4 text-sm transition hover:border-amber/60 hover:bg-amber/10"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">ตะกร้า</span>
            {count > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-amber px-1.5 text-xs font-bold text-coal">{count}</span>
            )}
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden"
            onClick={() => setMenu((m) => !m)}
            aria-label="เมนู"
          >
            {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menu && (
        <nav className="border-t border-line px-4 pb-6 pt-2 md:hidden">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="block border-b border-line py-4 font-display text-xl italic">
              {n.label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-5">
            <span className="text-sm text-mute">การแสดงผล</span>
            <div className="flex items-center gap-2">
              <FontSizeControl />
              <ThemeToggle />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
