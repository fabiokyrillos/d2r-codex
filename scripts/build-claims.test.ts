/**
 * Proof that the build-page claim controls fire — and the sweep that found the
 * thing they were written for.
 *
 * The immunity mutation below is the sentence five build pages shipped, in both
 * locales. The gear mutation is synthesised from real catalogue entries rather
 * than invented, because no such error had shipped and a rule with no
 * demonstrated failure is a rule nobody trusts.
 *
 * Run with `npm run test:build-claims`.
 */
import { LOCALES } from "../lib/i18n/config";
import {
  getBuilds,
  getFarmingArea,
  getFarmingAreas,
  getRunes,
  getRunewords,
  getUniques,
} from "../lib/registry";
import type { Build, FarmingArea } from "../lib/types";
import {
  checkFarmingImmunityDenials,
  checkGearLevelFeasibility,
  checkPoisonRateClaims,
  deniedElements,
} from "./build-claims";

let passed = 0;
const failures: string[] = [];
const check = (name: string, ok: boolean, detail = "") => {
  if (ok) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
};

const areaOf = (slug: string) => getFarmingArea("en-us", slug);

/**
 * Required level by ref, looked up in the catalogues themselves.
 *
 * `resolveRef` deliberately returns a link and a label rather than the entity —
 * it exists to render a reference, not to interrogate one — so this reads the
 * three catalogues that carry a `requiredLevel` directly. Refs that carry no
 * level (a base, a charm with none recorded) return undefined and are skipped
 * rather than assumed to be level 1.
 */
const levelOf = (locale: Parameters<typeof getBuilds>[0]) => {
  const runewords = new Map(getRunewords(locale).map((r) => [r.slug, r]));
  const uniques = new Map(getUniques(locale).map((u) => [u.slug, u]));
  const runes = new Map(getRunes(locale).map((r) => [r.slug, r]));
  return (ref: unknown) => {
    const { kind, slug } = (ref ?? {}) as { kind?: string; slug?: string };
    if (!slug) return undefined;
    if (kind === "runeword") {
      const rw = runewords.get(slug);
      return rw && { label: rw.name, requiredLevel: rw.requiredLevel };
    }
    if (kind === "unique" || kind === "set-item" || kind === "charm") {
      const u = uniques.get(slug);
      return u && { label: u.name, requiredLevel: u.requiredLevel };
    }
    if (kind === "rune") {
      const r = runes.get(slug);
      return r && { label: r.name, requiredLevel: r.requiredLevel };
    }
    return undefined;
  };
};

/** A build carrying exactly one Hell farming entry, for the planted mutations. */
const withFarmingWhy = (area: string, why: string): Build =>
  ({
    slug: "control",
    farming: [{ area, difficulty: "hell", why, minTier: "budget", rating: 3 }],
    gearSets: [],
  }) as unknown as Build;

// ---------------------------------------------------------------------------
console.log("\nThe denial parser reads the clause, not the sentence");
// ---------------------------------------------------------------------------
{
  check(
    "'Nothing there is immune to physical' denies physical",
    deniedElements("Nothing there is immune to physical, the density is absurd.").join() === "physical",
  );
  check(
    "'no cold immunes' denies cold",
    deniedElements("Level 85 with no cold immunes at all.").join() === "cold",
  );
  check(
    "pt-br: 'Nada ali é imune a físico' denies physical",
    deniedElements("Nada ali é imune a físico, e a densidade é absurda.").join() === "physical",
  );
  check(
    "pt-br: 'sem imunes a frio' denies cold",
    deniedElements("Nível 85 sem imunes a frio, o que ajuda.").join() === "cold",
  );
  check(
    "the clause stops at the conjunction, so a second element is not read as denied",
    deniedElements(
      "Nothing there is immune to physical, and Hurricane's cold does the rest.",
    ).join() === "physical",
  );
  check(
    "a sentence that asserts an immunity is not a denial",
    deniedElements("The Council are fire and lightning immune in Hell.").length === 0,
  );
  check(
    "a sentence with no quantifier is not a denial",
    deniedElements("Fire immunes are common here.").length === 0,
  );
}

