import Link from "next/link";
import { Container } from "@/components/ui";
import { GAME_VERSION } from "@/lib/game-version";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface/40">
      <Container size="wide">
        <div className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-base text-ink">D2 Codex</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-subtle">
              A progression-first Diablo II: Resurrected companion. Built to answer
              &ldquo;what should I do next?&rdquo; at every gear level.
            </p>
          </div>

          <FooterColumn
            title="Progression"
            links={[
              { href: "/classes", label: "Classes" },
              { href: "/builds", label: "Builds" },
              { href: "/leveling", label: "Leveling" },
              { href: "/farming", label: "Farming" },
            ]}
          />
          <FooterColumn
            title="Reference"
            links={[
              { href: "/runewords", label: "Runewords" },
              { href: "/runes", label: "Runes" },
              { href: "/items", label: "Items" },
              { href: "/breakpoints", label: "Breakpoints" },
              { href: "/mercenaries", label: "Mercenaries" },
            ]}
          />
          <FooterColumn
            title="About"
            links={[
              { href: "/mechanics", label: "Game mechanics" },
              { href: "/about/sources", label: "Sources & research" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-2 border-t border-border py-5 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            Written for{" "}
            <span className="text-ink-muted">
              Patch {GAME_VERSION.patch} · Ladder Season {GAME_VERSION.season}
            </span>
            . Verified {GAME_VERSION.verifiedOn}.
          </p>
          <p>
            Diablo II: Resurrected is a trademark of Blizzard Entertainment. This is an
            unofficial fan reference.
          </p>
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
