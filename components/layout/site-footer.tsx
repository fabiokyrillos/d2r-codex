import Link from "next/link";

import { Container } from "@/components/ui";
import { GAME_VERSION } from "@/lib/game-version";
import { fmt } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { routes } from "@/lib/routes";

export async function SiteFooter() {
  const { locale, t } = await getI18n();
  const r = routes(locale);

  return (
    <footer className="mt-20 border-t border-border bg-surface/40">
      <Container size="wide">
        <div className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-base text-ink">{t.meta.siteName}</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-subtle">
              {t.footer.blurb}
            </p>
          </div>

          <FooterColumn
            title={t.footer.columnProgression}
            links={[
              { href: r.classes(), label: t.nav.classes },
              { href: r.builds(), label: t.nav.builds },
              { href: r.leveling(), label: t.nav.leveling },
              { href: r.farming(), label: t.nav.farming },
            ]}
          />
          <FooterColumn
            title={t.footer.columnReference}
            links={[
              { href: r.runewords(), label: t.nav.runewords },
              { href: r.runes(), label: t.nav.runes },
              { href: r.items(), label: t.nav.items },
              { href: r.breakpoints(), label: t.nav.breakpoints },
              { href: r.mercenaries(), label: t.nav.mercenaries },
            ]}
          />
          <FooterColumn
            title={t.footer.columnAbout}
            links={[
              { href: r.mechanics(), label: t.footer.mechanicsLink },
              { href: r.sources(), label: t.nav.sources },
            ]}
          />
        </div>

        <div className="flex flex-col gap-2 border-t border-border py-5 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            {t.footer.writtenFor}{" "}
            <span className="text-ink-muted">
              {fmt(t.footer.patchSeason, {
                patch: GAME_VERSION.patch,
                season: GAME_VERSION.season,
              })}
            </span>
            . {fmt(t.footer.verifiedOn, { date: GAME_VERSION.verifiedOn })}
          </p>
          <p>{t.footer.trademark}</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
