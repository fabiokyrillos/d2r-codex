import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  Badge,
  BulletList,
  Callout,
  Container,
  DataTable,
  PageHeader,
  Section,
} from "@/components/ui";
import { RichText } from "@/components/game";
import { getBreakpointTables } from "@/lib/registry";
import { dictionaryFor, fmt, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(
  props: PageProps<"/[lang]/breakpoints">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();
  const t = dictionaryFor(lang);
  return pageMetadata(lang, {
    path: "/breakpoints",
    title: t.breakpoints.title,
    description: t.breakpoints.description,
  });
}

export default async function BreakpointsPage() {
  const { locale, t } = await getI18n();
  const tables = getBreakpointTables(locale);

  const sections = [
    { stat: "fcr" as const, title: t.breakpoints.fcrTitle, description: t.breakpoints.fcrDescription },
    { stat: "fhr" as const, title: t.breakpoints.fhrTitle, description: t.breakpoints.fhrDescription },
    { stat: "fbr" as const, title: t.breakpoints.fbrTitle, description: t.breakpoints.fbrDescription },
  ];

  const [warnA, warnB] = t.breakpoints.warningBodyA.split("{nothing}");
  const iasParts = t.breakpoints.iasBodyA.split(/\{weaponSpeed\}|\{skill\}|\{class\}/);

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>{t.nav.reference}</span>}
        title={t.breakpoints.title}
        description={t.breakpoints.description}
        meta={<Badge tone="outline">{t.breakpoints.includesWarlock}</Badge>}
      />

      <div className="mt-8 space-y-10">
        <Callout variant="warning" title={t.breakpoints.warningTitle}>
          <p>
            {warnA}
            <strong>{t.breakpoints.warningNothing}</strong>
            {warnB}
          </p>
          <p className="mt-2">{t.breakpoints.warningBodyB}</p>
        </Callout>

        <Callout variant="info" title={t.breakpoints.multipleTablesTitle}>
          {t.breakpoints.multipleTablesBody}
        </Callout>

        {sections.map((section) => {
          const sectionTables = tables.filter((table) => table.stat === section.stat);
          if (sectionTables.length === 0) return null;

          return (
            <Section
              key={section.stat}
              id={section.stat}
              title={section.title}
              description={section.description}
            >
              <div className="space-y-8">
                {sectionTables.map((table) => (
                  <div key={table.slug}>
                    <div className="mb-2 flex flex-wrap items-baseline gap-2">
                      <h3 className="font-display text-lg text-ink">{table.name}</h3>
                      {table.variant && <Badge tone="ember">{table.variant}</Badge>}
                    </div>
                    <p className="mb-3 text-sm leading-relaxed text-ink-muted">
                      {table.summary}
                    </p>

                    <DataTable
                      headers={[
                        t.breakpoints.colRequired,
                        ...table.rows.map((row) => `${row.frames}f`),
                      ]}
                      rows={[
                        [
                          <span key="l" className="text-xs text-ink-subtle">
                            {fmt(t.breakpoints.statNeeded, {
                              stat: table.stat.toUpperCase(),
                            })}
                          </span>,
                          ...table.rows.map((row, i) => (
                            <span key={i} className="font-mono text-ink">
                              {row.value}%
                            </span>
                          )),
                        ],
                      ]}
                      caption={t.breakpoints.tableCaption}
                    />

                    {table.guidance && table.guidance.length > 0 && (
                      <div className="mt-3">
                        <BulletList
                          items={table.guidance.map((g, i) => (
                            <RichText key={i}>{g}</RichText>
                          ))}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          );
        })}

        <Section title={t.breakpoints.iasTitle}>
          <Callout variant="warning" title={t.breakpoints.iasCalloutTitle}>
            <p>
              {iasParts[0]}
              <strong>{t.breakpoints.iasWeaponSpeed}</strong>
              {iasParts[1]}
              <strong>{t.breakpoints.iasSkill}</strong>
              {iasParts[2]}
              <strong>{t.breakpoints.iasClass}</strong>
              {iasParts[3]}
            </p>
            <p className="mt-2">{t.breakpoints.iasBodyB}</p>
          </Callout>
        </Section>
      </div>
    </Container>
  );
}
