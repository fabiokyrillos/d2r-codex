import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Badge,
  Callout,
  Card,
  Container,
  DataTable,
  LinkCard,
  PageHeader,
  Section,
} from "@/components/ui";
import { RuneSequence, SocketDisplay } from "@/components/game";
import { getRune, getRunes, getRunewordsUsingRune } from "@/lib/registry";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getRunes().map((rune) => ({ slug: rune.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rune = getRune(slug);
  if (!rune) return {};
  return {
    title: `${rune.name} Rune`,
    description: `${rune.summary} Required level ${rune.requiredLevel || "none"}. ${rune.weaponMod} in weapons.`,
  };
}

export default async function RunePage({ params }: Props) {
  const { slug } = await params;
  const rune = getRune(slug);
  if (!rune) notFound();

  const runewords = getRunewordsUsingRune(rune.slug);
  const all = getRunes();
  const prev = all.find((r) => r.number === rune.number - 1);
  const next = all.find((r) => r.number === rune.number + 1);

  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={
          <>
            <Link href="/runes" className="hover:text-ink-muted">
              Runes
            </Link>
            <span aria-hidden>/</span>
            <span>#{rune.number} of 33</span>
          </>
        }
        title={`${rune.name} Rune`}
        description={rune.summary}
        meta={
          <>
            <Badge tone="ember">
              {rune.requiredLevel > 0 ? `Required level ${rune.requiredLevel}` : "No level requirement"}
            </Badge>
            <Badge tone="neutral">Rune {rune.number}</Badge>
          </>
        }
      />

      <div className="mt-8 space-y-10">
        <Section title="Socketed modifiers">
          <DataTable
            headers={["Item type", "Modifier"]}
            rows={[
              ["Weapon", rune.weaponMod],
              ["Body Armor", rune.armorMod],
              ["Helm", rune.helmMod],
              ["Shield", rune.shieldMod],
            ]}
          />
        </Section>

        {rune.farmNotes && (
          <Callout variant="info" title="Where it comes from">
            {rune.farmNotes}
          </Callout>
        )}

        {rune.upgradeRecipe && (
          <Section title="Upgrade recipe">
            <Card>
              <p className="font-mono text-sm text-ink">{rune.upgradeRecipe}</p>
              <p className="mt-2 text-sm text-ink-muted">
                Combine in the Horadric Cube. Upgrading is often faster than farming the
                higher rune directly, especially in the El-to-Lem range where the ratio is
                three-to-one.
              </p>
            </Card>
          </Section>
        )}

        {runewords.length > 0 && (
          <Section
            title={`Runewords using ${rune.name}`}
            description="Derived from the runeword data — this list updates itself."
          >
            <ul className="grid gap-3 sm:grid-cols-2">
              {runewords.map((rw) => (
                <li key={rw.slug}>
                  <LinkCard href={`/runewords/${rw.slug}`} className="h-full">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base text-rarity-runeword">{rw.name}</h3>
                      <SocketDisplay count={rw.sockets} />
                    </div>
                    <div className="mt-2">
                      <RuneSequence runes={rw.runes} resolveRune={getRune} />
                    </div>
                    <p className="mt-2 text-xs text-ink-subtle">{rw.bases.display}</p>
                  </LinkCard>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <nav className="flex items-center justify-between gap-4 border-t border-border pt-6">
          {prev ? (
            <Link
              href={`/runes/${prev.slug}`}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              ← {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/runes/${next.slug}`}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {next.name} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </Container>
  );
}
