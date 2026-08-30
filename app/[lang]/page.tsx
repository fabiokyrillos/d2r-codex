import Link from "next/link";

import { Badge, Container, LinkCard, cn } from "@/components/ui";
import { getBuilds, getClasses, getFarmingAreas, getRunewords } from "@/lib/registry";
import { GAME_VERSION } from "@/lib/game-version";
import { fmt } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { progressionTiers, tierOrder } from "@/lib/labels";
import { routes } from "@/lib/routes";

export default async function Home() {
  const { locale, t } = await getI18n();
  const r = routes(locale);
  const tiers = progressionTiers(t);

  const classes = getClasses(locale);
  const builds = getBuilds(locale).filter((b) => b.complete);
  const runewords = getRunewords(locale);
  const areas = getFarmingAreas(locale);

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      <Container size="wide" className="pt-16 pb-14 sm:pt-24">
        <div className="max-w-3xl">
          <Badge tone="ember">
            {fmt(t.home.badge, {
              patch: GAME_VERSION.patch,
              season: GAME_VERSION.season,
            })}
          </Badge>

          <h1 className="mt-5 font-display text-4xl leading-[1.1] text-balance text-ink sm:text-5xl lg:text-6xl">
            {t.home.headlineA}
            <span className="text-ember-bright"> {t.home.headlineHighlight}</span>.
            <br />
            {t.home.headlineB}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-ink-muted">
            {t.home.lede.split("{strong}").map((part, i, all) => (
              <span key={i}>
                {part}
                {i < all.length - 1 && (
                  <strong className="text-ink">{t.home.ledeStrong}</strong>
                )}
              </span>
            ))}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={r.levelingFor("sorceress")}
              className="rounded-md bg-ember px-5 py-2.5 text-sm font-semibold text-abyss transition-colors hover:bg-ember-bright"
            >
              {t.home.ctaStart}
            </Link>
            <Link
              href={r.builds()}
              className="rounded-md border border-border-strong px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink-subtle hover:bg-surface-raised"
            >
              {t.home.ctaBuilds}
            </Link>
          </div>
        </div>
      </Container>

      {/* ------------------------------------------------------------------ */}
      <Container size="wide" className="pb-16">
        <h2 className="text-xs font-semibold tracking-widest text-ink-subtle uppercase">
          {t.home.tiersEyebrow}
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-muted">
          {t.home.tiersLede}
        </p>

        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tierOrder.map((tier, i) => {
            const meta = tiers[tier];
            return (
              <li
                key={tier}
                className="rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-ember">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-base text-ink">{meta.label}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                  &ldquo;{meta.question}&rdquo;
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ink-subtle">
                  {meta.context}
                </p>
              </li>
            );
          })}
        </ol>
      </Container>

      {/* ------------------------------------------------------------------ */}
      <Container size="wide" className="pb-16">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl text-ink">{t.home.classesTitle}</h2>
          <Link href={r.classes()} className="text-sm text-ink-muted hover:text-ink">
            {t.home.classesAll}
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {classes.map((cls) => {
            const buildCount = builds.filter((b) => b.classSlug === cls.slug).length;
            return (
              <LinkCard key={cls.slug} href={r.class(cls.slug)}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg text-ink transition-colors group-hover:text-ember-bright">
                    {cls.name}
                  </h3>
                  {cls.requiresDlc && <Badge tone="ember">{t.home.dlcBadge}</Badge>}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                  {cls.summary}
                </p>
                <p className="mt-3 text-xs text-ink-subtle">
                  {buildCount > 0
                    ? fmt(
                        buildCount === 1
                          ? t.home.buildsDocumented
                          : t.home.buildsDocumentedPlural,
                        { count: buildCount },
                      )
                    : t.home.overviewAvailable}
                </p>
              </LinkCard>
            );
          })}
        </div>
      </Container>

      {/* ------------------------------------------------------------------ */}
      <Container size="wide" className="pb-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <FeatureBlock
            href={r.levelingFor("sorceress")}
            eyebrow={t.home.featureLevelingEyebrow}
            title={t.home.featureLevelingTitle}
            body={t.home.featureLevelingBody}
          />
          <FeatureBlock
            href={r.farming()}
            eyebrow={t.home.featureFarmingEyebrow}
            title={t.home.featureFarmingTitle}
            body={fmt(t.home.featureFarmingBody, {
              alvl85: areas.filter((a) => a.hellLevel85).length,
              total: areas.length,
            })}
          />
          <FeatureBlock
            href={r.runewords()}
            eyebrow={t.home.featureRunewordsEyebrow}
            title={t.home.featureRunewordsTitle}
            body={fmt(t.home.featureRunewordsBody, { count: runewords.length })}
          />
        </div>
      </Container>

      {/* ------------------------------------------------------------------ */}
      <Container size="wide" className="pb-20">
        <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-display text-xl text-ink">{t.home.accuracyTitle}</h2>
          <div className="mt-3 grid gap-6 text-sm leading-relaxed text-ink-muted sm:grid-cols-2">
            <p className="text-pretty">{t.home.accuracyBodyA}</p>
            <p className="text-pretty">
              {t.home.accuracyBodyB
                .split(/\{strong\}|\{expansion\}/)
                .map((part, i, all) => (
                  <span key={i}>
                    {part}
                    {i === 0 && <strong className="text-ink">{t.home.accuracyEight}</strong>}
                    {i === 1 && <em>{GAME_VERSION.expansion}</em>}
                    {i === all.length - 1 && (
                      <>
                        {" "}
                        <Link
                          href={r.sources()}
                          className="text-ember hover:text-ember-bright"
                        >
                          {t.home.accuracyLink}
                        </Link>
                      </>
                    )}
                  </span>
                ))}
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}

function FeatureBlock({
  href,
  eyebrow,
  title,
  body,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <Link href={href} className={cn("group block")}>
      <p className="text-xs font-semibold tracking-widest text-ember uppercase">{eyebrow}</p>
      <h3 className="mt-2 font-display text-xl text-ink transition-colors group-hover:text-ember-bright">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">{body}</p>
    </Link>
  );
}
