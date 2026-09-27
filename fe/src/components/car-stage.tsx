"use client";

import { useId } from "react";
import type { TreadStyle } from "@/data/catalog";
import { bodyPath, diameter, GROUND, shade, type Car, type TyreSize } from "@/lib/fitment";

/** Gradients shared by every wheel; render once inside an <svg><defs>. */
export function WheelDefs({ uid }: { uid: string }) {
  return (
    <>
      <radialGradient id={`${uid}-tyre`} cx="0.42" cy="0.38" r="0.62">
        <stop offset="0.55" stopColor="#2a2a2c" />
        <stop offset="0.85" stopColor="#141415" />
        <stop offset="1" stopColor="#050505" />
      </radialGradient>
      <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fbfcfd" />
        <stop offset="0.35" stopColor="#c3c8cf" />
        <stop offset="0.55" stopColor="#80868f" />
        <stop offset="0.8" stopColor="#d9dde2" />
        <stop offset="1" stopColor="#9aa0a8" />
      </linearGradient>
      <radialGradient id={`${uid}-barrel`}>
        <stop offset="0.6" stopColor="#0c0d0f" />
        <stop offset="1" stopColor="#2b2e33" />
      </radialGradient>
      <radialGradient id={`${uid}-disc`}>
        <stop offset="0.3" stopColor="#3a3d42" />
        <stop offset="0.75" stopColor="#8a8f96" />
        <stop offset="1" stopColor="#5c6066" />
      </radialGradient>
    </>
  );
}

type WheelProps = { cx: number; cy: number; Rt: number; Rr: number; tread: TreadStyle; label: string; driving: boolean; uid: string };

