// Resizing Hygraph images lives in composables/useThumb.ts (it needs @nuxt/image).

export function initials(name: string | undefined | null): string {
  if (!name) return "";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
