import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { baht, priceRange, productsOf, rimsOf, type Pattern } from "@/data/catalog";
import TreadCanvas from "./tread-canvas";

export default function PatternCard({ p }: { p: Pattern }) {
  const { min } = priceRange(p.slug);
  const rims = rimsOf(p.slug);
  const count = productsOf(p.slug).length;

  return (
    <Link
      href={`/tyres/${p.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card transition duration-500 hover:-translate-y-1 hover:border-amber/40 hover:shadow-[0_30px_80px_-30px_rgba(242,165,22,0.35)]"
    >
      <div className="relative flex h-72 items-center justify-center overflow-hidden bg-[radial-gradient(60%_70%_at_50%_50%,var(--stage),transparent)]">
        <span className="absolute left-5 top-4 font-display text-6xl font-black italic text-outline opacity-50 transition duration-500 group-hover:opacity-100">
          {p.category.toUpperCase()}
        </span>
        <div className="relative h-60 w-24 drop-shadow-[0_25px_25px_rgba(0,0,0,0.7)] transition duration-500 group-hover:scale-105">
          <TreadCanvas tread={p.tread} className="h-full w-full" />
        </div>
        <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-line bg-ink/60 transition group-hover:rotate-45 group-hover:border-amber group-hover:bg-amber group-hover:text-coal">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl font-bold italic tracking-tight">{p.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-mute">{p.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {rims.map((r) => (
            <span key={r} className="rounded-md border border-line px-2 py-0.5 text-xs text-mute">
              R{r}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <p className="text-xs text-mute">เริ่มต้น / เส้น</p>
            <p className="font-display text-2xl font-bold text-accent">{baht(min)}</p>
          </div>
          <p className="text-xs text-mute">{count} ขนาด</p>
        </div>
      </div>
    </Link>
  );
}
