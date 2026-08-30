import type { ItemRef, ItemQuality, Slug } from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { runes } from "@/content/runes/runes";
import { runewords } from "@/content/runewords/runewords";
import { uniques } from "@/content/items/uniques";
import { OVERLAYS } from "./overlays";

/**
 * Turning an `ItemRef` into something renderable.
 *
 * Every cross-reference in the site flows through here, which is what keeps the
 * "Spirit is described once" promise: a build says `{ kind: 'runeword', slug:
 * 'spirit' }` and the UI gets the name, the locale-correct URL, the rarity
 * colour and a one-line summary without the build author writing any of them.
 *
 * Names are invariant — "Spirit" is "Spirit" in both languages — so only the
 * summary (used as the link tooltip) and the href vary by locale.
 */

export interface ResolvedRef {
  kind: ItemRef["kind"];
  slug: Slug;
  name: string;
  href: string;
  summary?: string;
  /** Drives the item-rarity colour, matching D2's conventions. */
  quality: ItemQuality | "rune";
  /** False when the ref points at something not yet in the catalogue. */
  found: boolean;
}

const runeMap = new Map(runes.map((r) => [r.slug, r]));
const runewordMap = new Map(runewords.map((r) => [r.slug, r]));
const uniqueMap = new Map(uniques.map((u) => [u.slug, u]));

function titleCaseFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** The localized one-line summary for a ref, used as the link title. */
function summaryFor(
  locale: Locale,
  kind: ItemRef["kind"],
  slug: Slug,
  fallback: string | undefined,
): string | undefined {
  if (locale === "en-us") return fallback;
  switch (kind) {
    case "rune":
      return OVERLAYS.runes[locale]?.[slug]?.summary ?? fallback;
    case "runeword":
      return OVERLAYS.runewords[locale]?.[slug]?.summary ?? fallback;
    case "unique":
    case "set-item":
      return OVERLAYS.items[locale]?.[slug]?.summary ?? fallback;
    default:
      return fallback;
  }
}

export function resolveRef(locale: Locale, ref: ItemRef): ResolvedRef {
  const r = routes(locale);

  switch (ref.kind) {
    case "rune": {
      const rune = runeMap.get(ref.slug);
      return {
        kind: ref.kind,
        slug: ref.slug,
        name: rune ? rune.name : titleCaseFromSlug(ref.slug),
        href: r.rune(ref.slug),
        summary: summaryFor(locale, ref.kind, ref.slug, rune?.summary),
        quality: "rune",
        found: Boolean(rune),
      };
    }
    case "runeword": {
      const rw = runewordMap.get(ref.slug);
      return {
        kind: ref.kind,
        slug: ref.slug,
        name: rw?.name ?? titleCaseFromSlug(ref.slug),
        href: r.runeword(ref.slug),
        summary: summaryFor(locale, ref.kind, ref.slug, rw?.summary),
        quality: "runeword",
        found: Boolean(rw),
      };
    }
    case "unique":
    case "set-item": {
      const item = uniqueMap.get(ref.slug);
      return {
        kind: ref.kind,
        slug: ref.slug,
        name: item?.name ?? titleCaseFromSlug(ref.slug),
        href: r.item(ref.slug),
        summary: summaryFor(locale, ref.kind, ref.slug, item?.summary),
        quality: item?.quality ?? (ref.kind === "set-item" ? "set" : "unique"),
        found: Boolean(item),
      };
    }
    case "set":
      return {
        kind: ref.kind,
        slug: ref.slug,
        name: titleCaseFromSlug(ref.slug),
        href: `${r.items()}/sets/${ref.slug}`,
        quality: "set",
        found: false,
      };
    case "base":
      return {
        kind: ref.kind,
        slug: ref.slug,
        name: titleCaseFromSlug(ref.slug),
        href: `${r.items()}/bases/${ref.slug}`,
        quality: "normal",
        found: false,
      };
    case "charm":
      return {
        kind: ref.kind,
        slug: ref.slug,
        name: titleCaseFromSlug(ref.slug),
        href: `${r.items()}/charms/${ref.slug}`,
        quality: "unique",
        found: false,
      };
  }
}

/**
 * Validates every reference in the content graph.
 *
 * Called by `npm run check:content`. A build page pointing at a runeword that
 * does not exist is a broken link the type system cannot catch — slugs are
 * strings — so it gets caught here instead.
 */
export function findDanglingRefs(refs: ItemRef[]): ItemRef[] {
  return refs.filter((ref) => {
    switch (ref.kind) {
      case "rune":
        return !runeMap.has(ref.slug);
      case "runeword":
        return !runewordMap.has(ref.slug);
      case "unique":
      case "set-item":
        return !uniqueMap.has(ref.slug);
      // Categories without dedicated pages render as plain labels, so a
      // missing entry is not an error.
      default:
        return false;
    }
  });
}
