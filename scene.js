/* Taska & Tadika PAC: the scroll-driven background.
   A shelf of Montessori materials (pink tower, number rods, golden beads, geometric
   solids, colour tablets and brown stair) rendered with Three.js behind the whole page.
   Each section ("chapter") arranges the materials differently; scrolling blends between
   arrangements, some of which are pinned to page elements so they travel with the content. */
import * as THREE from './three.module.min.js';
import { RoundedBoxGeometry } from './RoundedBoxGeometry.js';
import { RoomEnvironment } from './RoomEnvironment.js';

const canvas = document.getElementById('scene');
const stage = canvas?.parentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

if (canvas) start();

function start() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    stage.remove();
    return;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.95;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
  camera.position.set(0, 1.4, 14);
  camera.lookAt(0, 0, 0);

  // Soft studio light, like a classroom shelf by a window
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  scene.environment = pmrem.fromScene(envScene, 0.04).texture;
  scene.environmentIntensity = 0.38;
  envScene.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.(); });
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xfff4e6, 0x4a2a1c, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 2.6);
  key.position.set(6, 6, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffe2c4, 0.9);
  rim.position.set(-6, 2, -4);
  scene.add(rim);

  // Seeded randomness so the layout is the same on every visit
  let seed = 20080101;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const jit = (a) => (rand() - 0.5) * 2 * a;

  // ---------------------------------------------------------------------------
  // Materials and geometry
  // ---------------------------------------------------------------------------
  const mat = (color, roughness = 0.55, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const M = {
    pink: mat('#E27693', 0.62),
    red: mat('#D23A24', 0.5),
    blue: mat('#3A70DA', 0.5),
    solid: mat('#2A5BC4', 0.42),
    gold: mat('#E8AE34', 0.28, 0.35),
    brown: mat('#8A5A3B', 0.6),
  };
  const tabletColors = ['#D13A25', '#2F62C2', '#F1C232', '#2E8B57', '#EE8A2E', '#7A4FB5', '#EC9BB0', '#8A5A3B', '#9A9AA2', '#FFF7EA', '#2A2B38', '#3FB6C4'];
  const box = new RoundedBoxGeometry(1, 1, 1, 4, 0.12);
  const thinBox = new RoundedBoxGeometry(1, 1, 1, 3, 0.18);

  const records = [];
  function addRecord(mesh, group, idx, base) {
    const r = {
      mesh, group, idx, base,
      phase: rand() * Math.PI * 2,
      pos: new THREE.Vector3(), rot: new THREE.Vector3(), s: 1,
      push: new THREE.Vector3(), spinX: 0, spinY: 0,
      tA: { p: new THREE.Vector3(), r: new THREE.Vector3(), s: 1, m: 2 },
      tB: { p: new THREE.Vector3(), r: new THREE.Vector3(), s: 1, m: 2 },
      jx: jit(1), jy: jit(1), jz: jit(1),
    };
    scene.add(mesh);
    records.push(r);
    return r;
  }

  // Pink tower: ten cubes, 1 cm to 10 cm
  const TOWER = [];
  const edge = (i) => 0.1 + 0.09 * i;
  for (let i = 0; i < 10; i++) {
    const m = new THREE.Mesh(box, M.pink);
    const e = edge(i);
    TOWER.push(addRecord(m, 'tower', i, new THREE.Vector3(e, e, e)));
  }
  const stackY = (i) => { let y = edge(i) / 2; for (let j = i + 1; j < 10; j++) y += edge(j); return y; };
  const TOWER_H = stackY(0) + edge(0) / 2;

  // Number rods: 1 to 10 segments, alternating red and blue
  const SEG = 0.3;
  const RODS = [];
  for (let i = 0; i < 10; i++) {
    const g = new THREE.Group();
    const n = i + 1;
    for (let k = 0; k < n; k++) {
      const s = new THREE.Mesh(box, k % 2 ? M.blue : M.red);
      s.scale.set(SEG * 0.995, 0.16, 0.16);
      s.position.x = (k - (n - 1) / 2) * SEG;
      g.add(s);
    }
    const r = addRecord(g, 'rods', i, new THREE.Vector3(1, 1, 1));
    r.len = n * SEG;
    RODS.push(r);
  }

  // Geometric solids (blue, as in the classroom)
  const solidGeos = [
    new THREE.SphereGeometry(0.42, 40, 24),
    new RoundedBoxGeometry(0.72, 0.72, 0.72, 3, 0.05),
    new THREE.CylinderGeometry(0.32, 0.32, 0.82, 40),
    new THREE.ConeGeometry(0.4, 0.86, 40),
    new THREE.CylinderGeometry(0.44, 0.44, 0.82, 3),
    new THREE.ConeGeometry(0.48, 0.82, 4),
    new THREE.SphereGeometry(0.36, 40, 24).scale(1, 1.38, 1),
  ];
  const SOLIDS = solidGeos.map((geo, i) => addRecord(new THREE.Mesh(geo, M.solid), 'solids', i, new THREE.Vector3(1, 1, 1)));

  // Colour tablets (box 2)
  const TABLETS = tabletColors.map((c, i) => addRecord(new THREE.Mesh(thinBox, mat(c, 0.45)), 'tablets', i, new THREE.Vector3(0.56, 0.36, 0.07)));

  // Brown stair: ten prisms, 1 cm to 10 cm square
  const STAIR = [];
  const sw = (i) => 0.07 * (i + 1);
  for (let i = 0; i < 10; i++) STAIR.push(addRecord(new THREE.Mesh(box, M.brown), 'stair', i, new THREE.Vector3(sw(i), sw(i), 1.4)));

  // Soft contact shadow under the tower when it stands stacked
  const shadowTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    grd.addColorStop(0, 'rgba(60, 20, 30, 0.55)');
    grd.addColorStop(1, 'rgba(60, 20, 30, 0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0 }));
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  // Golden beads: one hundred, instanced
  const BEADS = 100;
  const beadMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.085, 18, 12), M.gold, BEADS);
  beadMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  beadMesh.frustumCulled = false;
  scene.add(beadMesh);
  const beads = Array.from({ length: BEADS }, () => ({ pos: new THREE.Vector3(), push: new THREE.Vector3(), a: new THREE.Vector3(), b: new THREE.Vector3(), phase: rand() * 6.28, jx: jit(1), jy: jit(1) }));
  const dummy = new THREE.Object3D();

  // ---------------------------------------------------------------------------
  // View and page measurements
  // ---------------------------------------------------------------------------
  const view = { w: 1, h: 1, hW: 1, hH: 1, aspect: 1, mobile: false, fit: 1 };
  const anchors = {
    hero: document.querySelector('.hero'),
    heroTitle: document.querySelector('.hero__display'),
    rooms: document.querySelector('.rooms__head'),
    archive: document.querySelector('.archive__head'),
    day: document.querySelector('.day__head'),
    foot: document.querySelector('.foot__mark'),
  };
  const chapters = [...document.querySelectorAll('[data-chapter]')].sort((a, b) => a.dataset.chapter - b.dataset.chapter);
  const LAST = chapters.length - 1;
  const rects = new Map();

  function resize() {
    const w = innerWidth, h = innerHeight;
    if (w === view.w && Math.abs(h - view.h) < (finePointer ? 1 : 120)) return;
    view.w = w; view.h = h;
    view.aspect = w / h;
    view.mobile = view.aspect < 0.9;
    view.fit = Math.min(1, Math.max(0.46, view.aspect / 1.55));
    camera.aspect = view.aspect;
    camera.updateProjectionMatrix();
    view.hH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.length();
    view.hW = view.hH * view.aspect;
    renderer.setSize(w, h, false);
    if (reduce) renderOnce();
  }

  // Read element rects once per frame (cheap, no layout changes in between)
  function readRects() {
    rects.clear();
    for (const k in anchors) if (anchors[k]) rects.set(k, anchors[k].getBoundingClientRect());
  }
  const ax = (k, f) => { const r = rects.get(k); return r ? (((r.left + r.width * f) / view.w) * 2 - 1) * view.hW : 0; };
  const ay = (k, f) => { const r = rects.get(k); return r ? -(((r.top + r.height * f) / innerHeight) * 2 - 1) * view.hH : 0; };
  const U = (u) => u * view.hW;
  const V = (v) => v * view.hH;

  let secH = 1;
  function chapterValue() {
    const mid = innerHeight * 0.5;
    for (const el of chapters) {
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { secH = r.height; return Number(el.dataset.chapter) + (mid - r.top) / r.height; }
    }
    const first = chapters[0]?.getBoundingClientRect();
    return first && first.top > mid ? 0 : LAST + 0.5;
  }

  // ---------------------------------------------------------------------------
  // Arrangements per chapter. Each writes a target position, rotation and scale.
  // ---------------------------------------------------------------------------
  const isInkTheme = () => document.documentElement.dataset.theme === 'ink';
  const ctx = { time: 0, local: 0, shelf: 0, age: 2, clock: { h: 0, m: 0 } };

  function offstage(r, out, side) {
    const { hW, hH } = view;
    const k = r.idx;
    if (side === 'down') out.p.set(U(0.55) + r.jx * 1.5, -hH * 1.6 - k * 0.25, -1 + r.jz);
    else if (side === 'up') out.p.set(U(0.4) + r.jx * hW * 0.8, hH * 1.7 + k * 0.12, -1.5 + r.jz);
    else if (side === 'left') out.p.set(-hW * 1.5 - k * 0.3, V(0.2) + r.jy * 2, -1);
    else out.p.set(hW * 1.6 + k * 0.25, V(0.1) + r.jy * 2.2, -1 + r.jz);
    out.r.set(r.jx, r.jy * 2, r.jz);
    out.s = 1;
  }

  function towerStack(r, out, cx, baseY, s) {
    const i = r.idx;
    out.p.set(cx + r.jx * 0.02 * s, baseY + stackY(i) * s, 0);
    out.r.set(0.04, 0.62 + r.jy * 0.05, 0);
    out.s = s;
    out.m = 1;
  }

  function pose(ch, r, out) {
    const { mobile, fit } = view;
    const g = r.group;
    const i = r.idx;
    // Spin mode: 0 holds still, 1 turns about y, 2 tumbles freely
    out.m = 2;
    switch (ch) {
      case 0: { // Hero: the pink tower, stacked
        if (g === 'tower') {
          const s = mobile ? 0.48 : 0.98 * fit;
          return towerStack(r, out, mobile ? U(0.42) : U(0.5), mobile ? ay('heroTitle', 0) + 0.35 : ay('hero', 0.8), s);
        }
        if (g === 'solids' && (i === 0 || i === 3 || i === 2) && !mobile) {
          const cx = U(0.5), cy = ay('hero', 0.8) + TOWER_H * 0.5;
          const off = { 0: [-2.1, 2.2, -3], 3: [2.2, 1.1, -2.5], 2: [-2.5, -1.2, -3.5] }[i];
          out.p.set(cx + off[0], cy + off[1], off[2]);
          out.r.set(0.5 + i, 0.3 * i, 0.2);
          out.s = 0.62;
          return;
        }
        return offstage(r, out, g === 'beads' ? 'up' : g === 'solids' ? 'left' : g === 'tablets' ? 'right' : 'right');
      }
      case 1: { // Approach: the child lays the cubes out to compare them
        if (g === 'tower') {
          const t = i / 9;
          const s = mobile ? 0.55 : 0.9 * fit;
          if (mobile) out.p.set(U(-0.75 + 1.6 * t), V(0.74 - 0.14 * Math.sin(t * Math.PI)), -0.5 - Math.sin(t * Math.PI));
          else out.p.set(U(0.16 + 0.78 * t), V(0.7 - 0.95 * Math.pow(t, 1.15)), -0.6 - 1.6 * Math.sin(t * Math.PI));
          out.r.set(0.4 + t * 1.2 + ctx.local * 1.4, 0.5 + t * 1.8 + ctx.local * 2.2, 0.25 * Math.sin(i));
          out.s = s;
          return;
        }
        return offstage(r, out, g === 'tower' ? 'down' : g === 'solids' ? 'left' : 'right');
      }
      case 2: { // Programmes: number rods as a staircase, the chosen age steps forward
        if (g === 'rods') {
          const s = mobile ? 0.5 : 0.95 * fit;
          const gap = 0.3 * s;
          const xL = mobile ? U(-0.82) : U(0.22);
          const cy = mobile ? ay('rooms', 0) + 1.5 : ay('rooms', 0.45);
          const picked = i === ctx.age;
          out.p.set(xL + (r.len * s) / 2 + (picked ? 0.35 : 0), cy + (4.5 - i) * gap, picked ? 1.4 : 0);
          out.r.set(0.22 + (picked ? 0.35 : 0), -0.3, picked ? 0.05 : 0);
          out.s = s;
          out.m = 0;
          return;
        }
        return offstage(r, out, g === 'tower' ? 'down' : g === 'solids' ? 'left' : 'right');
      }
      case 3: { // Curriculum: everything sits on a long shelf that slides with the panels
        const s = mobile ? 0.45 : 0.68 * fit;
        const drift = -ctx.shelf * view.hW * 3.2;
        const yLow = V(-0.95), yHigh = V(mobile ? 0.8 : 0.8);
        if (g === 'stair') {
          let x = U(0.15);
          for (let j = 0; j < i; j++) x += (sw(j) + 0.05) * s;
          out.p.set(x + (sw(i) * s) / 2 + drift, yLow + (sw(i) * s) / 2, -0.5);
          out.r.set(0.32, 0.55, 0);
          out.s = s;
          out.m = 0;
          return;
        }
        if (g === 'solids') {
          out.p.set(U(1.2 + i * 0.5) + drift, yLow + 0.32 * s, -0.4);
          out.r.set(0.3 + ctx.local * 2 + i, ctx.local * 3 + i * 0.7, 0);
          out.s = s * 0.9;
          return;
        }
        if (g === 'tablets') {
          out.p.set(U(0.05 + i * 0.36) + drift * 1.15, yHigh + Math.sin(i * 1.7) * 0.18, -1.2);
          out.r.set(0.2, 0.4 + ctx.local * 4 + i * 0.4, 0.15 * Math.sin(i));
          out.s = s;
          return;
        }
        if (g === 'rods' && i < 6) {
          out.p.set(U(2.6 + i * 0.32) + drift * 0.9, yHigh - 0.1 - i * 0.05, -1.6);
          out.r.set(0.3, 0.2 + i * 0.1, 0.12);
          out.s = s;
          out.m = 0;
          return;
        }
        return offstage(r, out, g === 'tower' ? 'down' : 'right');
      }
      case 5: { // Hours: colour tablets become a clock face; two rods tell the time in Shah Alam
        const s = mobile ? 0.5 : 0.9 * fit;
        const cx = mobile ? U(0.1) : U(0.58);
        const cy = mobile ? ay('day', 0) + 1.7 : ay('day', 0.5);
        if (g === 'tablets') {
          const a = (i / 12) * Math.PI * 2;
          const R = 1.55 * s;
          out.p.set(cx + Math.sin(a) * R, cy + Math.cos(a) * R, 0);
          out.r.set(0, 0, -a);
          out.s = s;
          out.m = 0;
          return;
        }
        if (g === 'rods' && (i === 3 || i === 5)) {
          const a = i === 3 ? ctx.clock.h : ctx.clock.m;
          const len = r.len * s;
          out.p.set(cx + Math.sin(a) * len * 0.5, cy + Math.cos(a) * len * 0.5, 0.35 + (i === 5 ? 0.2 : 0));
          out.r.set(0, 0, Math.PI / 2 - a);
          out.s = s;
          out.m = 0;
          return;
        }
        return offstage(r, out, g === 'tower' ? 'down' : g === 'solids' ? 'left' : 'right');
      }
      case 6: { // Visit: a few pieces resting at the edges of the desk
        const s = mobile ? 0.45 : 0.75 * fit;
        if (g === 'tablets' && i < 4) {
          out.p.set(U(1.02) - i * 0.12, V(0.55 - i * 0.22), -1);
          out.r.set(0.3, -0.6 + i * 0.4, 0.4 - i * 0.3);
          out.s = s;
          return;
        }
        if (g === 'solids' && i < 2) {
          out.p.set(U(0.98), V(-0.7 - i * 0.12), -0.5);
          out.r.set(0.4, i, 0);
          out.s = s;
          return;
        }
        return offstage(r, out, g === 'tower' ? 'down' : g === 'solids' ? 'left' : 'right');
      }
      case 7: { // Footer: the tower is built again, with the solids in orbit
        const s = mobile ? 0.42 : 0.72 * fit;
        const cx = ax('foot', mobile ? 0.82 : 0.84);
        const baseY = ay('foot', 0.92);
        if (g === 'tower') return towerStack(r, out, cx, baseY, s);
        if (g === 'solids') {
          const a = ctx.time * 0.35 + i * ((Math.PI * 2) / 7);
          const R = (mobile ? 1.3 : 2.4) * s + 0.4;
          out.p.set(cx + Math.cos(a) * R, baseY + TOWER_H * s * 0.55 + Math.sin(a * 1.3) * 0.4, Math.sin(a) * R);
          out.r.set(a, a * 0.7, 0);
          out.s = s * 0.75;
          return;
        }
        return offstage(r, out, g === 'tablets' ? 'right' : 'right');
      }
      default:
        return offstage(r, out, g === 'tower' ? 'down' : g === 'solids' ? 'left' : 'right');
    }
  }

  // Beads: ten-bars in the approach and on the shelf, a hundred-square in Moments
  const euler = new THREE.Euler();
  const sqMatrix = new THREE.Matrix4();
  function beadPose(ch, b, k, out) {
    const { hW, hH, mobile, fit } = view;
    const s = mobile ? 0.55 : 0.95 * fit;
    if (ch === 1 && k < 30) {
      const j = Math.floor(k / 10), n = k % 10;
      const cxs = mobile ? [-0.5, 0.1, 0.65] : [0.55, 0.74, 0.9];
      const cys = mobile ? [-0.83, -0.9, -0.82] : [-0.5, -0.7, -0.4];
      const th = [0.45, -0.3, 1.15][j] + ctx.local * 0.9;
      out.set(U(cxs[j]) + Math.cos(th) * (n - 4.5) * 0.19 * s, V(cys[j]) + Math.sin(th) * (n - 4.5) * 0.19 * s, -1.4);
      return;
    }
    if (ch === 3 && k < 50) {
      const j = Math.floor(k / 10), n = k % 10;
      const drift = -ctx.shelf * hW * 3.2;
      out.set(U(0.6 + j * 0.62) + (n - 4.5) * 0.19 * s + drift * 1.05, V(mobile ? 0.68 : 0.66) + Math.sin(j * 2.1) * 0.25, -0.9);
      return;
    }
    if (ch === 4) {
      const row = Math.floor(k / 10), col = k % 10;
      const cx = mobile ? U(0.25) : U(0.62);
      const cy = mobile ? ay('archive', 0) + 1.5 : ay('archive', 0.45);
      out.set((col - 4.5) * 0.215 * s, (row - 4.5) * 0.215 * s, 0).applyMatrix4(sqMatrix);
      out.x += cx; out.y += cy;
      return;
    }
    out.set(U(0.3) + b.jx * hW, hH * 1.6 + Math.abs(b.jy) * 2, -2);
  }

  // ---------------------------------------------------------------------------
  // Pointer: materials lean away from the cursor; the shelf tilts toward it
  // ---------------------------------------------------------------------------
  const pointer = { x: 0, y: 0, wx: 9999, wy: 9999, active: false };
  if (finePointer && !reduce) {
    addEventListener('pointermove', (e) => {
      pointer.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / innerHeight) * 2 - 1);
      pointer.active = true;
    }, { passive: true });
    document.addEventListener('pointerleave', () => (pointer.active = false));
  }

  // ---------------------------------------------------------------------------
  // Frame loop
  // ---------------------------------------------------------------------------
  const clock = new THREE.Clock();
  const smooth = (t) => t * t * (3 - 2 * t);
  const TAU = Math.PI * 2;
  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), push = new THREE.Vector3();
  let started = false;
  const startTime = performance.now();
  let frames = 0, slowFrames = 0, dprCap = Math.min(devicePixelRatio, view.mobile ? 1.5 : 2);
  renderer.setPixelRatio(dprCap);

  function updateClock() {
    const now = window.PAC?.hours?.malaysiaNow?.();
    if (!now) return;
    const mins = now.mins;
    ctx.clock.m = ((mins % 60) / 60) * Math.PI * 2;
    ctx.clock.h = (((mins / 60) % 12) / 12) * Math.PI * 2;
  }
  updateClock();
  setInterval(updateClock, 30_000);
  addEventListener('pac:age', (e) => (ctx.age = e.detail));
  ctx.age = window.PAC?.age ?? 2;

  function step(dt, snap) {
    const paused = !!window.PAC?.paused;
    if (!paused) ctx.time += dt;
    readRects();
    const c = reduce ? 0 : chapterValue();
    const i0 = Math.min(LAST, Math.floor(c));
    const local = c - i0;
    const i1 = Math.min(LAST, i0 + 1);
    // Blend into the next arrangement over the last ~85% of a viewport of each section
    const remain = (1 - local) * secH;
    const span = Math.min(innerHeight * 0.85, secH * 0.5);
    const w = smooth(Math.min(1, Math.max(0, 1 - remain / span)));
    ctx.local = local;
    ctx.shelf = window.PAC?.shelf ?? 0;

    const vel = Math.min(1, Math.abs(window.PAC?.lenis?.velocity || 0) / 40);
    const { hW, hH } = view;
    pointer.wx = pointer.active ? pointer.x * hW : 9999;
    pointer.wy = pointer.active ? pointer.y * hH : 9999;
    const k = 1 - Math.exp(-(snap ? 1000 : 4.2) * dt);
    const kPush = 1 - Math.exp(-6 * dt);
    const t = ctx.time;
    const sinceStart = (performance.now() - startTime) / 1000;

    for (const r of records) {
      pose(i0, r, r.tA);
      if (w > 0 && i1 !== i0) {
        const keep = ctx.local;
        ctx.local = 0;
        pose(i1, r, r.tB);
        ctx.local = keep;
        r.tA.p.lerp(r.tB.p, w);
        r.tA.r.lerp(r.tB.r, w);
        r.tA.s += (r.tB.s - r.tA.s) * w;
      }
      // Opening: the tower is placed one cube at a time, largest first
      if (r.group === 'tower' && !reduce && i0 === 0) {
        const delay = 0.35 + (9 - r.idx) * 0.13;
        if (sinceStart < delay) r.tA.p.y += 9;
      }
      if (!started || snap) { r.pos.copy(r.tA.p); r.rot.copy(r.tA.r); r.s = r.tA.s; if (!started && r.group === 'tower' && !reduce) r.pos.y += 9; }
      else {
        const kk = r.group === 'tower' && i0 === 0 && sinceStart < 3 ? 1 - Math.exp(-7 * dt) : k;
        r.pos.lerp(r.tA.p, kk);
        r.rot.lerp(r.tA.r, kk);
        r.s += (r.tA.s - r.s) * kk;
      }
      // Lean away from the pointer
      push.set(0, 0, 0);
      if (pointer.active) {
        const dx = r.pos.x - pointer.wx, dy = r.pos.y - pointer.wy;
        const d = Math.hypot(dx, dy);
        const R = 1.4;
        if (d < R && d > 0.0001) push.set((dx / d) * (R - d) * 0.45, (dy / d) * (R - d) * 0.45, (R - d) * 0.3);
      }
      r.push.lerp(push, kPush);

      const mode = w >= 0.5 && i1 !== i0 ? r.tB.m : r.tA.m;
      const rate = reduce || paused ? 0 : dt * (0.08 + vel * 0.9);
      if (mode >= 1) r.spinY += rate; else r.spinY += (Math.round(r.spinY / TAU) * TAU - r.spinY) * k;
      if (mode === 2) r.spinX += rate * 0.2; else r.spinX += (Math.round(r.spinX / TAU) * TAU - r.spinX) * k;
      const bob = reduce ? 0 : Math.sin(t * 0.9 + r.phase) * 0.05;
      const m = r.mesh;
      m.position.set(r.pos.x + r.push.x, r.pos.y + r.push.y + bob, r.pos.z + r.push.z);
      m.rotation.set(r.rot.x + r.spinX, r.rot.y + r.spinY, r.rot.z);
      m.scale.copy(r.base).multiplyScalar(Math.max(0.0001, r.s));
    }

    // Shadow follows the base cube while the tower is stacked
    const stacked = i0 === 0 || i0 === 7 ? (i1 === i0 ? 1 : 1 - w) : (i1 === 7 ? w : 0);
    const base = TOWER[9].mesh;
    shadow.position.set(base.position.x, base.position.y - base.scale.y * 0.5 - 0.01, base.position.z);
    shadow.scale.setScalar(base.scale.x * 2.4);
    shadow.material.opacity += (stacked * (isInkTheme() ? 0.25 : 0.9) - shadow.material.opacity) * k;

    // Hundred-square orientation (turns with scroll)
    euler.set(-0.38 + (reduce ? 0 : Math.sin(t * 0.4) * 0.1), 0.42 + (i0 === 4 ? local * 0.7 : 0) + (reduce ? 0 : Math.sin(t * 0.25) * 0.3), 0.05);
    sqMatrix.makeRotationFromEuler(euler);

    for (let b = 0; b < BEADS; b++) {
      const bd = beads[b];
      beadPose(i0, bd, b, bd.a);
      if (w > 0 && i1 !== i0) {
        const keep = ctx.local;
        ctx.local = 0;
        beadPose(i1, bd, b, bd.b);
        ctx.local = keep;
        bd.a.lerp(bd.b, w);
      }
      if (!started || snap) bd.pos.copy(bd.a);
      else bd.pos.lerp(bd.a, 1 - Math.exp(-(3.2 + (b % 10) * 0.25) * dt));
      push.set(0, 0, 0);
      if (pointer.active) {
        const dx = bd.pos.x - pointer.wx, dy = bd.pos.y - pointer.wy;
        const d = Math.hypot(dx, dy);
        if (d < 1.1 && d > 0.0001) push.set((dx / d) * (1.1 - d) * 0.5, (dy / d) * (1.1 - d) * 0.5, 0);
      }
      bd.push.lerp(push, kPush);
      dummy.position.set(bd.pos.x + bd.push.x, bd.pos.y + bd.push.y + (reduce ? 0 : Math.sin(t + bd.phase) * 0.02), bd.pos.z);
      dummy.updateMatrix();
      beadMesh.setMatrixAt(b, dummy.matrix);
    }
    beadMesh.instanceMatrix.needsUpdate = true;

    // Whole-scene parallax toward the pointer
    const tiltK = 1 - Math.exp(-2.5 * dt);
    scene.rotation.y += ((pointer.active ? pointer.x * 0.07 : 0) - scene.rotation.y) * tiltK;
    scene.rotation.x += ((pointer.active ? -pointer.y * 0.04 : 0) - scene.rotation.x) * tiltK;

    started = true;
  }

  let shown = false;
  function loop(dt) {
    step(dt, false);
    renderer.render(scene, camera);
    if (!shown) { shown = true; stage.classList.add('is-live'); document.documentElement.classList.add('has-scene'); }
    // Drop the pixel ratio once if the device is struggling
    if (frames < 120) {
      frames++;
      if (dt > 0.024) slowFrames++;
      if (frames === 120 && slowFrames > 40 && dprCap > 1) { dprCap = 1; renderer.setPixelRatio(1); }
    }
  }

  function renderOnce() {
    step(0.016, true);
    renderer.render(scene, camera);
  }

  resize();
  addEventListener('resize', resize);

  // One clock for everything: when GSAP is present the scene renders on its ticker,
  // right after Lenis and ScrollTrigger, so objects pinned to page elements never lag.
  const gsap = window.gsap;
  const onTick = (time, deltaMs) => loop(Math.min(0.05, deltaMs / 1000));
  const onFrame = () => loop(Math.min(0.05, clock.getDelta()));

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    if (gsap) gsap.ticker.remove(onTick); else renderer.setAnimationLoop(null);
    stage.classList.remove('is-live');
  });

  if (reduce) {
    stage.classList.add('is-static');
    renderOnce();
    stage.classList.add('is-live');
    document.documentElement.classList.add('has-scene');
    return;
  }

  if (gsap) gsap.ticker.add(onTick);
  else {
    renderer.setAnimationLoop(onFrame);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) renderer.setAnimationLoop(null);
      else { clock.getDelta(); renderer.setAnimationLoop(onFrame); }
    });
  }
}
