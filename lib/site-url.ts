/**
 * The site's canonical base URL.
 *
 * Resolution order matters:
 *
 * 1. `NEXT_PUBLIC_SITE_URL` — set this once a custom domain is attached, so
 *    canonical URLs point at the real domain rather than the .vercel.app one.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` — the stable production domain. Used in
 *    preference to VERCEL_URL because VERCEL_URL changes on every deployment,
 *    which would make canonical tags and sitemap entries churn.
 * 3. `VERCEL_URL` — the per-deployment URL. Correct for preview deployments.
 * 4. localhost, for development.
 *
 * Vercel supplies these without the protocol, so it has to be added back.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionHost) return `https://${productionHost}`;

  const deploymentHost = process.env.VERCEL_URL;
  if (deploymentHost) return `https://${deploymentHost}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
