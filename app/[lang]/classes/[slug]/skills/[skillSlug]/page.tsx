import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Badge,
  BulletList,
  Callout,
  Container,
  DataTable,
  PageHeader,
  Section,
} from "@/components/ui";
import { ConfidenceNote, ElementBadge, RichText, SkillSigil } from "@/components/game";
import {
  getBuildsUsingSkill,
  getClass,
  getSkill,
  getSkillsForClass,
  getSkillTree,
} from "@/lib/registry";
import { fmt, formatPoints, isLocale } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/metadata";
import { skillKindLabels, synergyKinds } from "@/lib/labels";
import { routes } from "@/lib/routes";
import {
  CLASSES_WITH_SKILL_PAGES,
  SKILL_GRAPH,
  damageAtLevel,
  damagePresentation,
  dependents,
  progressionLevels,
  synergyReceivers,
} from "@/lib/skills";

/**
 * One page per skill.
 *
 * The indexable surface for skills: everything the contextual panel shows in
 * passing, plus the parts that only make sense with room — the prerequisite
 * chain in both directions, the damage table, and which documented builds
 * actually spend points here.
 *
 * Scoped to the classes whose skills are in the extracted graph. The tree on a
 * class page renders only where these pages exist, so no tile can link to a
 * 404.
 */

export function generateStaticParams() {
  return CLASSES_WITH_SKILL_PAGES.flatMap((slug) =>
    getSkillsForClass("en-us", slug).map((skill) => ({ slug, skillSlug: skill.slug })),
  );
}

export async function generateMetadata(
  props: PageProps<"/[lang]/classes/[slug]/skills/[skillSlug]">,
): Promise<Metadata> {
  const { lang, slug, skillSlug } = await props.params;
  if (!isLocale(lang)) notFound();
  const skill = getSkill(lang, skillSlug);
  const cls = getClass(lang, slug);
  if (!skill || !cls || skill.classSlug !== slug) return {};
  return pageMetadata(lang, {
    path: `/classes/${slug}/skills/${skillSlug}`,
    // "Charge" and "Might" are ambiguous words on their own.
    title: `${skill.name} — ${cls.name}`,
    description: skill.summary,
  });
}

