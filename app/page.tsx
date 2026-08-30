import Link from "next/link";

import { Badge, Container, LinkCard, cn } from "@/components/ui";
import { getBuilds, getClasses, getFarmingAreas, getRunewords } from "@/lib/registry";
import { GAME_VERSION } from "@/lib/game-version";
import { progressionTiers, tierOrder } from "@/lib/labels";

export default function Home() {
  const classes = getClasses();
  const builds = getBuilds().filter((b) => b.complete);
  const runewords = getRunewords();
  const areas = getFarmingAreas();

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      <Container size="wide" className="pt-16 pb-14 sm:pt-24">
        <div className="max-w-3xl">
          <Badge tone="ember">
            Patch {GAME_VERSION.patch} · Season {GAME_VERSION.season}
          </Badge>

          <h1 className="mt-5 font-display text-4xl leading-[1.1] text-balance text-ink sm:text-5xl lg:text-6xl">
            Every guide starts at
            <span className="text-ember-bright"> best in slot</span>.
            <br />
            This one starts where you are.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-ink-muted">
            A Diablo II: Resurrected companion built around one question:{" "}
            <strong className="text-ink">what should I do next?</strong> Level 1 with
            nothing, level 70 with a Spirit and a Stealth, or level 95 chasing a perfect
            roll — the answer should be useful at every point.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/leveling/sorceress"
              className="rounded-md bg-ember px-5 py-2.5 text-sm font-semibold text-abyss transition-colors hover:bg-ember-bright"
            >
              Start a character
            </Link>
            <Link
              href="/builds"
              className="rounded-md border border-border-strong px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink-subtle hover:bg-surface-raised"
            >
              Browse builds
            </Link>
          </div>
        </div>
      </Container>

      {/* ------------------------------------------------------------------ */}
      <Container size="wide" className="pb-16">
        <h2 className="text-xs font-semibold tracking-widest text-ink-subtle uppercase">
          Progression, not a shopping list
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-muted">
          Every build on this site is documented at six gear tiers. You find the one that
          matches what you actually own, and it tells you what to fix next.
        </p>

        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tierOrder.map((tier, i) => {
            const meta = progressionTiers[tier];
            return (
              <li
                key={tier}
                className="rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-ember">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-base text-ink">{meta.label}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                  &ldquo;{meta.question}&rdquo;
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ink-subtle">{meta.context}</p>
              </li>
            );
          })}
        </ol>
      </Container>

      {/* ------------------------------------------------------------------ */}
      <Container size="wide" className="pb-16">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl text-ink">Classes</h2>
          <Link href="/classes" className="text-sm text-ink-muted hover:text-ink">
            All eight →
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {classes.map((cls) => {
            const buildCount = builds.filter((b) => b.classSlug === cls.slug).length;
            return (
              <LinkCard key={cls.slug} href={`/classes/${cls.slug}`}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg text-ink transition-colors group-hover:text-ember-bright">
                    {cls.name}
                  </h3>
                  {cls.requiresDlc && <Badge tone="ember">DLC</Badge>}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                  {cls.summary}
                </p>
                <p className="mt-3 text-xs text-ink-subtle">
                  {buildCount > 0
                    ? `${buildCount} build${buildCount === 1 ? "" : "s"} documented`
                    : "Overview available"}
                </p>
              </LinkCard>
            );
          })}
        </div>
      </Container>

      {/* ------------------------------------------------------------------ */}
      <Container size="wide" className="pb-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <FeatureBlock
            href="/leveling/sorceress"
            eyebrow="Leveling"
            title="A walkthrough, level 1 to Hell"
            body="Which skill takes your next point, where your stats go, when to respec, which runeword to make, and when you are ready for the next difficulty."
          />
          <FeatureBlock
            href="/farming"
            eyebrow="Farming"
            title="Where to go, and why"
            body={`Area levels straight from the game's own data files. ${areas.filter((a) => a.hellLevel85).length} of the ${areas.length} documented areas hit the level 85 threshold where the best drops unlock.`}
          />
          <FeatureBlock
            href="/runewords"
            eyebrow="Runewords"
            title="Base rules you cannot misread"
            body={`${runewords.length} runewords with socket counts, exact rune order and explicit exclusions. Insight goes in a polearm, not a spear — and the page says so.`}
          />
        </div>
      </Container>

      {/* ------------------------------------------------------------------ */}
      <Container size="wide" className="pb-20">
        <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-display text-xl text-ink">On accuracy</h2>
          <div className="mt-3 grid gap-6 text-sm leading-relaxed text-ink-muted sm:grid-cols-2">
            <p className="text-pretty">
              Numbers on this site come from primary sources: the game&rsquo;s own data
              files for area levels, Blizzard&rsquo;s official material for patch changes,
              and cross-checked community databases for item statistics. Where reputable
              sources disagree, or where something has not been confirmed, the page says so
              rather than picking a number and sounding confident.
            </p>
            <p className="text-pretty">
              Diablo II now has <strong className="text-ink">eight</strong> playable
              classes, not seven — the Warlock arrived with{" "}
              <em>{GAME_VERSION.expansion}</em> in 2026. If a guide you are reading lists
              seven, it predates the expansion, and everything else on it may be stale too.{" "}
              <Link href="/about/sources" className="text-ember hover:text-ember-bright">
                How we research this →
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}

function FeatureBlock({
  href,
  eyebrow,
  title,
  body,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <Link href={href} className={cn("group block")}>
      <p className="text-xs font-semibold tracking-widest text-ember uppercase">{eyebrow}</p>
      <h3 className="mt-2 font-display text-xl text-ink transition-colors group-hover:text-ember-bright">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">{body}</p>
    </Link>
  );
}