export function Wheel({ cx, cy, Rt, Rr, tread, label, driving, uid }: WheelProps) {
  const mid = (Rt + Rr) / 2;
  const wall = Rt - Rr;
  const lug = tread === "at";
  const spin = driving ? "wheel-spin" : "";
  const origin = { transformOrigin: `${cx}px ${cy}px` };
  const pathId = `${uid}-sw-${Math.round(cx)}-${Math.round(cy)}`;

  return (
    <g>
      {/* tyre, barrel and brake disc (spinning) */}
      <g className={spin} style={origin}>
        <circle cx={cx} cy={cy} r={Rt} fill={`url(#${uid}-tyre)`} />
        <circle cx={cx} cy={cy} r={Rt - (lug ? 3.5 : 2)} fill="none" stroke="#060606" strokeWidth={lug ? 7 : 4} strokeDasharray={lug ? "7 5" : "2.2 2.6"} />
        <circle cx={cx} cy={cy} r={Rt - (lug ? 8 : 5)} fill="none" stroke="#3a3a3c" strokeWidth={0.7} />
        <circle cx={cx} cy={cy} r={Rr + 1.5} fill="none" stroke="#000" strokeWidth={2.5} />
        <path id={pathId} d={`M ${cx - mid} ${cy} a ${mid} ${mid} 0 1 1 ${mid * 2} 0 a ${mid} ${mid} 0 1 1 ${-mid * 2} 0`} fill="none" />
        <text fill="#c9c9c9" fontSize={Math.max(5, wall * 0.3)} fontWeight={800} fontStyle="italic" letterSpacing={0.5} dominantBaseline="middle">
          <textPath href={`#${pathId}`} startOffset="2%">
            TERCELO
          </textPath>
        </text>
        <text fill="#f2a516" fontSize={Math.max(4, wall * 0.22)} fontWeight={700} dominantBaseline="middle">
          <textPath href={`#${pathId}`} startOffset="52%">
            {label}
          </textPath>
        </text>
        <circle cx={cx} cy={cy} r={Rr} fill={`url(#${uid}-rim)`} />
        <circle cx={cx} cy={cy} r={Rr * 0.92} fill={`url(#${uid}-barrel)`} />
        <circle cx={cx} cy={cy} r={Rr * 0.74} fill={`url(#${uid}-disc)`} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <circle key={i} cx={cx + Math.cos(a) * Rr * 0.55} cy={cy + Math.sin(a) * Rr * 0.55} r={Rr * 0.03} fill="#2a2c30" />;
        })}
      </g>

      {/* caliper sits between disc and spokes and never turns */}
      <path
        d={`M ${cx + Rr * 0.5} ${cy - Rr * 0.48} A ${Rr * 0.68} ${Rr * 0.68} 0 0 1 ${cx + Rr * 0.68} ${cy + Rr * 0.04}`}
        stroke="#f2a516"
        strokeWidth={Rr * 0.18}
        strokeLinecap="round"
        fill="none"
      />

      {/* spokes and hub (spinning) */}
      <g className={spin} style={origin}>
        {Array.from({ length: 5 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 72} ${cx} ${cy})`}>
            <path
              d={`M ${cx - Rr * 0.09} ${cy - Rr * 0.2} L ${cx - Rr * 0.24} ${cy - Rr * 0.9} Q ${cx - Rr * 0.13} ${cy - Rr * 0.95} ${cx - Rr * 0.03} ${cy - Rr * 0.9} L ${cx + Rr * 0.01} ${cy - Rr * 0.2} Z`}
              fill={`url(#${uid}-rim)`}
              stroke="#000"
              strokeOpacity={0.35}
              strokeWidth={0.6}
            />
            <path
              d={`M ${cx + Rr * 0.09} ${cy - Rr * 0.2} L ${cx + Rr * 0.24} ${cy - Rr * 0.9} Q ${cx + Rr * 0.13} ${cy - Rr * 0.95} ${cx + Rr * 0.03} ${cy - Rr * 0.9} L ${cx - Rr * 0.01} ${cy - Rr * 0.2} Z`}
              fill={`url(#${uid}-rim)`}
              opacity={0.8}
              stroke="#000"
              strokeOpacity={0.35}
              strokeWidth={0.6}
            />
          </g>
        ))}
        <circle cx={cx} cy={cy} r={Rr * 0.26} fill={`url(#${uid}-rim)`} stroke="#000" strokeOpacity={0.3} />
        {Array.from({ length: 5 }).map((_, i) => {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
          return <circle key={i} cx={cx + Math.cos(a) * Rr * 0.16} cy={cy + Math.sin(a) * Rr * 0.16} r={Rr * 0.035} fill="#34373c" />;
        })}
        <circle cx={cx} cy={cy} r={Rr * 0.08} fill="#111" stroke="#f2a516" strokeWidth={1.2} />
      </g>
      {/* static gloss on the tyre shoulder */}
      <path
        d={`M ${cx - Rt * 0.72} ${cy - Rt * 0.62} A ${Rt * 0.95} ${Rt * 0.95} 0 0 1 ${cx + Rt * 0.1} ${cy - Rt * 0.94}`}
        stroke="#fff"
        strokeOpacity={0.12}
        strokeWidth={wall * 0.25}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