// ---------------------------------------------------------------------------
console.log("\nPlanted mutation: the Cow Level sentence five pages shipped");
// ---------------------------------------------------------------------------
{
  const shippedEn = withFarmingWhy(
    "secret-cow-level",
    "Nothing there is immune to physical, the density is absurd, and Tornado is a skill that rewards density more than it rewards aim.",
  );
  const shippedPt = withFarmingWhy(
    "secret-cow-level",
    "Nada ali é imune a físico, a densidade é absurda, e o Tornado é uma skill que premia densidade mais do que premia mira.",
  );
  const corrected = withFarmingWhy(
    "secret-cow-level",
    "The density is absurd and physical immunity is the only kind that appears, so a Sunder Charm turns the run from good into the best in the game.",
  );

  check(
    "en-us: the shipped Cow Level sentence is rejected",
    checkFarmingImmunityDenials([shippedEn], areaOf, "control").length === 1,
  );
  check(
    "pt-br: the Portuguese mirror is rejected",
    checkFarmingImmunityDenials([shippedPt], areaOf, "control").length === 1,
  );
  check(
    "the rejection names the area's own list",
    checkFarmingImmunityDenials([shippedEn], areaOf, "control")[0]?.message.includes(
      "commonImmunities lists physical",
    ) === true,
  );
  check(
    "the corrected sentence passes",
    checkFarmingImmunityDenials([corrected], areaOf, "control").length === 0,
  );
  check(
    "a true denial still passes: Ancient Tunnels really has no cold in its list",
    checkFarmingImmunityDenials(
      [withFarmingWhy("ancient-tunnels", "Level 85 with no cold immunes at all.")],
      areaOf,
      "control",
    ).length === 0,
  );
  check(
    "the same false denial about a Nightmare run is out of scope, because the data is Hell's",
    checkFarmingImmunityDenials(
      [
        {
          slug: "control",
          farming: [
            {
              area: "secret-cow-level",
              difficulty: "nightmare",
              why: "Nothing there is immune to physical.",
              minTier: "starter",
              rating: 3,
            },
          ],
          gearSets: [],
        } as unknown as Build,
      ],
      areaOf,
      "control",
    ).length === 0,
  );
}

// ---------------------------------------------------------------------------
console.log("\nPlanted mutation: gear listed above the tier that recommends it");
// ---------------------------------------------------------------------------
{
  const resolve = levelOf("en-us");
  const build = (cap: number, slug: string): Build =>
    ({
      slug: "control",
      farming: [],
      gearSets: [
        {
          tier: "starter",
          goal: "",
          levelRange: [1, cap],
          slots: [{ slot: "body", picks: [{ ref: { kind: "runeword", slug }, why: "" }] }],
        },
      ],
    }) as unknown as Build;

  check(
    "Enigma (65) in a tier that ends at 40 is rejected",
    checkGearLevelFeasibility([build(40, "enigma")], resolve, "control").length === 1,
  );
  check(
    "the rejection names both numbers",
    (() => {
      const m = checkGearLevelFeasibility([build(40, "enigma")], resolve, "control")[0]?.message ?? "";
      return m.includes("requires level 65") && m.includes("ends at 40");
    })(),
  );
  check(
    "Stealth (17) in the same tier passes",
    checkGearLevelFeasibility([build(40, "stealth")], resolve, "control").length === 0,
  );
  check(
    "an item requiring exactly the tier's cap passes — the band includes its own top",
    checkGearLevelFeasibility([build(65, "enigma")], resolve, "control").length === 0,
  );
  /*
   * A pick that says out loud that the item is a future goal is still rejected.
   *
   * This is the shape all nine of the fixed picks had after the fact: the prose
   * knew. "If you find a Shako, wear it immediately" sat under a level 62 helm
   * in a tier ending at 60, and Melody's entry named level 39 inside a tier
   * ending at 30. Saying the level does not make the recommendation reachable,
   * and a rule that accepted a sentence as an exemption would have passed every
   * one of them.
   *
   * The model has no "future goal" flag, and this control is where that
   * decision is recorded. If one is ever wanted it has to be a field the rule
   * can read and the page can render differently — not a sentence, which is
   * invisible to both.
   */
  check(
    "naming the item's level in the prose does not exempt the pick",
    checkGearLevelFeasibility(
      [
        {
          slug: "control",
          farming: [],
          gearSets: [
            {
              tier: "starter",
              goal: "",
              levelRange: [1, 40],
              slots: [
                {
                  slot: "body",
                  picks: [
                    {
                      ref: { kind: "runeword", slug: "enigma" },
                      why: "Requires level 65 — a goal for later, not for now.",
                    },
                  ],
                },
              ],
            },
          ],
        } as unknown as Build,
      ],
      resolve,
      "control",
    ).length === 1,
  );

  check(
    "an alternative nested inside a pick is checked too",
    checkGearLevelFeasibility(
      [
        {
          slug: "control",
          farming: [],
          gearSets: [
            {
              tier: "starter",
              goal: "",
              levelRange: [1, 20],
              slots: [
                {
                  slot: "body",
                  picks: [
                    {
                      ref: { kind: "runeword", slug: "stealth" },
                      why: "",
                      alternatives: [{ ref: { kind: "runeword", slug: "enigma" }, why: "" }],
                    },
                  ],
                },
              ],
            },
          ],
        } as unknown as Build,
      ],
      resolve,
      "control",
    ).length === 1,
  );
}

