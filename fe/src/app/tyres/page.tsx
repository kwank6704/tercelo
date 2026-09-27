import type { Metadata } from "next";
import ShopView from "@/components/shop-view";

export const metadata: Metadata = { title: "ยางทั้งหมด" };

export default async function TyresPage({ searchParams }: PageProps<"/tyres">) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const init = { cat: one(sp.cat), w: one(sp.w), a: one(sp.a), r: one(sp.r), q: one(sp.q) };
  // Remount when the query changes (e.g. header links) so filters pick up the new values.
  return <ShopView key={JSON.stringify(init)} init={init} />;
}
