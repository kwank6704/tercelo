"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Pause, Play, Rotate3d, ZoomIn, ZoomOut } from "lucide-react";
import type { TreadStyle } from "@/data/catalog";
import Tire3D from "./tire-3d-lazy";
import type { Tire3DControls, TyreView } from "./tire-3d";

const views: { id: TyreView; label: string }[] = [
  { id: "angle", label: "มุมเฉียง" },
  { id: "side", label: "แก้มยาง" },
  { id: "tread", label: "ดอกยาง" },
  { id: "back", label: "ด้านหลัง" },
];

/** 360° product viewer: drag to turn the tyre any way, pinch/buttons to zoom, presets for tread & sidewall. */
export default function TyreViewer({ tread, label, className = "" }: { tread: TreadStyle; label: string; className?: string }) {
  const controls = useRef<Tire3DControls | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [auto, setAuto] = useState(true);
  const [active, setActive] = useState<TyreView | null>(null);
  const [full, setFull] = useState(false);
  const [canFull, setCanFull] = useState(false);

  useEffect(() => {
    // iPhone Safari has no element fullscreen; hide the button there.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature detection after mount
    setCanFull(!!document.documentElement.requestFullscreen);
    const onChange = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const pick = (v: TyreView) => {
    controls.current?.setView(v);
    setActive(v);
  };
  const toggleFull = () => (document.fullscreenElement ? document.exitFullscreen() : boxRef.current?.requestFullscreen());

  const btn = "grid h-10 w-10 place-items-center rounded-full border border-line bg-card/80 backdrop-blur transition hover:border-amber/60";

  return (
    <div ref={boxRef} className={`relative ${full ? "bg-ink" : ""} ${className}`}>
      {/* A manual drag leaves the preset view, so clear its highlight. */}
      <div className="absolute inset-0" onPointerDown={() => setActive(null)}>
        <Tire3D
          tread={tread}
          label={label}
          speed={0}
          orbit
          controlsRef={controls}
          onAutoChange={(on) => {
            setAuto(on);
            if (on) setActive(null);
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        />
      </div>

      <p className="pointer-events-none absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-card/80 px-3 py-1.5 text-xs backdrop-blur">
        <Rotate3d className="h-3.5 w-3.5 text-accent" /> ลากเพื่อหมุน 360° · จีบนิ้วเพื่อซูม
      </p>

      <div className="absolute right-3 top-14 flex flex-col gap-2">
        <button className={btn} onClick={() => controls.current?.zoom(0.85)} aria-label="ซูมเข้า">
          <ZoomIn className="h-4 w-4" />
        </button>
        <button className={btn} onClick={() => controls.current?.zoom(1.18)} aria-label="ซูมออก">
          <ZoomOut className="h-4 w-4" />
        </button>
        <button className={btn} onClick={() => controls.current?.setAuto(!auto)} aria-label={auto ? "หยุดหมุนอัตโนมัติ" : "หมุนอัตโนมัติ"}>
          {auto ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        {canFull && (
          <button className={btn} onClick={toggleFull} aria-label={full ? "ออกจากเต็มจอ" : "เต็มจอ"}>
            {full ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-3 flex justify-center px-3">
        <div className="flex gap-1 rounded-full border border-line bg-card/85 p-1 backdrop-blur" role="group" aria-label="มุมมอง">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => pick(v.id)}
              className={`rounded-full px-3 py-1.5 text-xs transition sm:px-4 sm:text-sm ${
                active === v.id ? "bg-amber font-semibold text-coal" : "text-mute hover:text-white"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
