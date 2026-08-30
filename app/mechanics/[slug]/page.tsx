import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card, Container, PageHeader, Section } from "@/components/ui";
import { ConfidenceNote } from "@/components/game";
import { ContentBlocks } from "@/components/game/content-blocks";
import { getMechanic, getMechanics } from "@/lib/registry";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getMechanics().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getMechanic(slug);
  if (!article) return {};
  return { title: article.name, description: article.summary };
}

export default async function MechanicPage({ params }: Props) {
  const { slug } = await params;
  const article = getMechanic(slug);
  if (!article) notFound();

  const related = (article.related ?? [])
    .map((s) => getMechanic(s))
    .filter((a) => a !== undefined);

  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={
          <>
            <Link href="/mechanics" className="hover:text-ink-muted">
              Mechanics
            </Link>
            <span aria-hidden>/</span>
            <span className="capitalize">{article.category}</span>
          </>
        }
        title={article.name}
        description={article.summary}
        meta={<ConfidenceNote confidence={article.confidence} />}
      />

      <div className="mt-8 space-y-10">
        {/* The short answer, before the explanation. Most readers arrive
            wanting one number and leave as soon as they have it. */}
        <Card className="border-ember-dim/40 bg-ember-dim/5">
          <h2 className="text-xs font-semibold tracking-wide text-ember uppercase">
            The short version
          </h2>
          <ul className="mt-3 space-y-2">
            {article.keyFacts.map((fact) => (
              <li key={fact} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-ember" />
                <span className="text-pretty">{fact}</span>
              </li>
            ))}
          </ul>
        </Card>

        <article>
          <ContentBlocks blocks={article.body} />
        </article>

        {related.length > 0 && (
          <Section title="Related">
            <ul className="flex flex-wrap gap-2">
              {related.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/mechanics/${a.slug}`}
                    className="inline-flex rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
                  >
                    {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </Container>
  );
}
