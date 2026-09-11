import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container, PageHeader, Section } from "@/components/ui";
import { BuildCard } from "@/components/builds/build-card";
import { FilterableBuildList } from "@/components/builds/filterable-build-list";
import { getBuilds } from "@/lib/registry";
import { dictionaryFor, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(
  props: PageProps<"/[lang]/builds">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();
  const t = dictionaryFor(lang);
  return pageMetadata(lang, {
    path: "/builds",
    title: t.nav.builds,
    description: t.builds.indexDescription,
  });
}

export default async function BuildsPage() {
  const { locale, t } = await getI18n();
  const builds = getBuilds(locale);

  return (
    <Container size="wide" className="py-10">
      {/*
        The compact header, and no description under the title.

        On this page the header is what stands between the reader and the
        first card, and two of the phase's acceptances are distances from the
        title: the chip row within 120px of its bottom edge at every width
        (R-FILT-1), and the grid within 220px of its top at 1280px
        (R-FILT-11). The title, the chip row, the second row of controls and
        the hairline between them and the cards are 219px on their own at
        1280 — with the 44px targets both rows have to be, there is no
        smaller arrangement — so the description's one line in en-US and two
        in pt-BR (31 and 54px) could only push the grid past the line, and at
        320px its four to five lines were the whole of R-FILT-1's budget by
        themselves. The plan (§3) reserved exactly this as the decision to
        make; the numbers are in the Phase 3 report. The `<meta>` description
        still carries the sentence, and the cards say what each build is.
      */}
      <PageHeader eyebrow={<span>{t.nav.builds}</span>} title={t.builds.indexTitle} compact />

      <div className="mt-4">
        <Section>
          <FilterableBuildList
            builds={builds}
            listClassName="grid gap-4 lg:grid-cols-2"
            cardFor={(build, row) => <BuildCard build={build} row={row} variant="catalogue" />}
          />
        </Section>
      </div>
    </Container>
  );
}
