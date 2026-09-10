import { Container } from "@/components/ui";

/**
 * A always-visible list of in-page anchors, rendered on the server.
 *
 * This is the class page's half of the Phase 2 summary, and it is a separate
 * component from `page-sections.tsx` on purpose — the plan expected one
 * component with two call sites, and the two pages turned out to want different
 * things:
 *
 *   the build page  11 entries, and an active gear tier to reflect. Eleven
 *                   entries stack to ~190px on a phone, so below 640px they
 *                   belong behind a "Sections" button; and reflecting the open
 *                   tier needs a `MutationObserver`. Both make it a client
 *                   island.
 *
 *   the class page  5 entries, no tiers. Five wrap into one row even at 320px,
 *                   and there is nothing to observe.
 *
 * Forcing the class page through the disclosure would cost it the thing
 * R-NAV-3 actually asks for — *"Skill trees reachable in one interaction from
 * the top"* — because a disclosure is two: open, then choose. It would also
 * make a page that needs no JavaScript at all depend on the
 * `::details-content` support floor that reveals the build page's panel.
 *
 * So: no `<details>`, no island, no floor. A `<nav>` and a list of links, which
 * behave identically with scripting on and off.
 *
 * The entries are passed already filtered by the same guards as the sections
 * they point at. An entry whose section did not render would be a dead anchor,
 * which is defect D2's exact shape, and `scripts/nav-discovery.test.ts` asserts
 * both directions of that.
 */
export interface SectionNavEntry {
  /** The `id` of a section that actually rendered. */
  id: string;
  /** The section's own heading text, so the two cannot drift apart. */
  label: string;
}

export function SectionNav({
  entries,
  label,
}: {
  entries: SectionNavEntry[];
  /** Names the landmark. There are two navigations in the header already. */
  label: string;
}) {
  if (entries.length === 0) return null;
  return (
    <Container>
      <nav aria-label={label} data-section-nav className="border-b border-border pb-4">
        <ol className="flex flex-wrap gap-x-1 gap-y-1">
          {entries.map((entry) => (
            <li key={entry.id}>
              {/*
                A plain anchor, never `next/link`: this is a same-document
                fragment, and routing it costs a soft navigation to reach a
                heading that is already on the page. `hygiene.test.ts` fails a
                `<Link href="#…">` for the same reason.
              */}
              <a
                href={`#${entry.id}`}
                className="block rounded px-3 py-1.5 text-sm text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
              >
                {entry.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </Container>
  );
}
