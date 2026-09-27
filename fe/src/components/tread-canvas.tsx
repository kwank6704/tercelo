"use client";

import { useEffect, useRef } from "react";
import type { TreadStyle } from "@/data/catalog";
import { drawTreadFront } from "@/lib/tread";

type Props = {
  tread: TreadStyle;
  className?: string;
  /** "hover": rolls while the closest `.group` ancestor is hovered; "always": keeps rolling. */
  roll?: "hover" | "always" | "none";
  speed?: number;
};

export default function TreadCanvas({ tread, className, roll = "hover", speed = 1.4 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let phase = 0;
    let active = roll === "always";
    let raf = 0;
    let last = 0;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (!w || !h) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      drawTreadFront(ctx, tread, w, h, phase);
    };

    const tick = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      phase = (phase + dt * speed) % (Math.PI * 2);
      draw();
      if (active) raf = requestAnimationFrame(tick);
      else last = 0;
    };

    const start = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!active) {
        active = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      if (roll !== "always") active = false;
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);

    const trigger = roll === "hover" ? (canvas.closest(".group") as HTMLElement | null) ?? canvas : null;
    trigger?.addEventListener("pointerenter", start);
    trigger?.addEventListener("pointerleave", stop);
    if (roll === "always") start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      trigger?.removeEventListener("pointerenter", start);
      trigger?.removeEventListener("pointerleave", stop);
    };
  }, [tread, roll, speed]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
