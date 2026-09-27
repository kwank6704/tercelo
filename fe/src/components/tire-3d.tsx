"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { TreadStyle } from "@/data/catalog";
import { drawTreadFlat } from "@/lib/tread";

const TEX_W = 4096;
const TEX_H = 1024;
const R_OUT = 1.46;
const R_RIM = 1.0;

/** Tyre cross-section (radius, height) — sidewall → shoulder → crown → shoulder → sidewall. */
function tyreProfile() {
  const ctrl = [
    [R_RIM, -0.4], [1.08, -0.445], [1.2, -0.462], [1.32, -0.45], [1.41, -0.4], [1.448, -0.32],
    [R_OUT, -0.2], [R_OUT, 0], [R_OUT, 0.2],
    [1.448, 0.32], [1.41, 0.4], [1.32, 0.45], [1.2, 0.462], [1.08, 0.445], [R_RIM, 0.4],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  return new THREE.SplineCurve(ctrl).getSpacedPoints(180);
}

function paintTexture(canvas: HTMLCanvasElement, pts: THREE.Vector2[], style: TreadStyle, label: string) {
  const ctx = canvas.getContext("2d")!;
  const n = pts.length - 1;
  // LatheGeometry uv.y = index / n; canvas textures are flipped so v = 1 is the top row.
  const yOf = (i: number) => (1 - i / n) * TEX_H;
  const treadIdx = pts.map((p, i) => (p.x > R_OUT - 0.035 ? i : -1)).filter((i) => i >= 0);
  const t0 = treadIdx[0];
  const t1 = treadIdx[treadIdx.length - 1];

  // Sidewall base with faint concentric ribbing.
  ctx.fillStyle = "#1b1b1c";
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  ctx.strokeStyle = "rgba(255,255,255,0.035)";
  for (let y = 0; y < TEX_H; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(TEX_W, y);
    ctx.stroke();
  }

  // Tread band (pitch direction runs around the tyre = canvas x).
  const top = yOf(t1);
  const bottom = yOf(t0);
  drawTreadFlat(ctx, style, 0, top, TEX_W, bottom - top);

  // Sidewall lettering on both sides, plus an amber pin-stripe near the rim.
  const sides = [
    { mid: yOf(Math.round(t0 * 0.5)), stripe: yOf(Math.round(t0 * 0.12)), flip: false },
    { mid: yOf(Math.round(t1 + (n - t1) * 0.5)), stripe: yOf(Math.round(t1 + (n - t1) * 0.88)), flip: true },
  ];
  for (const side of sides) {
    ctx.fillStyle = "#e9a21a";
    ctx.fillRect(0, side.stripe - 3, TEX_W, 6);
    ctx.save();
    // Lathe u runs clockwise when viewed from the wheel face, so mirror x for readable text.
    ctx.translate(TEX_W, side.mid);
    ctx.scale(-1, side.flip ? -1 : 1);
    ctx.textBaseline = "middle";
    const reps = 2;
    for (let r = 0; r < reps; r++) {
      const x = (r / reps) * TEX_W;
      ctx.fillStyle = "#cfcfcf";
      ctx.font = "italic 900 92px 'Kanit', 'Arial Black', sans-serif";
      ctx.fillText("TERCELO", x + 120, 0);
      ctx.fillStyle = "#e9a21a";
      ctx.font = "italic 700 50px 'Kanit', Arial, sans-serif";
      ctx.fillText(label, x + 620, 4);
      ctx.fillStyle = "#8a8a8a";
      ctx.font = "600 34px 'Kanit', Arial, sans-serif";
      ctx.fillText("ROLLING FORWARD  •  RADIAL TUBELESS", x + 1080, 4);
    }
    ctx.restore();
  }
}

type Props = { tread: TreadStyle; label: string; className?: string; speed?: number };

export default function Tire3D({ tread, label, className, speed = 0.55 }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ repaint: (t: TreadStyle, l: string) => void } | null>(null);

  useEffect(() => {
    const host = hostRef.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "pan-y";

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.55;

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x111111, 0.35));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(-4, 5, 6);
    scene.add(key);
    const amber = new THREE.PointLight(0xffa31a, 60, 20, 1.6);
    amber.position.set(3.2, 1.2, -2.5);
    scene.add(amber);
    const amber2 = new THREE.PointLight(0xff8a00, 25, 14, 1.8);
    amber2.position.set(-3, -2.2, 1.5);
    scene.add(amber2);

    // --- Tyre ---
    const pts = tyreProfile();
    const canvas = document.createElement("canvas");
    canvas.width = TEX_W;
    canvas.height = TEX_H;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const bump = new THREE.CanvasTexture(canvas);
    bump.wrapS = THREE.RepeatWrapping;

    const repaint = (t: TreadStyle, l: string) => {
      paintTexture(canvas, pts, t, l);
      tex.needsUpdate = true;
      bump.needsUpdate = true;
    };
    repaint(tread, label);
    // Repaint once web fonts are ready so the sidewall uses Kanit.
    document.fonts?.ready.then(() => repaint(tread, label));
    apiRef.current = { repaint };

    const tyreMat = new THREE.MeshStandardMaterial({ map: tex, bumpMap: bump, bumpScale: 6, roughness: 0.82, metalness: 0.02, side: THREE.DoubleSide });
    const tyre = new THREE.Mesh(new THREE.LatheGeometry(pts, 220), tyreMat);

    // --- Wheel ---
    const metal = new THREE.MeshStandardMaterial({ color: 0xd9dde2, metalness: 1, roughness: 0.22 });
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x2a2c30, metalness: 0.9, roughness: 0.45 });
    const amberMat = new THREE.MeshStandardMaterial({ color: 0xf2a516, metalness: 0.3, roughness: 0.35, emissive: 0x3a2200 });

    const wheel = new THREE.Group();
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.985, 0.985, 0.8, 96, 1, true), darkMetal);
    barrel.material.side = THREE.DoubleSide;
    wheel.add(barrel);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.985, 0.028, 16, 128), metal);
    lip.rotation.x = Math.PI / 2;
    lip.position.y = 0.38;
    wheel.add(lip);

    const spokeCount = 10;
    for (let i = 0; i < spokeCount; i++) {
      const a = (i / spokeCount) * Math.PI * 2 + (i % 2 ? 0.1 : -0.1);
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.07, i % 2 ? 0.075 : 0.11), metal);
      spoke.position.set(Math.cos(a) * 0.6, 0.31 - (i % 2) * 0.02, Math.sin(a) * 0.6);
      spoke.rotation.y = -a;
      spoke.rotation.z = -0.12;
      wheel.add(spoke);
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.16, 48), metal);
    hub.position.y = 0.3;
    wheel.add(hub);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.18, 48), darkMetal);
    cap.position.y = 0.32;
    wheel.add(cap);
    const capRing = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.018, 12, 48), amberMat);
    capRing.rotation.x = Math.PI / 2;
    capRing.position.y = 0.41;
    wheel.add(capRing);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.06, 6), darkMetal);
      nut.position.set(Math.cos(a) * 0.19, 0.39, Math.sin(a) * 0.19);
      wheel.add(nut);
    }
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.05, 72), new THREE.MeshStandardMaterial({ color: 0x55585e, metalness: 0.8, roughness: 0.5 }));
    disc.position.y = 0.02;
    wheel.add(disc);

    const spin = new THREE.Group();
    spin.add(tyre, wheel);

    // Brake caliper stays put while the wheel turns.
    const caliper = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.085, 16, 40, Math.PI / 3.6), amberMat);
    caliper.rotation.x = Math.PI / 2;
    caliper.rotation.z = Math.PI * 0.18;
    caliper.position.y = 0.12;

    const axle = new THREE.Group();
    axle.rotation.x = Math.PI / 2;
    axle.add(spin, caliper);

    const view = new THREE.Group();
    view.add(axle);
    scene.add(view);

    // --- Interaction ---
    const target = { x: 0.12, y: -0.62 };
    const current = { x: 0.12, y: -0.62 };
    let boost = 0;
    let dragVel = 0;
    let dragging = false;
    let lastX = 0;

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      target.y = -0.62 + nx * 0.7;
      target.x = 0.12 + ny * 0.4;
      if (dragging) {
        dragVel += (e.clientX - lastX) * 0.004;
        lastX = e.clientX;
      }
    };
    const onEnter = () => (boost = 1);
    const onLeave = () => {
      boost = 0;
      dragging = false;
      target.x = 0.12;
      target.y = -0.62;
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
    };
    const onUp = () => (dragging = false);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      // Keep the whole tyre in frame on narrow screens.
      camera.position.z = 8.4 / Math.min(1, Math.max(0.55, w / h));
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(host);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();
    let raf = 0;
    let angVel = speed;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible) return;
      const base = reduced ? speed * 0.2 : speed;
      angVel += (base * (1 + boost * 1.6) - angVel) * Math.min(1, dt * 2.5);
      dragVel *= Math.pow(0.04, dt);
      spin.rotation.y -= (angVel + dragVel) * dt;
      current.x += (target.x - current.x) * Math.min(1, dt * 4);
      current.y += (target.y - current.y) * Math.min(1, dt * 4);
      view.rotation.x = current.x;
      view.rotation.y = current.y;
      view.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.04;
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        }
      });
      tex.dispose();
      bump.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      apiRef.current = null;
    };
    // The scene is built once; tread/label changes are applied by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  useEffect(() => {
    apiRef.current?.repaint(tread, label);
  }, [tread, label]);

  return <div ref={hostRef} className={className} aria-label={`ยาง TERCELO ${label} แบบ 3 มิติ`} role="img" />;
}
