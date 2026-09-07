import Link from "next/link";

import { Container } from "@/components/ui";
import { SearchDialog } from "@/components/search/search-dialog";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
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
 * The mobile menu is still a native `<details>` element, but it is no longer
 * *this* file's `<details>`. It lives in a client island now, because the
 * header is in the persistent root layout: a client-side navigation keeps the
 * same DOM node, so an uncontrolled disclosure stayed open and the reader
 * arrived on the destination page with the menu over it. The island controls
 * `open` and still renders the native element, so a reader without JavaScript
 * gets the same disclosure that was always there. See
 * `components/layout/mobile-navigation.tsx`.
 *
 * Everything else here — the wordmark, both desktop navs, the search dialog,
 * the language switcher and all the data preparation — stays server-rendered.
 * The client components are the three that genuinely need interactivity.
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

          {/*
            The one interactive island in the header. It is handed the already
            localized items, so the dictionary stays on the server — the same
            reason `SearchDialog` and `LocaleSwitcher` take strings as props.
          */}
          <MobileNavigation
            items={[...primary, ...reference]}
            menuLabel={t.nav.menu}
            navigationLabel={t.nav.menu}
          />
        </div>
      </Container>
    </header>
  );
}
