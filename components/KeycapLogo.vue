<template>
  <span ref="root" class="keycaps" @pointerenter="hover(true)" @pointerleave="hover(false)" @pointerdown="press">
    <!--
      A snapshot of the 3D keys at rest, rendered by this component. It shows until
      WebGL is ready (or forever without WebGL), and the canvas then takes over pixel
      for pixel, so the logo never jumps between two different views.
    -->
    <img :src="stillSrc" alt="" class="keycaps__still" width="92" height="52" :class="{ 'is-hidden': ready }" />
    <canvas ref="canvas" class="keycaps__canvas" :class="{ 'is-ready': ready }" aria-hidden="true" />
  </span>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const root = ref<HTMLElement>();
const canvas = ref<HTMLCanvasElement>();
const ready = ref(false);
// A plain string, so Vite serves it from public/ instead of bundling it as a module
const stillSrc = "/img/keycaps.png";

// Damped springs for each key's vertical offset
const springs = {
  w: { y: 0, v: 0, target: 0 },
  z: { y: 0, v: 0, target: 0 },
};
let kick: () => void = () => {};
let cleanup: () => void = () => {};
let popTimer: ReturnType<typeof setInterval> | undefined;
let releaseTimer: ReturnType<typeof setTimeout> | undefined;

function hover(on: boolean) {
  springs.w.target = on ? -0.1 : 0;
  springs.z.target = on ? 0.24 : 0;
  kick();
}

function press() {
  springs.z.target = -0.14;
  kick();
  clearTimeout(releaseTimer);
  releaseTimer = setTimeout(() => {
    springs.z.target = 0.24;
    kick();
  }, 140);
}

function pop() {
  if (springs.z.target !== 0) return;
  springs.z.target = 0.22;
  kick();
  clearTimeout(releaseTimer);
  releaseTimer = setTimeout(() => {
    springs.z.target = 0;
    kick();
  }, 260);
}

// The CSS keycaps show first; three.js takes over once the page has loaded,
// the handwritten title (if any) has compiled its shaders, and the browser is idle
const titleBusy = useState("title-gpu-busy", () => false);
async function settled() {
  if (document.readyState !== "complete") await new Promise((r) => addEventListener("load", r, { once: true }));
  await new Promise((r) => (titleBusy.value ? watch(titleBusy, (busy) => !busy && r(true)) : r(true)));
  await new Promise((r) => ("requestIdleCallback" in window ? requestIdleCallback(r, { timeout: 3000 }) : setTimeout(r, 500)));
}

onMounted(async () => {
  const el = canvas.value;
  if (!el) return;
  await settled();
  if (!canvas.value) return; // Left the page while waiting

  const THREE = await import("three");
  const { RoundedBoxGeometry } = await import("three/examples/jsm/geometries/RoundedBoxGeometry.js");
  // Legends are drawn with Inter, so wait for it before painting them
  await document.fonts?.load("600 160px Inter").catch(() => {});

  let renderer: InstanceType<typeof THREE.WebGLRenderer>;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: true });
  } catch {
    return; // No WebGL: the CSS keycaps stay
  }

  const width = 92;
  const height = 52;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(24, width / height, 0.1, 50);
  camera.position.set(0, 2.25, 2.85);
  camera.lookAt(0, -0.05, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xb8c2cc, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(-2.5, 5, 3);
  scene.add(sun);

  // A keycap: rounded box whose top is pulled in and back, like a sculpted OEM profile
  function keycapGeometry() {
    const g = new RoundedBoxGeometry(1, 0.56, 1, 5, 0.14);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = (y + 0.28) / 0.56; // 0 at the base, 1 at the top
      const s = 1 - 0.2 * t;
      pos.setX(i, pos.getX(i) * s);
      pos.setZ(i, pos.getZ(i) * s - 0.06 * t);
    }
    g.computeVertexNormals();
    return g;
  }

  function legend(letter: string, color: string) {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.font = '600 168px Inter, "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letter, 128, 140);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }

  function shadowTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
    g.addColorStop(0, "rgba(0,12,31,0.55)");
    g.addColorStop(1, "rgba(0,12,31,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  const geometry = keycapGeometry();
  const legendGeometry = new THREE.PlaneGeometry(0.62, 0.62);
  const shadowGeometry = new THREE.PlaneGeometry(1.5, 1.5);
  const shadowTex = shadowTexture();
  const disposables: { dispose(): void }[] = [geometry, legendGeometry, shadowGeometry, shadowTex];

  function makeKey(x: number, body: number, letter: string, ink: string) {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: body, roughness: 0.55, metalness: 0 });
    const cap = new THREE.Mesh(geometry, bodyMat);
    const tex = legend(letter, ink);
    const legendMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
    const label = new THREE.Mesh(legendGeometry, legendMat);
    label.rotation.x = -Math.PI / 2;
    label.position.set(0, 0.281, -0.06);
    group.add(cap, label);
    group.position.x = x;

    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(x, -0.29, 0.05);
    scene.add(group, shadow);
    disposables.push(bodyMat, tex, legendMat, shadowMat);
    return { group, shadowMat };
  }

  const w = makeKey(-0.56, 0xf7f8fa, "W", "#000c1f");
  const z = makeKey(0.56, 0x0070b4, "Z", "#ffffff");

  let frame = 0;
  let last = 0;
  function step(now: number) {
    const dt = Math.min(0.032, (now - (last || now)) / 1000 || 0.016);
    last = now;
    let moving = false;
    for (const [key, s] of Object.entries(springs)) {
      // Stiff, slightly underdamped: a key snaps back with a small overshoot
      const a = (s.target - s.y) * 420 - s.v * 22;
      s.v += a * dt;
      s.y += s.v * dt;
      if (Math.abs(s.v) > 1e-3 || Math.abs(s.target - s.y) > 1e-3) moving = true;
      const k = key === "w" ? w : z;
      k.group.position.y = s.y;
      k.shadowMat.opacity = 1 - Math.max(0, s.y) * 1.6;
    }
    renderer.render(scene, camera);
    frame = moving ? requestAnimationFrame(step) : 0;
    if (!moving) last = 0;
  }
  kick = () => {
    if (!frame) frame = requestAnimationFrame(step);
  };

  renderer.render(scene, camera);
  ready.value = true;

  // Dev helper to regenerate public/img/keycaps.png after changing the scene
  if (import.meta.dev) {
    (window as any).__keycapsSnapshot = () => {
      renderer.render(scene, camera);
      return el.toDataURL("image/png");
    };
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) {
    setTimeout(pop, 900);
    popTimer = setInterval(pop, 4200);
  } else {
    kick = () => {};
  }

  cleanup = () => {
    cancelAnimationFrame(frame);
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
  };
});

onBeforeUnmount(() => {
  clearInterval(popTimer);
  clearTimeout(releaseTimer);
  cleanup();
});
</script>

<style scoped>
.keycaps {
  position: relative;
  display: inline-block;
  width: 92px;
  height: 52px;
}
.keycaps__still,
.keycaps__canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 92px;
  height: 52px;
}
.keycaps__canvas {
  visibility: hidden;
}
.keycaps__canvas.is-ready {
  visibility: visible;
}
.keycaps__still.is-hidden {
  visibility: hidden;
}
</style>
