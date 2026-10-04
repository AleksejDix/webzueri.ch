// The title's ink: a line of light in the colours of Apple's "hello" running
// along it: flat, vivid colour that lets a soft glow of its own colour onto
// the page. While it is written the pen head is a little fuller, as in William
// Candillon's "Drawn Together" Redraw example.
//
// These run on the GPU: the "use gpu" bodies are compiled to WGSL by
// unplugin-typegpu (nuxt.config.ts), so they may only use Redraw's and
// TypeGPU's shader functions.
import { Color, createColor, createStrokeWidth, interpolate, interpolateColors, oklabToSrgb } from "redraw";
import { d, std } from "typegpu";

// `pathStart` and `pathEnd` are where the drawn piece starts and ends on the
// whole line (0 to 1). Redraw's ctx.t runs over the drawn piece only, so it is
// mapped back; a dot passes its place on the line as both.

// A 22 unit pen whose head is a third fuller while writing, settling as the
// last tenth of the line is written
export const InkWidth = createStrokeWidth(
  (ctx, _tctx, props) => {
    "use gpu";
    const width = d.f32(22);
    const head = interpolate(props.progress, [0.9, 1.0], [width * 1.35, width]);
    const t = props.pathStart + ctx.t * (props.pathEnd - props.pathStart);
    return interpolate(t, [props.progress - 0.06, props.progress], [width, head]);
  },
  { progress: 1, pathStart: 0, pathEnd: 1 },
  { maxStrokeWidth: 30 },
);

// From cyan through violet and pink to orange and green, mixed in oklab
const inkAt = (t: number) => {
  "use gpu";
  const colors = [
    Color("#2bb7e8", "oklab"),
    Color("#4f7bf0", "oklab"),
    Color("#8f52e8", "oklab"),
    Color("#e14f9a", "oklab"),
    Color("#ff6347", "oklab"),
    Color("#ffb22e", "oklab"),
    Color("#3fcf7a", "oklab"),
  ];
  return oklabToSrgb(interpolateColors(std.saturate(t), colors).xyz);
};

// The line itself, opaque
export const LightInk = createColor(
  (ctx, _tctx, _paint, props) => {
    "use gpu";
    const rgb = inkAt(props.pathStart + ctx.t * (props.pathEnd - props.pathStart));
    const inside = 1 - std.smoothstep(-1, 1, ctx.sdf);
    return d.vec4f(rgb, inside);
  },
  { pathStart: 0, pathEnd: 1 },
);

// Its glow, outside the line only, fading over about 25 units; drawn as its
// own pass under the line
export const LightGlow = createColor(
  (ctx, _tctx, _paint, props) => {
    "use gpu";
    const rgb = inkAt(props.pathStart + ctx.t * (props.pathEnd - props.pathStart));
    const outside = std.max(ctx.sdf, 0);
    const glow = 0.3 * std.exp(-outside * 0.12) * std.smoothstep(-1, 1, ctx.sdf);
    return d.vec4f(rgb, glow);
  },
  { pathStart: 0, pathEnd: 1 },
  // The glow reaches past the stroke; without this margin the tiles cut it off
  // in straight seams
  { maxCullDistance: 64 },
);
