import Link from "next/link";

import { Badge, Container, LinkCard, cn } from "@/components/ui";
import { TierCards } from "@/components/home/tier-cards";
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
            {/*
              The leveling index, not one class's journey. "Start a character"
              used to land on the Sorceress whoever pressed it, which is a
              wrong answer for seven of the eight classes; `/leveling` lists
              all eight and lets the reader say which one they are. The string
              never promised a class, so nothing about the copy changes.
            */}
            <Link
              href={r.leveling()}
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

        {/*
          Six cards that were six dead `<li>`. They described the six tiers,
          carried a border and a hover state, and went nowhere — a card that
          looks pressable and is not is worse than a plain paragraph.

          The whole card is the link now, through `LinkCard`, because a bordered
          box whose only target is a small label inside it is a worse affordance
          than the box itself. All six go to `/builds` bare: `?tier=` is
          forbidden by R-FILT-10 and R-BUILD-10, so which tier was chosen is
          carried by the preference `TierCards` writes rather than by the URL.

          Six links to one href with six different accessible names, inside one
          `<ol>` — written down here rather than discovered in an a11y review.
          The name of each is its tier, its question and its context, which is
          exactly what distinguishes them.
        */}
        <TierCards className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tierOrder.map((tier, i) => {
            const meta = tiers[tier];
            return (
              <li key={tier} data-tier={tier}>
                {/*
                  `h-full` only. Nothing here tries to trim `LinkCard`'s `p-5`
                  back to the `p-4` these boxes used to have: `cn()` is a plain
                  join, so two padding utilities of equal specificity are
                  decided by their order in the stylesheet rather than in the
                  attribute, and `p-4` would be a silent no-op. The card keeps
                  the padding every other card on this page has.
                */}
                <LinkCard href={r.builds()} className="h-full">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-ember">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-base text-ink transition-colors group-hover:text-ember-bright">
                      {meta.label}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                    &ldquo;{meta.question}&rdquo;
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-subtle">
                    {meta.context}
                  </p>
                </LinkCard>
              </li>
            );
          })}
        </TierCards>
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
          {/*
            The same wrong href as the CTA above, and the same fix. This block
            presents the *area* — "a walkthrough, level 1 to Hell" — and sent
            everyone to the Sorceress's copy of it.
          */}
          <FeatureBlock
            href={r.leveling()}
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
      {/*
        R-NAV-4's other half. The three blocks above are the three the home page
        has always had, and none of the five reference sections was among them:
        Runes, Items, Breakpoints, Mercenaries and Mechanics were reachable only
        from the header disclosure — which is not on screen — and from the
        footer. This block is the first place on the site that says they exist.

        Titles are the `nav.*` strings the header and footer already use, so a
        rename lands in one place. The bodies are new and deliberately short:
        each section's own `indexDescription` is about forty words of page-header
        copy and would turn a card into a paragraph.

        The footer's Reference column is left as it is. It lists six, this lists
        five, and the difference is on purpose — Runewords already has a feature
        block of its own two rows up, and repeating it here would be the third
        time the same page offers it.
      */}
      <Container size="wide" className="pb-16">
        <h2 className="font-display text-2xl text-ink">{t.nav.reference}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: r.runes(), title: t.nav.runes, body: t.home.refRunesBody },
            { href: r.items(), title: t.nav.items, body: t.home.refItemsBody },
            {
              href: r.breakpoints(),
              title: t.nav.breakpoints,
              body: t.home.refBreakpointsBody,
            },
            {
              href: r.mercenaries(),
              title: t.nav.mercenaries,
              body: t.home.refMercenariesBody,
            },
            { href: r.mechanics(), title: t.nav.mechanics, body: t.home.refMechanicsBody },
          ].map((card) => (
            <LinkCard key={card.href} href={card.href} className="h-full">
              <h3 className="font-display text-lg text-ink transition-colors group-hover:text-ember-bright">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                {card.body}
              </p>
            </LinkCard>
          ))}
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
