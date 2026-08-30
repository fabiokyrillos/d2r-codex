import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site-url";
import { BCP47, LOCALES, type Locale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import {
  getBuilds,
  getClasses,
  getFarmingAreas,
  getJourneys,
  getMechanics,
  getRunes,
  getRunewords,
  getUniques,
} from "@/lib/registry";

/**
 * The sitemap is generated from the registry rather than maintained by hand,
 * so it can never drift out of sync with the routes that actually exist.
 *
 * Every URL appears once per locale, and each entry carries `alternates.
 * languages` so crawlers see the en-US and pt-BR versions as translations of
 * one another rather than as duplicate content. That mapping is what makes
 * hreflang work at scale — declaring it in the sitemap covers every page
 * without adding markup to each one.
 *
 * The sitemap itself is deliberately *not* locale-prefixed: it is a single
 * document describing the whole site, and `robots.txt` can only point at one.
 *
 * Priorities reflect what the site is *for*: the progression content (builds,
 * leveling, classes) ranks above the reference tables, because a reader
 * arriving from a search engine is almost always trying to answer "what should
 * I do next" rather than look up a single stat line.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  /**
   * `pathFor` receives a locale and returns that locale's URL for the same
   * logical page. Because content slugs are identical across locales by
   * design, this is a pure prefix swap — the same property the language
   * switcher relies on.
   */
  const add = (
    pathFor: (locale: Locale) => string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  ) => {
    const languages = Object.fromEntries(
      LOCALES.map((l) => [BCP47[l], `${SITE_URL}${pathFor(l)}`]),
    );

    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}${pathFor(locale)}`,
        changeFrequency,
        priority,
        alternates: { languages },
      });
    }
  };

  add((l) => routes(l).home(), 1, "weekly");

  // Progression — the reason the site exists.
  add((l) => routes(l).builds(), 0.9, "weekly");
  for (const b of getBuilds("en-us")) {
    add((l) => routes(l).build(b.classSlug, b.slug), 0.9);
  }

  add((l) => routes(l).leveling(), 0.9, "weekly");
  for (const j of getJourneys("en-us")) {
    add((l) => routes(l).levelingFor(j.classSlug), 0.9);
  }

  add((l) => routes(l).classes(), 0.8, "weekly");
  for (const c of getClasses("en-us")) {
    add((l) => routes(l).class(c.slug), 0.8);
  }

  add((l) => routes(l).farming(), 0.8, "weekly");
  for (const a of getFarmingAreas("en-us")) {
    add((l) => routes(l).farmingArea(a.slug), 0.7);
  }

  // Reference.
  add((l) => routes(l).runewords(), 0.8, "weekly");
  for (const rw of getRunewords("en-us")) {
    add((l) => routes(l).runeword(rw.slug), 0.7);
  }

  add((l) => routes(l).items(), 0.7, "weekly");
  for (const i of getUniques("en-us")) {
    add((l) => routes(l).item(i.slug), 0.6);
  }

  add((l) => routes(l).runes(), 0.7);
  for (const r of getRunes("en-us")) {
    add((l) => routes(l).rune(r.slug), 0.5);
  }

  add((l) => routes(l).mechanics(), 0.7, "weekly");
  for (const m of getMechanics("en-us")) {
    add((l) => routes(l).mechanic(m.slug), 0.7);
  }

  add((l) => routes(l).breakpoints(), 0.7);
  add((l) => routes(l).mercenaries(), 0.7);
  add((l) => routes(l).sources(), 0.4, "yearly");

  return entries;
}
