"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Eye, EyeOff, ImagePlus, Move } from "lucide-react";
import type { TreadStyle } from "@/data/catalog";
import { diameter, type TyreSize } from "@/lib/fitment";
import { Wheel, WheelDefs } from "./car-stage";

type Props = { stock: TyreSize; tyre: TyreSize; tread: TreadStyle; label: string };
type Pt = { x: number; y: number };

const VB_W = 1000;

/**
 * Upload a side photo of your own car, line up two circles with the existing tyres,
 * and the chosen TERCELO tyre is drawn over each wheel at true scale.
 * The photo never leaves the browser (object URL only, nothing is uploaded or stored).
 */
export default function PhotoFit({ stock, tyre, tread, label }: Props) {
  const uid = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [vbH, setVbH] = useState(560);
  const [marks, setMarks] = useState<[Pt, Pt]>([
    { x: 240, y: 400 },
    { x: 760, y: 400 },
  ]);
  const [radius, setRadius] = useState(80);
  const [preview, setPreview] = useState(true);
  const drag = useRef<number | null>(null);

  useEffect(() => () => void (url && URL.revokeObjectURL(url)), [url]);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    const next = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      const h = (VB_W * img.naturalHeight) / img.naturalWidth;
      setVbH(h);
      const r = Math.round(VB_W * 0.08);
      setRadius(r);
      setMarks([
        { x: VB_W * 0.22, y: h * 0.72 },
        { x: VB_W * 0.78, y: h * 0.72 },
      ]);
      setPreview(false);
      setUrl(next);
    };
    img.src = next;
  };

  const toSvg = (e: React.PointerEvent) => {
    const svg = svgRef.current!;
    const p = svg.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    const r = p.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: r.x, y: r.y };
  };

  const onMove = (e: React.PointerEvent) => {
    if (drag.current === null) return;
    const p = toSvg(e);
    setMarks((m) => {
      const n = [...m] as [Pt, Pt];
      n[drag.current!] = p;
      return n;
    });
  };

  // Scale: the circle the user drew = the stock tyre. Keep the new tyre on the same ground line.
  const scale = radius / (diameter(stock) / 2);
  const Rt = (diameter(tyre) / 2) * scale;
  const Rr = ((tyre.rim * 25.4) / 2) * scale;

  if (!url) {
    return (
      <label className="flex aspect-[16/8] cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-line bg-card p-6 text-center transition hover:border-amber/60 sm:aspect-[16/7]">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-amber/15">
          <ImagePlus className="h-6 w-6 text-accent" />
        </span>
        <span className="font-display text-xl font-semibold">อัปโหลดรูปรถของคุณ (ถ่ายด้านข้าง)</span>
        <span className="max-w-sm text-sm text-mute">ถ่ายให้เห็นล้อทั้งสองข้าง ระดับเดียวกับล้อ รูปอยู่ในเครื่องของคุณเท่านั้น ไม่ถูกอัปโหลดหรือบันทึก</span>
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-black">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${vbH}`}
          className="block h-auto w-full touch-none select-none"
          onPointerMove={onMove}
          onPointerUp={() => (drag.current = null)}
          onPointerLeave={() => (drag.current = null)}
        >
          <defs>
            <WheelDefs uid={uid} />
          </defs>
          <image href={url} x={0} y={0} width={VB_W} height={vbH} preserveAspectRatio="xMidYMid slice" />
          {marks.map((m, i) =>
            preview ? (
              <Wheel key={i} cx={m.x} cy={m.y + radius - Rt} Rt={Rt} Rr={Rr} tread={tread} label={label} driving={false} uid={uid} />
            ) : (
              <g key={i} onPointerDown={(e) => ((drag.current = i), (e.target as Element).setPointerCapture?.(e.pointerId))} className="cursor-move">
                <circle cx={m.x} cy={m.y} r={radius} fill="#f2a516" fillOpacity={0.12} stroke="#f2a516" strokeWidth={3} strokeDasharray="10 6" />
                <circle cx={m.x} cy={m.y} r={10} fill="#f2a516" />
                <line x1={m.x - radius} y1={m.y + radius} x2={m.x + radius} y2={m.y + radius} stroke="#38bdf8" strokeWidth={2} />
              </g>
            ),
          )}
        </svg>
        {!preview && (
          <p className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur">
            <Move className="h-3.5 w-3.5" /> ลากวงกลมให้ตรงกลางล้อ แล้วปรับขนาดให้พอดีขอบยางเดิม
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-card p-4">
        <label className="flex min-w-[200px] flex-1 items-center gap-3 text-sm">
          <span className="shrink-0 text-mute">ขนาดวงกลม</span>
          <input type="range" min={20} max={Math.round(vbH / 2)} value={radius} onChange={(e) => setRadius(+e.target.value)} className="w-full accent-[#f2a516]" disabled={preview} />
        </label>
        <button onClick={() => setPreview((p) => !p)} className="btn-amber !py-2.5 text-sm">
          {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {preview ? "ปรับตำแหน่งล้อ" : "ใส่ยาง TERCELO"}
        </button>
        <label className="btn-ghost cursor-pointer !py-2.5 text-sm">
          เปลี่ยนรูป
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
      </div>
    </div>
  );
}
