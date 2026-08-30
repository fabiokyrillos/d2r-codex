import type { Locale } from "@/lib/i18n/config";
import type { Overlay } from "@/lib/types/copy";
import type { Slug } from "@/lib/types";

/**
 * Merges an invariant record with its localized copy.
 *
 * en-US is the editorial source and its copy is colocated with the data, so
 * `localize` is the identity for en-US. Every other locale supplies an overlay
 * keyed by slug; missing entries fall back to the source rather than rendering
 * an empty page, and `npm run check:content` fails the build for any slug
 * without an overlay so the fallback never silently ships.
 */
export function localize<T extends { slug: Slug }, C extends object>(
  items: readonly T[],
  locale: Locale,
  overlays: Partial<Record<Locale, Overlay<C>>>,
  merge?: (base: T, copy: C) => T,
): T[] {
  const overlay = overlays[locale];
  if (!overlay) return [...items];

  return items.map((item) => {
    const copy = overlay[item.slug];
    if (!copy) return item;
    return merge ? merge(item, copy) : ({ ...item, ...copy } as T);
  });
}

/** Which slugs in `items` have no entry in `overlay`. Used by the validator. */
export function missingOverlaySlugs<T extends { slug: Slug }>(
  items: readonly T[],
  overlay: Overlay<unknown> | undefined,
): Slug[] {
  if (!overlay) return items.map((i) => i.slug);
  return items.filter((i) => !(i.slug in overlay)).map((i) => i.slug);
}

/** Slugs present in the overlay that no longer exist in the data. */
export function orphanOverlaySlugs<T extends { slug: Slug }>(
  items: readonly T[],
  overlay: Overlay<unknown> | undefined,
): Slug[] {
  if (!overlay) return [];
  const known = new Set(items.map((i) => i.slug));
  return Object.keys(overlay).filter((slug) => !known.has(slug));
}
