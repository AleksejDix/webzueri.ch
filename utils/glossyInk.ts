// The title's ink: glossy and solid, like a fresh line from a brush pen, in
// the colours of Apple's "hello" running along the line. The stroke is shaded
// as a tube lit from the top left, so it gets a fine white highlight along one
// side, and while it is written the pen head is a little fuller, as in
// William Candillon's "Drawn Together" Redraw example.
//
// These run on the GPU: the "use gpu" bodies are compiled to WGSL by
// unplugin-typegpu (nuxt.config.ts), so they may only use Redraw's and
// TypeGPU's shader functions.
import {
  Color,
  createColor,
  createStrokeWidth,
  interpolate,
  interpolateColors,
  oklabToSrgb,
  profileNormal,
  tubeProfile,
} from "redraw";
import { d, std } from "typegpu";

// `pathStart` and `pathEnd` are where the drawn part starts and ends on the
// whole line (0 to 1). Redraw's ctx.t runs over the drawn part only, so it is
// mapped back; a dot passes its place on the line as both.

// A 22 unit pen whose head is a third fuller while writing, settling as the
// last tenth of the line is written
export const InkWidth = createStrokeWidth(
  (ctx, _tctx, props) => {
    "use gpu";
    const width = d.f32(22);
    const head = interpolate(props.progress, [0.9, 1.0], [width * 1.35, width]);
    const t = ctx.t * props.pathEnd;
    return interpolate(t, [props.progress - 0.06, props.progress], [width, head]);
  },
  { progress: 1, pathEnd: 1 },
  { maxStrokeWidth: 30 },
);

export const GlossyInk = createColor(
  (ctx, _tctx, paint, props) => {
    "use gpu";
    // From cyan through violet and pink to orange and green, mixed in oklab
    const colors = [
      Color("#2bb7e8", "oklab"),
      Color("#4f7bf0", "oklab"),
      Color("#8f52e8", "oklab"),
      Color("#e14f9a", "oklab"),
      Color("#ff6347", "oklab"),
      Color("#ffb22e", "oklab"),
      Color("#3fcf7a", "oklab"),
    ];
    const t = std.saturate(props.pathStart + ctx.t * (props.pathEnd - props.pathStart));
    const rgb = oklabToSrgb(interpolateColors(t, colors).xyz);

    const n = profileNormal(ctx.grad, tubeProfile(ctx.sdf, paint.strokeWidth));
    // Light from the top left (y points down), a little towards the viewer
    const light = std.normalize(d.vec3f(-0.45, -0.75, 0.5));
    const half = std.normalize(light.add(d.vec3f(0, 0, 1)));
    const facing = std.saturate(std.dot(n, half));
    const diffuse = std.saturate(std.dot(n, light));

    // The ink deepens away from the light, with a sharp highlight and a soft
    // sheen around it
    const ink = rgb.mul(0.6 + 0.5 * diffuse);
    const shine = std.pow(facing, 70) * 0.85 + std.pow(facing, 12) * 0.1;
    const color = ink.add(d.vec3f(shine));

    const inside = 1 - std.smoothstep(-1, 1, ctx.sdf);
    return d.vec4f(std.min(color, d.vec3f(1)), inside);
  },
  { pathStart: 0, pathEnd: 1 },
);
