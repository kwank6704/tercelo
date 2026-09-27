import type { TreadStyle } from "@/data/catalog";

/*
 * Procedural tyre tread generator.
 *
 * A tread is described in unit space: u runs across the tread (0 = one shoulder,
 * 1 = the other) and v runs along one pitch (0..1). Each style has straight
 * circumferential grooves plus a list of polylines (lateral grooves and sipes)
 * that repeat every pitch. The same description is drawn two ways:
 *   - drawTreadFront: a tyre standing up, seen head-on, projected onto a cylinder
 *   - drawTreadFlat:  unrolled, used as the texture on the 3D tyre
 */

type Pt = [number, number];
type Stroke = { pts: Pt[]; w: number };
type Spec = { pitch: number; grooves: [number, number][]; strokes: Stroke[] };

const mirror = (pts: Pt[], dv = 0.5): Pt[] => pts.map(([u, v]) => [1 - u, v + dv]);
const s = (w: number, ...pts: Pt[]): Stroke => ({ pts, w });
const both = (w: number, pts: Pt[], dv = 0.5): Stroke[] => [s(w, ...pts), s(w, ...mirror(pts, dv))];

const specs: Record<TreadStyle, Spec> = {
  ev: {
    pitch: 0.2,
    grooves: [[0.2, 0.245], [0.405, 0.445], [0.555, 0.595], [0.755, 0.8]],
    strokes: [
      ...both(0.022, [[-0.02, 0.36], [0.08, 0.4], [0.17, 0.46]]),
      ...both(0.006, [[0.265, 0.1], [0.325, 0.28], [0.385, 0.38]]),
      s(0.006, [0.46, 0.55], [0.5, 0.68], [0.54, 0.76]),
    ],
  },
  hp: {
    pitch: 0.24,
    grooves: [[0.22, 0.27], [0.475, 0.525], [0.73, 0.78]],
    strokes: [
      ...both(0.028, [[-0.02, 0.28], [0.09, 0.34], [0.2, 0.46]]),
      ...both(0.009, [[0.29, 0.18], [0.37, 0.32], [0.455, 0.4]]),
      ...both(0.006, [[0.04, 0.75], [0.1, 0.8], [0.18, 0.9]]),
    ],
  },
  uhp: {
    pitch: 0.26,
    grooves: [[0.3, 0.355], [0.5, 0.55], [0.68, 0.73]],
    strokes: [
      s(0.034, [-0.02, 0.14], [0.12, 0.24], [0.27, 0.3]),
      s(0.01, [0.03, 0.62], [0.14, 0.7], [0.24, 0.74]),
      s(0.014, [0.355, 0.45], [0.41, 0.56], [0.43, 0.62]),
      s(0.007, [0.565, 0.1], [0.62, 0.26], [0.665, 0.34]),
      s(0.013, [0.73, 0.0], [0.86, 0.18], [1.02, 0.36]),
      s(0.013, [0.73, 0.5], [0.86, 0.68], [1.02, 0.86]),
    ],
  },
  tu: {
    pitch: 0.34,
    grooves: [[0.25, 0.275], [0.48, 0.52], [0.725, 0.75]],
    strokes: [
      s(0.04, [-0.02, 0.05], [0.12, 0.18], [0.25, 0.26], [0.47, 0.44]),
      s(0.04, [1.02, 0.55], [0.88, 0.68], [0.75, 0.76], [0.53, 0.94]),
      s(0.018, [0.06, 0.58], [0.16, 0.68], [0.25, 0.74]),
      s(0.018, [0.94, 0.08], [0.84, 0.18], [0.75, 0.24]),
      s(0.008, [0.3, 0.62], [0.36, 0.72], [0.44, 0.78]),
      s(0.008, [0.7, 0.12], [0.64, 0.22], [0.56, 0.28]),
    ],
  },
  suv: {
    pitch: 0.25,
    grooves: [[0.2, 0.24], [0.4, 0.435], [0.565, 0.6], [0.76, 0.8]],
    strokes: [
      s(0.009, [0.5, -0.02], [0.465, 0.25], [0.535, 0.5], [0.465, 0.75], [0.5, 1.02]),
      ...both(0.024, [[-0.02, 0.3], [0.1, 0.33], [0.17, 0.37]]),
      ...both(0.011, [[0.24, 0.6], [0.29, 0.61], [0.31, 0.68], [0.4, 0.7]]),
      ...both(0.005, [[0.04, 0.72], [0.1, 0.76], [0.16, 0.8]]),
    ],
  },
  ht: {
    pitch: 0.24,
    grooves: [[0.22, 0.26], [0.48, 0.52], [0.74, 0.78]],
    strokes: [
      ...both(0.026, [[-0.02, 0.2], [0.1, 0.23], [0.2, 0.26]]),
      ...both(0.018, [[0.26, 0.48], [0.33, 0.48], [0.4, 0.6], [0.48, 0.6]]),
      ...both(0.006, [[0.05, 0.62], [0.11, 0.66], [0.18, 0.72]]),
      ...both(0.006, [[0.29, 0.1], [0.35, 0.18], [0.45, 0.2]]),
    ],
  },
  at: {
    pitch: 0.3,
    grooves: [],
    strokes: [
      s(0.05, [0.33, -0.02], [0.39, 0.25], [0.3, 0.5], [0.39, 0.75], [0.33, 1.02]),
      s(0.05, [0.67, -0.02], [0.61, 0.25], [0.7, 0.5], [0.61, 0.75], [0.67, 1.02]),
      ...both(0.06, [[-0.03, 0.34], [0.12, 0.38], [0.3, 0.44]]),
      s(0.035, [0.38, 0.72], [0.5, 0.64], [0.62, 0.56]),
      s(0.035, [0.38, 0.22], [0.5, 0.14], [0.62, 0.06]),
      ...both(0.007, [[0.06, 0.08], [0.1, 0.13], [0.14, 0.08], [0.18, 0.14], [0.22, 0.1]]),
      ...both(0.007, [[0.44, 0.3], [0.47, 0.36], [0.51, 0.31], [0.55, 0.37]], 0.5),
    ],
  },
  van: {
    pitch: 0.2,
    grooves: [[0.26, 0.31], [0.475, 0.525], [0.69, 0.74]],
    strokes: [
      ...both(0.026, [[-0.02, 0.5], [0.12, 0.5], [0.24, 0.53]]),
      ...[0.1, 0.35, 0.6, 0.85].flatMap((v) => [
        s(0.006, [0.325, v], [0.4, v + 0.03], [0.46, v + 0.03]),
        s(0.006, [0.54, v + 0.12], [0.6, v + 0.15], [0.675, v + 0.15]),
      ]),
      ...both(0.006, [[0.04, 0.12], [0.12, 0.15], [0.2, 0.2]]),
    ],
  },
};

