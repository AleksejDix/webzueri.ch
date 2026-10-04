// A small stand-in for Redraw's tapered brush (redraw.dev) on a plain 2D canvas:
// strokes are sampled by arc length, coloured by a gradient pinned along the
// whole title in oklab, and drawn with a sine taper over the written part, so
// each line starts thin, swells and thins out again like a real pen.

type Point = { x: number; y: number };

export type InkStroke = {
  points: Point[];
  // Arc length from the start of the stroke to each point
  lengths: number[];
  // Colour of the segment ending at each point
  colors: string[];
  length: number;
};

// Sampling distance in path units; small next to the pen so joins stay smooth
const STEP = 2.5;
// Width at the very ends, as a share of the full pen
const TIP = 0.18;
// How far from each end the pen takes to reach full width
const RAMP = 90;

export function sampleInk(paths: string[], ink: string[]): InkStroke[] {
  const strokes = paths.map(samplePath);
  const total = strokes.reduce((sum, s) => sum + s.length, 0);
  const stops = ink.map(toOklab);

  // The gradient runs once through the whole title, not once per stroke
  let offset = 0;
  for (const s of strokes) {
    s.colors = s.lengths.map((l) => mixOklab(stops, (offset + l) / total));
    offset += s.length;
  }
  // A dot takes the colour of the letter it sits on, not its place in the writing order
  for (const dot of strokes.filter((s) => s.length < STEP)) {
    let best = Infinity;
    for (const s of strokes) {
      if (s === dot) continue;
      s.points.forEach((p, i) => {
        const d = Math.hypot(p.x - dot.points[0].x, p.y - dot.points[0].y);
        if (d < best) [best, dot.colors[0]] = [d, s.colors[i]];
      });
    }
  }
  return strokes;
}

// Draws each stroke up to the given arc length
export function drawInk(ctx: CanvasRenderingContext2D, strokes: InkStroke[], drawn: number[], pen: number) {
  ctx.lineCap = "round";
  strokes.forEach((s, i) => {
    const upto = Math.min(drawn[i] ?? 0, s.length);
    if (upto <= 0) return;

    // A stroke shorter than a sample is a dot, a touch smaller than the full pen
    if (s.length < STEP) {
      ctx.fillStyle = s.colors[0];
      ctx.beginPath();
      ctx.arc(s.points[0].x, s.points[0].y, pen * 0.4, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    for (let j = 1; j < s.points.length && s.lengths[j - 1] < upto; j++) {
      const a = s.points[j - 1];
      let b = s.points[j];
      let end = s.lengths[j];
      // Stop exactly where the pen is, between two samples
      if (end > upto) {
        const k = (upto - s.lengths[j - 1]) / (end - s.lengths[j - 1]);
        b = { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
        end = upto;
      }
      const mid = (s.lengths[j - 1] + end) / 2;
      const ramp = Math.min(1, Math.min(mid, upto - mid) / RAMP);
      ctx.lineWidth = pen * (TIP + (1 - TIP) * Math.sin((Math.PI / 2) * ramp));
      ctx.strokeStyle = s.colors[j];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  });
}

// Absolute M and C commands only, which is all the handwriting uses
function samplePath(d: string): InkStroke {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+/g) ?? [];
  const points: Point[] = [];
  const lengths: number[] = [];
  let cur: Point = { x: 0, y: 0 };
  let length = 0;
  let cmd = "";

  const push = (p: Point) => {
    if (points.length) length += Math.hypot(p.x - cur.x, p.y - cur.y);
    points.push(p);
    lengths.push(length);
    cur = p;
  };

  for (let i = 0; i < tokens.length; ) {
    if (/[A-Za-z]/.test(tokens[i])) cmd = tokens[i++];
    const n = (k: number) => Number(tokens[i + k]);
    if (cmd === "M") {
      push({ x: n(0), y: n(1) });
      i += 2;
    } else if (cmd === "C") {
      const p0 = cur;
      const [p1, p2, p3] = [0, 2, 4].map((k) => ({ x: n(k), y: n(k + 1) }));
      const steps = Math.max(1, Math.ceil(roughLength(p0, p1, p2, p3) / STEP));
      for (let k = 1; k <= steps; k++) push(cubic(p0, p1, p2, p3, k / steps));
      i += 6;
    } else {
      throw new Error(`Unsupported path command "${cmd}"`);
    }
  }
  return { points, lengths, colors: [], length };
}

function cubic(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const u = 1 - t;
  const [a, b, c, d] = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return { x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y };
}

function roughLength(p0: Point, p1: Point, p2: Point, p3: Point) {
  let len = 0;
  let prev = p0;
  for (let k = 1; k <= 16; k++) {
    const p = cubic(p0, p1, p2, p3, k / 16);
    len += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  }
  return len;
}

// Colours mix in oklab so the gradient stays bright between hues
type Lab = [number, number, number];

function toOklab(hex: string): Lab {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function mixOklab(stops: Lab[], t: number): string {
  const x = Math.min(Math.max(t, 0), 1) * (stops.length - 1);
  const i = Math.min(Math.floor(x), stops.length - 2);
  const k = x - i;
  const [L, A, B] = stops[i].map((v, j) => v + (stops[i + 1][j] - v) * k);

  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((c) => {
    const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
    return Math.round(Math.min(Math.max(v, 0), 1) * 255);
  });
  return `rgb(${rgb.join(" ")})`;
}
