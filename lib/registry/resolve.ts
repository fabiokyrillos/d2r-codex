import type { ItemRef, ItemQuality, Slug } from "@/lib/types";
import { runes } from "@/content/runes/runes";
import { runewords } from "@/content/runewords/runewords";
import { uniques } from "@/content/items/uniques";

/**
 * Turning an `ItemRef` into something renderable.
 *
 * Every cross-reference in the site flows through here, which is what keeps the
 * "Spirit is described once" promise: a build says `{ kind: 'runeword', slug:
 * 'spirit' }` and the UI gets the name, the URL, the rarity colour and a
 * one-line summary without the build author writing any of them.
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

export function resolveRef(ref: ItemRef): ResolvedRef {
  switch (ref.kind) {
    case "rune": {
      const rune = runeMap.get(ref.slug);
      return {
        kind: ref.kind,
        slug: ref.slug,
        name: rune ? `${rune.name} Rune` : titleCaseFromSlug(ref.slug),
        href: `/runes/${ref.slug}`,
        summary: rune?.summary,
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
        href: `/runewords/${ref.slug}`,
        summary: rw?.summary,
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
        href: `/items/${ref.slug}`,
        summary: item?.summary,
        quality: item?.quality ?? (ref.kind === "set-item" ? "set" : "unique"),
        found: Boolean(item),
      };
    }
    case "set":
      return {
        kind: ref.kind,
        slug: ref.slug,
        name: titleCaseFromSlug(ref.slug),
        href: `/items/sets/${ref.slug}`,
        quality: "set",
        found: false,
      };
    case "base":
      return {
        kind: ref.kind,
        slug: ref.slug,
        name: titleCaseFromSlug(ref.slug),
        href: `/bases/${ref.slug}`,
        quality: "normal",
        found: false,
      };
    case "charm":
      return {
        kind: ref.kind,
        slug: ref.slug,
        name: titleCaseFromSlug(ref.slug),
        href: `/items/charms/${ref.slug}`,
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
      // Categories without dedicated pages yet render as plain labels, so a
      // missing entry is not an error.
      default:
        return false;
    }
  });
}