// ---------------------------------------------------------------------------
console.log("\nPlanted mutation: a poison total restated as a rate");
// ---------------------------------------------------------------------------
{
  check(
    "'924-996 poison damage per second' is rejected",
    checkPoisonRateClaims(
      ["At twenty hard points Rabies deals 924-996 poison damage per second."],
      "control",
    ).length === 1,
  );
  check(
    "pt-br: 'dano de veneno por segundo' is rejected",
    checkPoisonRateClaims(
      ["Com vinte pontos duros o Rabies causa 924-996 de dano de veneno por segundo."],
      "control",
    ).length === 1,
  );
  check(
    "stating the duration alongside the number passes — that is the honest sentence",
    checkPoisonRateClaims(
      ["Rabies deals 924-996 poison over 290 frames, which is about 80 a second."],
      "control",
    ).length === 0,
  );
  check(
    "the total, stated as a total, passes",
    checkPoisonRateClaims(
      ["At twenty hard points that is 924-996 poison damage in total."],
      "control",
    ).length === 0,
  );
  check(
    "a per-second claim about something that is not poison is out of scope",
    checkPoisonRateClaims(
      ["Arctic Blast costs 0.375 mana a frame, which is roughly nine mana a second."],
      "control",
    ).length === 0,
  );
}

// ---------------------------------------------------------------------------
console.log("\nThe live sweep: every build, both locales");
// ---------------------------------------------------------------------------
/*
 * Every rule here fails on every class, in both locales.
 *
 * It did not start that way. The gear-level rule shipped reported-not-failed
 * outside the class its pass owned, on the judgement — recorded in
 * `amazon-rules.ts` — that a gate forcing edits to already-approved content
 * gets argued with rather than obeyed. Nine picks on seven older pages sat
 * above their tier's band under that arrangement, printed on every run so the
 * number could only go down.
 *
 * It went down by being fixed, and the arrangement went with it. All nine were
 * the same defect: an item the tier cannot equip, already listed in a later
 * tier where it can be. None of them needed an editorial call, and the
 * softening had cost more than it bought — a reported-not-failed rule reads as
 * a list of known problems, and a list is a thing a reader of the test output
 * learns to scroll past.
 *
 * If a future pick genuinely belongs above its band, the answer is a change to
 * this rule that says what that shape is, not a class name that exempts it.
 */
{
  const failing: string[] = [];
  let entries = 0;
  let picks = 0;

  for (const locale of LOCALES) {
    const builds = getBuilds(locale);
    const localAreaOf = (slug: string): FarmingArea | undefined => getFarmingArea(locale, slug);
    const resolve = levelOf(locale);

    entries += builds.reduce((n, b) => n + b.farming.length, 0);
    picks += builds.reduce(
      (n, b) => n + b.gearSets.reduce((m, g) => m + g.slots.reduce((k, s) => k + s.picks.length, 0), 0),
      0,
    );

    for (const build of builds) {
      for (const p of checkFarmingImmunityDenials([build], localAreaOf, locale)) {
        failing.push(p.message);
      }
      for (const p of checkGearLevelFeasibility([build], resolve, locale)) {
        failing.push(p.message);
      }

      const lines = [
        build.summary,
        build.playstyle,
        ...build.strengths,
        ...build.weaknesses,
        ...(build.flexPoints ?? []),
        ...build.stats.notes,
        ...build.skills.map((s) => s.note ?? ""),
        build.immunityPlan ?? "",
        build.breakpointNotes ?? "",
        ...build.farming.map((f) => f.why),
      ].filter(Boolean);
      for (const p of checkPoisonRateClaims(lines, `${locale}/${build.slug}`)) failing.push(p.message);
    }
  }

  for (const message of failing) console.log(`       ${message}`);
  check(
    `no build page contradicts an area, rates a poison total, or lists gear above its tier ` +
      `(${entries} farming entries, ${picks} gear picks, every class)`,
    failing.length === 0,
    `${failing.length} problems, listed above`,
  );
  check("the sweep actually read something", entries > 200 && picks > 800, `${entries} / ${picks}`);
  check(
    "every area a build names resolves, so the immunity rule is not silently skipping them",
    getBuilds("en-us")
      .flatMap((b) => b.farming.map((f) => f.area))
      .every((slug) => getFarmingAreas("en-us").some((a) => a.slug === slug)),
  );

  const classes = new Set(getBuilds("en-us").map((b) => b.classSlug));
  check(
    "and the sweep covers every class, with nothing reported-not-failed",
    classes.size === 7,
    [...classes].join(", "),
  );
}

// ---------------------------------------------------------------------------
if (failures.length > 0) {
  console.error(`\n${failures.length} FAILED of ${passed + failures.length}:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\n${passed} checks passed.`);
