import type { Locale } from "@/lib/i18n/config";
import type { Slug } from "@/lib/types";

/**
 * Every internal URL in the site is built here.
 *
 * Before internationalisation these were string literals scattered across
 * pages and components. With a locale prefix on every route that would have
 * been dozens of places to get wrong, and no way to verify them — so all of
 * them now go through one typed builder.
 *
 * The practical payoff: the "locale-less path" for any route is recoverable by
 * stripping the first segment, which is what lets the language switcher land
 * the reader on the *same page* in the other language rather than dumping them
 * on the home page.
 */
export function routes(locale: Locale) {
  const base = `/${locale}`;
  return {
    home: () => base,

    classes: () => `${base}/classes`,
    class: (slug: Slug) => `${base}/classes/${slug}`,
    classSkills: (slug: Slug) => `${base}/classes/${slug}#skills`,

    builds: () => `${base}/builds`,
    build: (classSlug: Slug, slug: Slug) => `${base}/builds/${classSlug}/${slug}`,

    leveling: () => `${base}/leveling`,
    levelingFor: (classSlug: Slug) => `${base}/leveling/${classSlug}`,

    farming: () => `${base}/farming`,
    farmingArea: (slug: Slug) => `${base}/farming/${slug}`,

    runewords: () => `${base}/runewords`,
    runeword: (slug: Slug) => `${base}/runewords/${slug}`,

    runes: () => `${base}/runes`,
    rune: (slug: Slug) => `${base}/runes/${slug}`,

    items: () => `${base}/items`,
    item: (slug: Slug) => `${base}/items/${slug}`,

    breakpoints: () => `${base}/breakpoints`,
    breakpointStat: (stat: string) => `${base}/breakpoints#${stat}`,

    mercenaries: () => `${base}/mercenaries`,
    mercenary: (slug: Slug) => `${base}/mercenaries#${slug}`,

    mechanics: () => `${base}/mechanics`,
    mechanic: (slug: Slug) => `${base}/mechanics/${slug}`,

    sources: () => `${base}/about/sources`,

    searchIndex: () => `${base}/search-index.json`,
  };
}

export type Routes = ReturnType<typeof routes>;
