import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site-url";
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
 * Priorities reflect what the site is *for*: the progression content (builds,
 * leveling, classes) ranks above the reference tables, because a reader
 * arriving from a search engine is almost always trying to answer "what should
 * I do next" rather than look up a single stat line.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  ) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  });

  return [
    entry("", 1, "weekly"),

    // Progression — the reason the site exists.
    entry("/builds", 0.9, "weekly"),
    ...getBuilds().map((b) => entry(`/builds/${b.classSlug}/${b.slug}`, 0.9)),
    entry("/leveling", 0.9, "weekly"),
    ...getJourneys().map((j) => entry(`/leveling/${j.classSlug}`, 0.9)),
    entry("/classes", 0.8, "weekly"),
    ...getClasses().map((c) => entry(`/classes/${c.slug}`, 0.8)),
    entry("/farming", 0.8, "weekly"),
    ...getFarmingAreas().map((a) => entry(`/farming/${a.slug}`, 0.7)),

    // Reference.
    entry("/runewords", 0.8, "weekly"),
    ...getRunewords().map((r) => entry(`/runewords/${r.slug}`, 0.7)),
    entry("/items", 0.7, "weekly"),
    ...getUniques().map((i) => entry(`/items/${i.slug}`, 0.6)),
    entry("/runes", 0.7),
    ...getRunes().map((r) => entry(`/runes/${r.slug}`, 0.5)),
    entry("/mechanics", 0.7, "weekly"),
    ...getMechanics().map((m) => entry(`/mechanics/${m.slug}`, 0.7)),
    entry("/breakpoints", 0.7),
    entry("/mercenaries", 0.7),
    entry("/about/sources", 0.4, "yearly"),
  ];
}
