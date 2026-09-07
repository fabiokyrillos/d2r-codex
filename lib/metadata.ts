import type { Metadata } from "next";

import {
  alternatesFor,
  dictionaryFor,
  LOCALES,
  OG_LOCALE,
  type Locale,
} from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";

/**
 * Builds a page's full localized metadata: title, description, canonical +
 * hreflang, and a complete Open Graph block.
 *
 * This exists because Next *replaces* rather than merges `openGraph` between a
 * layout and its pages. A page that set only `openGraph.title` silently
 * dropped `og:locale`, `og:site_name`, `og:type` and `og:url` from the root
 * layout — and a page that set none at all inherited the *home page's* social
 * preview, so every index page shared one title and one URL.
 *
 * Routing every `generateMetadata` through one helper means a page cannot get
 * a partial Open Graph block by omission, which is the only way both bugs
 * happened.
 *
 * The same rule applies to `twitter`, and it was missed the first time: the
 * root layout declares one, no page replaced it, and every page therefore
 * advertised the *home page's* title and description to any consumer that
 * reads `twitter:*` in preference to `og:*`. That is worse than declaring
 * nothing — an absent `twitter:title` falls back to `og:title`, while a
 * present wrong one overrides it. So the block is rebuilt here from the same
 * two strings, and `card` is carried across unchanged because a shallow
 * replace would otherwise drop it.
 *
 * `path` is the locale-less remainder, e.g. `/runewords/spirit`.
 */
export function pageMetadata(
  locale: Locale,
  { path, title, description }: { path: string; title: string; description: string },
): Metadata {
  const alternates = alternatesFor(locale, path);
  return {
    title,
    description,
    alternates,
    openGraph: {
      type: "website",
      siteName: dictionaryFor(locale).meta.siteName,
      url: `${SITE_URL}${alternates.canonical}`,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
