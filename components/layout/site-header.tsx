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
 *
 * The breakpoints below are measured, not guessed. Laid out at their natural
 * widths the pieces are: logo 186, primary nav 312, reference nav 524, and the
 * search + switcher cluster 220, plus the row gaps. Each tier therefore appears
 * at the width where it actually fits, rather than at whichever Tailwind
 * breakpoint looked about right — the previous `md`/`xl` pair overflowed the
 * row at 768–873px and at every width from 1280 up, which pushed the language
 * switcher outside the container and gave the page a horizontal scrollbar.
 *
 * The same arithmetic has to hold at the *bottom* of the range, and it did not.
 * This row never wraps and nothing in it can shrink — the wordmark is
 * `shrink-0`, and every other item's `min-width: auto` resolves to its
 * min-content width, which for a row of short unwrappable labels is simply its
 * laid-out width. So the row is exactly as wide as its parts, and at 320px they
 * were: wordmark 94.4 + gap 16 + search-and-switcher 112 + gap 16 + menu 81.4 =
 * 319.8, against the 280px the shell container leaves inside `px-5`. The row
 * therefore ran 39.8px past its container and the document 20px past the
 * viewport — on every page, in both languages, because this is the header.
 *
 * The 20px was visible at the right edge of the `<details>`, which is what made
 * it look like the culprit; the element is 81.4px wide and was merely last in
 * the row. The fix is the budget, not that element: `gap-2` below `sm` (−16)
 * and a menu trigger that is a labelled glyph rather than the word plus a caret
 * (−45) bring the row to 258.4 inside 280, with ~22px of headroom. From `sm`
 * up, where there has always been room, both revert to what they were.
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

      <Container size="shell">
        <div className="flex h-14 items-center gap-2 sm:gap-4">
          <Link href={r.home()} className="group flex shrink-0 items-baseline gap-2">
            <span className="font-display text-lg tracking-wide text-ink transition-colors group-hover:text-ember-bright">
              {t.meta.siteName}
            </span>
            <span className="hidden text-[10px] font-medium tracking-widest text-ink-subtle uppercase sm:inline">
              Resurrected
            </span>
          </Link>

          <nav aria-label={t.nav.primary} className="hidden items-center gap-1 min-[900px]:flex">
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
            className="ml-auto hidden items-center gap-1 min-[1400px]:flex"
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

          <div className="ml-auto flex items-center gap-2 min-[1400px]:ml-3">
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
          <details className="group relative min-[1400px]:hidden">
            {/*
              Below `sm` the trigger is the glyph alone. The name is still there
              — `sr-only` text is in the accessible name computation and in the
              DOM, so this is a rendering decision rather than a label being
              dropped — and it is what buys the 320px row its headroom.
            */}
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded border border-border px-2.5 py-1.5 text-sm text-ink-muted marker:hidden hover:text-ink sm:px-3 [&::-webkit-details-marker]:hidden">
              <span aria-hidden className="text-base leading-none sm:hidden">
                ☰
              </span>
              <span className="sr-only sm:not-sr-only">{t.nav.menu}</span>
              <span
                aria-hidden
                className="hidden text-xs transition-transform group-open:rotate-180 sm:inline"
              >
                ▾
              </span>
            </summary>
            {/*
              `w-56` is narrower than any viewport the site is read at, but the
              cap is not free to omit: at 200% zoom a 320px window is a 160px
              layout viewport, and a fixed 224px panel would hang off it.
            */}
            <div className="absolute right-0 z-50 mt-2 w-56 max-w-[calc(100vw-1.5rem)] rounded-lg border border-border bg-surface-raised p-2 shadow-2xl shadow-abyss">
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
