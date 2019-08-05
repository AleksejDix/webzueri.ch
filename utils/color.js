// @ts-check
import hsluv from 'hsluv'

export const hsla = (hue, saturation, light, a = 1) => {
  const floatToInt = f => Math.round(f * 255)
  const [h, s, l] = hsluv.hsluvToRgb([hue, saturation, light])
  const colorString = `rgba(${floatToInt(h)}, ${floatToInt(s)}, ${floatToInt(l)}, ${a})`
  return colorString
}

export default hsla
