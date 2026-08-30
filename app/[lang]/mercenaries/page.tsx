import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  Badge,
  BulletList,
  Callout,
  Card,
  Container,
  DataTable,
  PageHeader,
  ProsCons,
  Section,
} from "@/components/ui";
import { ConfidenceNote, ItemRefLink } from "@/components/game";
import { getMercenaries } from "@/lib/registry";
import { alternatesFor, dictionaryFor, fmt, isLocale } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(
  props: PageProps<"/[lang]/mercenaries">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();
  const t = dictionaryFor(lang);
  return {
    title: t.mercenaries.title,
    description: t.mercenaries.description,
    alternates: alternatesFor(lang, "/mercenaries"),
  };
}

export default async function MercenariesPage() {
  const { locale, t } = await getI18n();
  const mercs = getMercenaries(locale);

  const [hireA, hireB] = t.mercenaries.hireWarningBodyA.split("{strong}");
  const [hireC, hireD] = t.mercenaries.hireWarningBodyB.split("{strong}");

  const tierLabel = (tier: string) =>
    tier === "budget"
      ? t.mercenaries.tierBudget
      : tier === "mid"
        ? t.mercenaries.tierMid
        : t.mercenaries.tierEndgame;

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>{t.nav.reference}</span>}
        title={t.mercenaries.title}
        description={t.mercenaries.description}
      />

      <div className="mt-8 space-y-10">
        <Callout variant="warning" title={t.mercenaries.hireWarningTitle}>
          <p>
            {hireA}
            <strong>{t.mercenaries.hireWarningStrong}</strong>
            {hireB}
          </p>
          <p className="mt-2">
            {hireC}
            <strong>{t.mercenaries.hireWarningStrongB}</strong>
            {hireD}
          </p>
        </Callout>

        <Section title={t.mercenaries.whichOne} description={t.mercenaries.whichOneDescription}>
          <DataTable
            headers={[
              t.mercenaries.colMercenary,
              t.mercenaries.colGivesYou,
              t.mercenaries.colUses,
              t.mercenaries.colVerdict,
            ]}
            rows={mercs.map((merc) => [
              merc.name,
              merc.slug === "act-2-desert-mercenary"
                ? merc.abilities[0]?.name ?? "—"
                : "—",
              merc.weaponTypes.join(", "),
              merc.bestFor,
            ])}
          />
        </Section>

        <Section title={t.mercenaries.twoItemsTitle}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <h3 className="font-display text-base text-ink">
                <ItemRefLink refItem={{ kind: "runeword", slug: "insight" }} />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                {mercs
                  .find((m) => m.slug === "act-2-desert-mercenary")
                  ?.gear.find((g) => g.tier === "budget" && g.slot === "weapon")?.why}
              </p>
            </Card>
            <Card>
              <h3 className="font-display text-base text-ink">
                <ItemRefLink refItem={{ kind: "runeword", slug: "treachery" }} />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                {mercs
                  .find((m) => m.slug === "act-2-desert-mercenary")
                  ?.gear.find((g) => g.tier === "budget" && g.slot === "body")?.why}
              </p>
            </Card>
          </div>
        </Section>

        <div className="space-y-8">
          {mercs.map((merc) => (
            <section
              key={merc.slug}
              id={merc.slug}
              className="scroll-mt-24 border-t border-border pt-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-2xl text-ink">{merc.name}</h2>
                <Badge tone="outline">{fmt(t.mercenaries.actBadge, { act: merc.act })}</Badge>
                <ConfidenceNote confidence={merc.confidence} />
              </div>
              <p className="mt-2 max-w-3xl text-base leading-relaxed text-pretty text-ink-muted">
                {merc.summary}
              </p>

              <Card className="mt-4">
                <h3 className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                  {t.mercenaries.whenToHire}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {merc.hireAdvice}
                </p>
              </Card>

              <div className="mt-4">
                <ProsCons
                  pros={merc.strengths}
                  cons={merc.weaknesses}
                  prosLabel={t.common.strengths}
                  consLabel={t.common.weaknesses}
                />
              </div>

              <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold text-ink">
                  {t.mercenaries.aurasAbilities}
                </h3>
                <DataTable
                  headers={[
                    t.mercenaries.colAbility,
                    t.mercenaries.colDifficulty,
                    t.mercenaries.colEffect,
                  ]}
                  rows={merc.abilities.map((a) => [
                    a.name,
                    <span key="d" className="text-xs">
                      {a.difficulty
                        ? t.difficulty[a.difficulty]
                        : t.mercenaries.anyDifficulty}
                    </span>,
                    a.description,
                  ])}
                />
              </div>

              <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold text-ink">{t.mercenaries.gear}</h3>
                <div className="space-y-3">
                  {merc.gear.map((g, i) => (
                    <div key={i} className="rounded-lg border border-border bg-surface p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs tracking-wide text-ink-subtle uppercase">
                          {g.slot === "helm"
                            ? t.gearSlots.helm
                            : g.slot === "weapon"
                              ? t.gearSlots.weapon
                              : t.gearSlots.body}
                        </span>
                        <Badge tone={g.tier === "endgame" ? "ember" : "outline"}>
                          {tierLabel(g.tier)}
                        </Badge>
                        {g.ref ? (
                          <ItemRefLink refItem={g.ref} />
                        ) : (
                          <span className="font-medium text-ink">{g.label}</span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-pretty text-ink-muted">
                        {g.why}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="mt-4">
                <h3 className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                  {t.mercenaries.keepingAlive}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-pretty text-ink-muted">
                  {merc.survivability}
                </p>
              </Card>

              {merc.notes && merc.notes.length > 0 && (
                <div className="mt-4">
                  <BulletList items={merc.notes} />
                </div>
              )}

              <p className="mt-4">
                <span className="text-sm text-ink-subtle">{t.mercenaries.bestFor} </span>
                <span className="text-sm text-ink-muted">{merc.bestFor}</span>
              </p>
            </section>
          ))}
        </div>
      </div>
    </Container>
  );
}