export const RUBBER = "#262626";
export const GROOVE = "#060606";

type Mapper = (u: number, v: number) => [number, number];

function strokeUnits(
  ctx: CanvasRenderingContext2D,
  spec: Spec,
  pitches: number[],
  map: Mapper,
  widthOf: (w: number, v: number) => number,
  groove = GROOVE,
) {
  ctx.strokeStyle = groove;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const k of pitches) {
    for (const st of spec.strokes) {
      ctx.beginPath();
      st.pts.forEach(([u, v], i) => {
        const [x, y] = map(u, k + v);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      const midV = k + st.pts[Math.floor(st.pts.length / 2)][1];
      ctx.lineWidth = widthOf(st.w, midV);
      if (ctx.lineWidth > 0.2) ctx.stroke();
    }
  }
}

/** Tyre standing upright, seen from the front. `phase` (radians) rolls the tread. */
export function drawTreadFront(ctx: CanvasRenderingContext2D, style: TreadStyle, W: number, H: number, phase = 0) {
  const spec = specs[style];
  const TW = W;
  const R = H / 2;
  const cx = W / 2;
  const cy = H / 2;
  const pitchAngle = (spec.pitch * TW) / R;
  const shoulder = 0.42 * Math.PI;

  const xOf = (u: number) => cx + (TW / 2) * (Math.sin((u - 0.5) * 2 * shoulder) / Math.sin(shoulder));
  const map: Mapper = (u, t) => {
    const theta = Math.min(Math.PI, Math.max(0, phase + t * pitchAngle));
    return [xOf(u), cy - R * Math.cos(theta)];
  };

  ctx.clearRect(0, 0, W, H);
  ctx.save();
  const r = W * 0.16;
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, [r, r, r, r]);
  ctx.clip();

  ctx.fillStyle = RUBBER;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = GROOVE;
  for (const [u0, u1] of spec.grooves) ctx.fillRect(xOf(u0), 0, xOf(u1) - xOf(u0), H);

  const first = Math.floor(-phase / pitchAngle) - 1;
  const last = Math.ceil((Math.PI - phase) / pitchAngle) + 1;
  const ks: number[] = [];
  for (let k = first; k <= last; k++) ks.push(k);
  strokeUnits(ctx, spec, ks, map, (w, t) => {
    const theta = phase + t * pitchAngle;
    if (theta < -0.1 || theta > Math.PI + 0.1) return 0;
    return w * TW * (0.3 + 0.7 * Math.sin(Math.min(Math.PI, Math.max(0, theta))));
  });

  // Curvature shading: dark towards the top/bottom, soft highlight band down the tread.
  const v = ctx.createLinearGradient(0, 0, 0, H);
  v.addColorStop(0, "rgba(0,0,0,0.95)");
  v.addColorStop(0.16, "rgba(0,0,0,0.35)");
  v.addColorStop(0.5, "rgba(0,0,0,0)");
  v.addColorStop(0.84, "rgba(0,0,0,0.35)");
  v.addColorStop(1, "rgba(0,0,0,0.95)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);

  const h = ctx.createLinearGradient(0, 0, W, 0);
  h.addColorStop(0, "rgba(0,0,0,0.75)");
  h.addColorStop(0.12, "rgba(0,0,0,0.1)");
  h.addColorStop(0.36, "rgba(255,255,255,0.07)");
  h.addColorStop(0.5, "rgba(255,255,255,0.02)");
  h.addColorStop(0.88, "rgba(0,0,0,0.15)");
  h.addColorStop(1, "rgba(0,0,0,0.8)");
  ctx.fillStyle = h;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

/**
 * Unrolled tread band for textures: pitch direction runs along canvas x
 * (x0 → x0 + length, wraps seamlessly), across-tread along y (y0 → y0 + width).
 */
export function drawTreadFlat(
  ctx: CanvasRenderingContext2D,
  style: TreadStyle,
  x0: number,
  y0: number,
  length: number,
  width: number,
  color = { rubber: RUBBER, groove: GROOVE },
) {
  const spec = specs[style];
  const count = Math.max(1, Math.round(length / (spec.pitch * width)));
  const pitchPx = length / count;
  ctx.fillStyle = color.rubber;
  ctx.fillRect(x0, y0, length, width);
  ctx.fillStyle = color.groove;
  for (const [u0, u1] of spec.grooves) ctx.fillRect(x0, y0 + u0 * width, length, (u1 - u0) * width);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x0, y0, length, width);
  ctx.clip();
  const ks: number[] = [];
  for (let k = -1; k <= count; k++) ks.push(k);
  strokeUnits(ctx, spec, ks, (u, t) => [x0 + t * pitchPx, y0 + u * width], (w) => w * width, color.groove);
  ctx.restore();
}
