import Link from "next/link";

import { Container } from "@/components/ui";
import { SearchDialog } from "@/components/search/search-dialog";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { getI18n } from "@/lib/i18n/server";
import { routes } from "@/lib/routes";
import { buildSearchIndex } from "@/lib/search";

/**
 * Primary navigation.
 *
 * Two tiers on purpose. The top row is where a player *is* in their character's
 * life (Classes, Builds, Leveling, Farming) — that is the product's spine. The
 * second row is reference material they look things up in.
 *
 * The mobile menu is still a native `<details>` element; the only client
 * components here are the search dialog and the language switcher, both of
 * which genuinely need interactivity.
 */
export async function SiteHeader() {
  const { locale, t } = await getI18n();
  const r = routes(locale);

  const primary = [
    { href: r.classes(), label: t.nav.classes },
    { href: r.builds(), label: t.nav.builds },
    { href: r.leveling(), label: t.nav.leveling },
    { href: r.farming(), label: t.nav.farming },
  ];

  const reference = [
    { href: r.runewords(), label: t.nav.runewords },
    { href: r.runes(), label: t.nav.runes },
    { href: r.items(), label: t.nav.items },
    { href: r.breakpoints(), label: t.nav.breakpoints },
    { href: r.mercenaries(), label: t.nav.mercenaries },
    { href: r.mechanics(), label: t.nav.mechanics },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-abyss/85 backdrop-blur-md">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-surface-overlay focus:px-3 focus:py-2 focus:text-sm focus:text-ink"
      >
        {t.nav.skipToContent}
      </a>

      <Container size="wide">
        <div className="flex h-14 items-center gap-4">
          <Link href={r.home()} className="group flex shrink-0 items-baseline gap-2">
            <span className="font-display text-lg tracking-wide text-ink transition-colors group-hover:text-ember-bright">
              {t.meta.siteName}
            </span>
            <span className="hidden text-[10px] font-medium tracking-widest text-ink-subtle uppercase sm:inline">
              Resurrected
            </span>
          </Link>

          <nav aria-label={t.nav.primary} className="hidden items-center gap-1 md:flex">
            {primary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <nav
            aria-label={t.nav.reference}
            className="ml-auto hidden items-center gap-1 xl:flex"
          >
            {reference.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-2.5 py-1.5 text-sm text-ink-subtle transition-colors hover:bg-surface-raised hover:text-ink-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-3">
            <SearchDialog
              indexUrl={r.searchIndex()}
              entryCount={buildSearchIndex(locale).length}
              strings={t.search}
              kindLabels={t.searchKinds}
            />
            <LocaleSwitcher
              current={locale}
              label={t.localeSwitcher.label}
              switchToTemplate={t.localeSwitcher.switchTo}
            />
          </div>

          {/* Native disclosure — no client component needed for a menu. */}
          <details className="group relative xl:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded border border-border px-3 py-1.5 text-sm text-ink-muted marker:hidden hover:text-ink [&::-webkit-details-marker]:hidden">
              {t.nav.menu}
              <span aria-hidden className="text-xs transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-border bg-surface-raised p-2 shadow-2xl shadow-abyss">
              {[...primary, ...reference].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-overlay hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </Container>
    </header>
  );
}
