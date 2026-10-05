/**
 * Resized image URLs for Hygraph assets (speaker photos, logos).
 *
 * Hygraph's own on-the-fly transformations answer 429 Too Many Requests when a
 * page asks for many at once (the speakers page loads ~190 photos), so we let
 * @nuxt/image fetch the original and resize it: IPX in dev, and at build time
 * for the static site on Cloudflare.
 */
export function useThumb() {
  const img = useImage();
  return (url: string | null | undefined, width: number, height = width) =>
    url ? img(url, { width, height, fit: "cover", format: "webp", quality: 75 }) : "";
}
