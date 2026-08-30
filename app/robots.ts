import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The search index is a build artefact, not a page. Crawling it wastes
      // budget and puts a 42KB JSON blob in search results.
      disallow: ["/search-index.json"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