function bbox(d: string) {
  const n = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
  const xs = n.filter((_, i) => i % 2 === 0);
  const ys = n.filter((_, i) => i % 2 === 1);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

type Props = {
  car: Car;
  paint: string;
  tyre: TyreSize;
  tread: TreadStyle;
  label: string;
  driving: boolean;
  showStock: boolean;
};

/** Side view of the car. Tyres are drawn at true scale relative to the car's stock size. */
export default function CarStage({ car, paint, tyre, tread, label, driving, showStock }: Props) {
  const uid = useId().replace(/:/g, "");
  const scale = (car.R * 2) / diameter(car.stock); // px per mm
  const Rt = (diameter(tyre) / 2) * scale;
  const Rr = ((tyre.rim * 25.4) / 2) * scale;
  const ra = car.R * 1.22;
  const archCy = GROUND - car.R;
  const rubs = Rt > ra - 3;
  const body = bodyPath(car);
  const startX = Number(car.top.split(" ")[1]);
  const endX = Number(car.top.trim().split(" ").at(-2));
  const win = car.windows.map(bbox);
  const beltY = Math.max(...win.map((w) => w.maxY));
  const roofY = Math.min(...win.map((w) => w.minY));
  const dark = paint === "#1c1d21";
  const clip = `${uid}-body`;

  return (
    <svg viewBox="0 20 1000 340" className="h-full w-full overflow-visible" role="img" aria-label={`${car.label} ใส่ยาง ${label}`}>
      <defs>
        <WheelDefs uid={uid} />
        <clipPath id={clip}>
          <path d={body} />
        </clipPath>
        <linearGradient id={`${uid}-paint`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(paint, 0.25)} />
          <stop offset="0.5" stopColor={paint} />
          <stop offset="1" stopColor={shade(paint, -0.55)} />
        </linearGradient>
        {/* studio reflection: bright sky above the shoulder line, dark ground below it */}
        <linearGradient id={`${uid}-refl`} gradientUnits="userSpaceOnUse" x1="0" y1={roofY} x2="0" y2={car.sill}>
          <stop offset="0" stopColor="#fff" stopOpacity={dark ? 0.35 : 0.55} />
          <stop offset={(beltY - roofY) / (car.sill - roofY) + 0.02} stopColor="#fff" stopOpacity={dark ? 0.12 : 0.25} />
          <stop offset={(beltY - roofY) / (car.sill - roofY) + 0.06} stopColor="#000" stopOpacity={0.05} />
          <stop offset={(beltY - roofY) / (car.sill - roofY) + 0.1} stopColor="#fff" stopOpacity={0.14} />
          <stop offset="0.72" stopColor="#000" stopOpacity={0.04} />
          <stop offset="1" stopColor="#000" stopOpacity={0.45} />
        </linearGradient>
        <linearGradient id={`${uid}-ends`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity={0.35} />
          <stop offset="0.1" stopColor="#000" stopOpacity={0} />
          <stop offset="0.9" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.4} />
        </linearGradient>
        <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3c4a5a" />
          <stop offset="0.6" stopColor="#10161e" />
          <stop offset="1" stopColor="#060a0e" />
        </linearGradient>
        <linearGradient id={`${uid}-head`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fffdf5" />
          <stop offset="1" stopColor="#c9cdd3" />
        </linearGradient>
        <radialGradient id={`${uid}-shadow`}>
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-glow`}>
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* floor */}
      <ellipse cx={(startX + endX) / 2} cy={GROUND + 3} rx={(endX - startX) / 2 + 30} ry={16} fill={`url(#${uid}-shadow)`} />
      {car.wheels.map((x) => (
        <ellipse key={x} cx={x} cy={GROUND + 1} rx={Rt * 0.9} ry={5} fill="#000" opacity={0.55} />
      ))}

      <g className={driving ? "car-bob" : ""}>
        {car.wheels.map((x) => (
          <circle key={x} cx={x} cy={archCy} r={ra - 2} fill="#08080a" />
        ))}
        {car.wheels.map((x) => (
          <Wheel key={x} cx={x} cy={GROUND - Rt} Rt={Rt} Rr={Rr} tread={tread} label={label} driving={driving} uid={uid} />
        ))}

        {/* paint layers */}
        <path d={body} fill={`url(#${uid}-paint)`} />
        <g clipPath={`url(#${clip})`}>
          <rect x="0" y="0" width="1000" height="360" fill={`url(#${uid}-refl)`} />
          <rect x={startX} y="0" width={endX - startX} height="360" fill={`url(#${uid}-ends)`} />
          {/* shoulder crease highlight */}
          <path d={`M ${startX + 40} ${beltY + 16} Q ${(startX + endX) / 2} ${beltY + 4} ${endX - 20} ${beltY + 12}`} stroke="#fff" strokeOpacity={0.5} strokeWidth={1.4} fill="none" />
          <path d={`M ${startX + 40} ${beltY + 18} Q ${(startX + endX) / 2} ${beltY + 6} ${endX - 20} ${beltY + 14}`} stroke="#000" strokeOpacity={0.15} strokeWidth={2} fill="none" />
          {/* rocker panel */}
          <rect x="0" y={car.sill - 16} width="1000" height="20" fill="#000" opacity={0.35} />
          {/* fender lips */}
          {car.wheels.map((x) => (
            <circle key={x} cx={x} cy={archCy} r={ra + 3} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={5} />
          ))}
          {/* bumper intakes */}
          <path d={`M ${startX} ${car.sill - 34} L ${startX + 70} ${car.sill - 36} L ${startX + 64} ${car.sill - 10} L ${startX} ${car.sill - 8} Z`} fill="#000" opacity={0.55} />
          <path d={`M ${endX - 60} ${car.sill - 22} L ${endX} ${car.sill - 22} L ${endX} ${car.sill - 4} L ${endX - 56} ${car.sill - 4} Z`} fill="#000" opacity={0.45} />
        </g>
        <path d={body} fill="none" stroke="#000" strokeOpacity={0.4} strokeWidth={1.2} />

        {/* glass */}
        {car.windows.map((w, i) => (
          <g key={w}>
            <path d={w} fill={`url(#${uid}-glass)`} stroke="#050505" strokeWidth={3.5} strokeLinejoin="round" />
            <path
              d={`M ${win[i].minX + (win[i].maxX - win[i].minX) * 0.15} ${win[i].maxY} L ${win[i].minX + (win[i].maxX - win[i].minX) * 0.45} ${win[i].minY} L ${win[i].minX + (win[i].maxX - win[i].minX) * 0.6} ${win[i].minY} L ${win[i].minX + (win[i].maxX - win[i].minX) * 0.3} ${win[i].maxY} Z`}
              fill="#fff"
              opacity={0.08}
              clipPath={`url(#${clip})`}
            />
          </g>
        ))}
        {car.lines?.map((l) => (
          <path key={l} d={l} stroke="#000" strokeOpacity={0.35} strokeWidth={1.4} fill="none" />
        ))}
        {/* door handles under all but the last window */}
        {win.slice(0, -1).map((w, i) => (
          <rect key={i} x={w.maxX - 46} y={beltY + 20} width={26} height={5} rx={2.5} fill={shade(paint, -0.35)} stroke="#000" strokeOpacity={0.3} />
        ))}
        {/* side mirror at the base of the A-pillar */}
        <path
          d={`M ${win[0].minX + 4} ${win[0].maxY - 2} q -4 -16 14 -18 l 18 0 q 6 2 4 12 l -6 8 z`}
          fill={`url(#${uid}-paint)`}
          stroke="#000"
          strokeOpacity={0.45}
        />
        <path d={car.head} fill={`url(#${uid}-head)`} stroke="#000" strokeOpacity={0.4} />
        <path d={car.head} fill="none" stroke="#f2a516" strokeWidth={1.2} strokeOpacity={0.9} transform="translate(0 -1)" />
        <path d={car.tail} fill="#c1121f" stroke="#000" strokeOpacity={0.4} />
        {driving && (
          <>
            <ellipse cx={bbox(car.head).minX - 10} cy={(bbox(car.head).minY + bbox(car.head).maxY) / 2} rx={60} ry={16} fill={`url(#${uid}-glow)`} />
            <ellipse cx={bbox(car.tail).maxX + 4} cy={(bbox(car.tail).minY + bbox(car.tail).maxY) / 2} rx={16} ry={10} fill="#ff2a2a" opacity={0.35} />
          </>
        )}

        {showStock &&
          car.wheels.map((x) => <circle key={x} cx={x} cy={GROUND - car.R} r={car.R} fill="none" stroke="#38bdf8" strokeWidth={2} strokeDasharray="6 5" />)}
        {rubs &&
          car.wheels.map((x) => (
            <circle key={x} cx={x} cy={archCy} r={ra} fill="none" stroke="#ef4444" strokeWidth={3} strokeDasharray="4 4" className="animate-pulse" />
          ))}
      </g>
    </svg>
  );
}
