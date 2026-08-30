import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { LOCALES } from "@/lib/i18n/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The search indexes are build artefacts, not pages. Crawling them wastes
      // budget and puts a 40KB JSON blob in search results.
      disallow: LOCALES.map((locale) => `/${locale}/search-index.json`),
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