export default async function SkillPage(
  props: PageProps<"/[lang]/classes/[slug]/skills/[skillSlug]">,
) {
  const { slug, skillSlug } = await props.params;
  const { locale, t } = await getI18n();
  const r = routes(locale);

  const skill = getSkill(locale, skillSlug);
  const cls = getClass(locale, slug);
  const node = SKILL_GRAPH[skillSlug];
  if (!skill || !cls || !node || skill.classSlug !== slug) notFound();

  const tree = getSkillTree(locale, node.tree);
  const kinds = skillKindLabels(t);
  const siblings = getSkillsForClass(locale, slug);
  const byslug = (s: string) => siblings.find((x) => x.slug === s);

  const prerequisites = node.prerequisites.map(byslug).filter((s) => s !== undefined);
  const unlocks = dependents(skillSlug).map(byslug).filter((s) => s !== undefined);

  /*
   * Both synergy directions come from the graph, which reads the game's own
   * formulas. Authored content supplies only the magnitude, looked up by
   * source slug — so a page can never claim an edge the game does not have,
   * and the two directions cannot disagree with each other.
   */
  const bonusFor = new Map((skill.synergies ?? []).map((s) => [s.skill, s.bonus]));
  const receives = node.synergies.flatMap((s) => {
    const from = byslug(s.from);
    return from ? [{ skill: from, kinds: s.kinds, bonus: bonusFor.get(s.from) }] : [];
  });
  const feeds = synergyReceivers(skillSlug).flatMap((rec) => {
    const to = byslug(rec.slug);
    return to ? [{ skill: to, kinds: rec.kinds }] : [];
  });
  const builds = getBuildsUsingSkill(locale, skillSlug);
  const presentation = damagePresentation(skill, node);

  // Only tabulate levels that decide something: the first, the cap, and any
  // level a documented build actually recommends.
  const levels = progressionLevels(
    node,
    builds.map((b) => b.allocation.points),
  );

  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={
          <>
            <Link href={r.classes()} className="hover:text-ink-muted">
              {t.nav.classes}
            </Link>
            <span aria-hidden>/</span>
            <Link href={r.class(slug)} className="hover:text-ink-muted">
              {cls.name}
            </Link>
            <span aria-hidden>/</span>
            <span>{tree?.name ?? t.skills.eyebrow}</span>
          </>
        }
        title={skill.name}
        description={skill.summary}
        meta={
          <>
            <SkillSigil kind={skill.kind} element={skill.element} size={18} />
            <Badge tone="outline">
              {fmt(t.skills.unlocksValue, { level: node.requiredLevel })}
            </Badge>
            <Badge tone="neutral">{kinds[skill.kind]}</Badge>
            {skill.element && <ElementBadge element={skill.element} />}
            <ConfidenceNote confidence={skill.confidence} />
          </>
        }
      />

      <div className="mt-8 space-y-10">
        <Section title={t.skills.atAGlance}>
          <DataTable
            headers={[t.skills.colProperty, t.skills.colValue]}
            rows={[
              [t.skills.tree, tree?.name ?? "—"],
              [t.skills.unlocks, fmt(t.skills.unlocksValue, { level: node.requiredLevel })],
              [t.skills.cap, formatPoints(t.skills.points, node.maxLevel)],
              [t.skills.type, kinds[skill.kind]],
              ...(skill.element
                ? [[t.skills.element, <ElementBadge key="el" element={skill.element} />]]
                : []),
              ...(skill.manaCost ? [[t.skills.manaCost, skill.manaCost]] : []),
            ]}
          />
        </Section>

        {skill.mechanics && skill.mechanics.length > 0 && (
          <Section title={t.skills.mechanicsTitle}>
            <BulletList
              items={skill.mechanics.map((m, i) => <RichText key={i}>{m}</RichText>)}
            />
          </Section>
        )}

        <Section title={t.skills.prerequisitesTitle} description={t.skills.prerequisitesBody}>
          {prerequisites.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {prerequisites.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={r.skill(slug, p.slug)}
                    className="inline-flex items-center gap-1.5 rounded border border-border bg-surface-raised px-2.5 py-1 text-sm text-ink hover:border-ember"
                  >
                    <SkillSigil kind={p.kind} element={p.element} size={14} />
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-muted">{t.skills.prerequisitesNone}</p>
          )}
        </Section>

        {unlocks.length > 0 && (
          <Section title={t.skills.unlocksTitle} description={t.skills.unlocksBody}>
            <ul className="flex flex-wrap gap-2">
              {unlocks.map((u) => (
                <li key={u.slug}>
                  <Link
                    href={r.skill(slug, u.slug)}
                    className="inline-flex items-center gap-1.5 rounded border border-border bg-surface-raised px-2.5 py-1 text-sm text-ink hover:border-ember"
                  >
                    <SkillSigil kind={u.kind} element={u.element} size={14} />
                    {u.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {receives.length > 0 && (
          <Section title={t.skills.synergiesTitle} description={t.skills.synergiesBody}>
            <ul className="space-y-2">
              {receives.map((syn) => (
                <li key={syn.skill.slug} className="flex flex-wrap items-baseline gap-x-2 text-sm">
                  {/* Always a link: every source is a skill of this class that
                      the graph knows, so there is no dead-name case to fall
                      back to. A slug that did not resolve would fail
                      `check:content` rather than render as bare text. */}
                  <Link
                    href={r.skill(slug, syn.skill.slug)}
                    className="font-medium text-ember hover:text-ember-bright"
                  >
                    {syn.skill.name}
                  </Link>
                  <span className="text-ink-muted">{synergyKinds(syn.kinds, t)}</span>
                  {syn.bonus && <span className="text-pretty text-ink-muted">{syn.bonus}</span>}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-muted">{t.skills.synergiesNote}</p>
          </Section>
        )}

        {feeds.length > 0 && (
          <Section title={t.skills.feedsTitle} description={t.skills.feedsBody}>
            <ul className="flex flex-wrap gap-2">
              {feeds.map((f) => (
                <li key={f.skill.slug}>
                  <Link
                    href={r.skill(slug, f.skill.slug)}
                    className="inline-flex items-center gap-1.5 rounded border border-border bg-surface-raised px-2.5 py-1 text-sm text-ink hover:border-ember"
                  >
                    <SkillSigil kind={f.skill.kind} element={f.skill.element} size={14} />
                    {f.skill.name}
                    <span className="text-xs text-ink-muted">{synergyKinds(f.kinds, t)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section title={t.skills.progressionTitle} description={t.skills.progressionBody}>
          {presentation === "table" ? (
            <DataTable
              headers={[t.skills.colLevel, t.skills.colDamage]}
              rows={levels.map((level) => {
                const d = damageAtLevel(node, level);
                return [
                  <span key="l" className="font-mono">
                    {level}
                  </span>,
                  <span key="d" className="font-mono">
                    {d ? `${d.min}–${d.max}` : "—"}
                  </span>,
                ];
              })}
            />
          ) : (
            <p className="text-sm leading-relaxed text-pretty text-ink-muted">
              <RichText>
                {fmt(
                  presentation === "weapon"
                    ? t.skills.noProgressionWeapon
                    : presentation === "proportional"
                      ? t.skills.noProgressionProportional
                      : t.skills.noProgressionNone,
                  { mechanics: t.skills.mechanicsTitle },
                )}
              </RichText>
            </p>
          )}
        </Section>

        <Section title={t.skills.buildsTitle} description={t.skills.buildsBody}>
          {builds.length > 0 ? (
            <DataTable
              headers={[t.nav.builds, t.skills.colLevel]}
              rows={builds.map(({ build, allocation }) => [
                <Link
                  key="b"
                  href={r.build(build.classSlug, build.slug)}
                  className="text-ember hover:text-ember-bright"
                >
                  {build.name}
                </Link>,
                <span key="p" className="font-mono">
                  {formatPoints(t.skills.points, allocation.points)}
                </span>,
              ])}
            />
          ) : (
            <Callout variant="info">{t.skills.buildsNone}</Callout>
          )}
        </Section>

        <p className="text-sm">
          <Link href={r.classSkills(slug)} className="text-ember hover:text-ember-bright">
            {fmt(t.skills.backToTree, { class: cls.name })}
          </Link>
        </p>
      </div>
    </Container>
  );
}
