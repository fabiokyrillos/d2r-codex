import Link from "next/link";
import { Container } from "@/components/ui";

/**
 * Primary navigation.
 *
 * Two tiers on purpose. The top row is where a player *is* in their character's
 * life (Classes, Builds, Leveling, Farming) — that is the product's spine. The
 * second row is reference material they look things up in.
 *
 * No client JavaScript: the mobile menu is a native `<details>` element.
 */

const PRIMARY = [
  { href: "/classes", label: "Classes" },
  { href: "/builds", label: "Builds" },
  { href: "/leveling", label: "Leveling" },
  { href: "/farming", label: "Farming" },
] as const;

const REFERENCE = [
  { href: "/runewords", label: "Runewords" },
  { href: "/runes", label: "Runes" },
  { href: "/items", label: "Items" },
  { href: "/breakpoints", label: "Breakpoints" },
  { href: "/mercenaries", label: "Mercenaries" },
  { href: "/mechanics", label: "Mechanics" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-abyss/85 backdrop-blur-md">
      <Container size="wide">
        <div className="flex h-14 items-center gap-6">
          <Link href="/" className="group flex shrink-0 items-baseline gap-2">
            <span className="font-display text-lg tracking-wide text-ink transition-colors group-hover:text-ember-bright">
              D2 Codex
            </span>
            <span className="hidden text-[10px] font-medium tracking-widest text-ink-subtle uppercase sm:inline">
              Resurrected
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {PRIMARY.map((item) => (
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
            aria-label="Reference"
            className="ml-auto hidden items-center gap-1 lg:flex"
          >
            {REFERENCE.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-2.5 py-1.5 text-sm text-ink-subtle transition-colors hover:bg-surface-raised hover:text-ink-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Native disclosure — no client component needed for a menu. */}
          <details className="group relative ml-auto lg:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded border border-border px-3 py-1.5 text-sm text-ink-muted marker:hidden hover:text-ink [&::-webkit-details-marker]:hidden">
              Menu
              <span aria-hidden className="text-xs transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-border bg-surface-raised p-2 shadow-2xl shadow-abyss">
              {[...PRIMARY, ...REFERENCE].map((item) => (
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
