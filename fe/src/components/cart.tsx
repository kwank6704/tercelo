"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { productById, volumeDiscount, type Product } from "@/data/catalog";

type Line = { id: string; qty: number };
type CartLine = Line & { product: Product };

type CartState = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  discountRate: number;
  discount: number;
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartState | null>(null);
const KEY = "tercelo-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]") as Line[];
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage after mount
      setItems(saved.filter((l) => productById[l.id] && l.qty > 0));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const clampQty = (id: string, qty: number) => Math.max(0, Math.min(qty, productById[id]?.stock ?? 0));

  const add = useCallback((id: string, qty = 4) => {
    setItems((prev) => {
      const found = prev.find((l) => l.id === id);
      if (found) return prev.map((l) => (l.id === id ? { ...l, qty: clampQty(id, l.qty + qty) } : l));
      return [...prev, { id, qty: clampQty(id, qty) }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, qty: clampQty(id, qty) } : l)).filter((l) => l.qty > 0));
  }, []);

  const remove = useCallback((id: string) => setItems((prev) => prev.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartState>(() => {
    const lines = items.map((l) => ({ ...l, product: productById[l.id] })).filter((l) => l.product);
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0);
    const discountRate = volumeDiscount(count);
    const discount = Math.round(subtotal * discountRate);
    return { lines, count, subtotal, discountRate, discount, total: subtotal - discount, open, setOpen, add, setQty, remove, clear };
  }, [items, open, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
