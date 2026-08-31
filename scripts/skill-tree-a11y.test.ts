/**
 * Accessible names and ARIA state on the skill tree.
 *
 * Two halves. The first exercises `skillAriaLabel` directly against both
 * dictionaries — that is where a duplicated word would come from, and it is
 * pure, so it needs no rendering. The second reads the HTML `next build`
 * already wrote to `.next/server/app` and checks the attributes as shipped,
 * because a correct composer wired to the wrong prop would still pass part one.
 *
 * Requires `npm run build` to have run. Run with `npm run test:a11y`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { dictionaryFor } from "../lib/i18n";
import { LOCALES } from "../lib/i18n/config";
import { TILE_STATES, skillAriaLabel, type SkillAriaStrings, type TileState } from "../lib/skills";

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

const stringsFor = (locale: (typeof LOCALES)[number]): SkillAriaStrings => {
  const t = dictionaryFor(locale).skills;
  return {
    noBuild: t.ariaNoBuild,
    build: t.ariaBuild,
    buildOne: t.ariaBuildOne,
    buildUnused: t.ariaBuildUnused,
    classification: {
      maxed: t.classMaxed,
      invested: t.classInvested,
      "one-point": t.classOnePoint,
      prerequisite: t.classPrerequisite,
      synergy: t.classSynergy,
      utility: t.classUtility,
      flex: t.classFlex,
      unused: t.classUnused,
    },
  };
};

// ===========================================================================
console.log("\nAccessible name composition");
// ===========================================================================

for (const locale of LOCALES) {
  const s = stringsFor(locale);
  const tile = (state: TileState, points: number) => ({
    name: "Resist Lightning",
    level: 12,
    tree: "Defensive Auras",
    points,
    state,
  });

  // The defect this exists to prevent.
  for (const state of TILE_STATES) {
    const label = skillAriaLabel(tile(state, state === "unused" ? 0 : 20), s, true);
    const words = label
      .toLowerCase()
      .replace(/[.,]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !["resist", "lightning", "defensive", "auras"].includes(w));
    const repeated = words.filter((w, i) => words.indexOf(w) !== i);
    check(
      `${locale} ${state}: no word announced twice`,
      repeated.length === 0,
      `${label} → repeated: ${[...new Set(repeated)].join(", ")}`,
    );
  }

  // No leftover placeholders in any shape.
  for (const state of TILE_STATES) {
    for (const [points, inBuild] of [[20, true], [1, true], [0, true], [0, false]] as const) {
      const label = skillAriaLabel(tile(state, points), s, inBuild);
      check(
        `${locale} ${state} points=${points} inBuild=${inBuild}: no unfilled placeholder`,
        !/\{[a-z]+\}/i.test(label),
        label,
      );
    }
  }

  // Shape rules.
  check(
    `${locale}: a class-page tile mentions no points and no obligation`,
    (() => {
      const label = skillAriaLabel(tile("unused", 0), s, false);
      return (
        !/\d/.test(label.replace("12", "")) &&
        !label.includes(s.classification.flex) &&
        !label.includes(s.classification.maxed)
      );
    })(),
    skillAriaLabel(tile("unused", 0), s, false),
  );

  check(
    `${locale}: one point reads "1 point", never "1 points"`,
    !/\b1 (points|pontos)\b/.test(skillAriaLabel(tile("prerequisite", 1), s, true)),
    skillAriaLabel(tile("prerequisite", 1), s, true),
  );

  check(
    `${locale}: a flex tile is announced optional exactly once`,
    (() => {
      const label = skillAriaLabel(tile("flex", 20), s, true).toLowerCase();
      const word = s.classification.flex.toLowerCase();
      return label.split(word).length - 1 === 1;
    })(),
    skillAriaLabel(tile("flex", 20), s, true),
  );

  check(
    `${locale}: a maxed tile is announced maxed and mandatory`,
    skillAriaLabel(tile("maxed", 20), s, true).includes(s.classification.maxed),
    skillAriaLabel(tile("maxed", 20), s, true),
  );

  check(
    `${locale}: every state has a non-empty classification`,
    TILE_STATES.every((st) => s.classification[st].trim().length > 0),
  );
}

check(
  "the two locales produce different wording",
  skillAriaLabel(
    { name: "X", level: 1, tree: "T", points: 20, state: "flex" },
    stringsFor("en-us"),
    true,
  ) !==
    skillAriaLabel(
      { name: "X", level: 1, tree: "T", points: 20, state: "flex" },
      stringsFor("pt-br"),
      true,
    ),
);

// ===========================================================================
console.log("\nARIA as shipped");
// ===========================================================================

const pages = [
  ["class en-us", "en-us/classes/paladin.html", false],
  ["class pt-br", "pt-br/classes/paladin.html", false],
  ["build en-us", "en-us/builds/paladin/hammerdin.html", true],
  ["build pt-br", "pt-br/builds/paladin/hammerdin.html", true],
] as const;

const root = join(process.cwd(), ".next", "server", "app");
if (!existsSync(root)) {
  console.error("  .next/server/app is missing — run `npm run build` first.");
  process.exit(1);
}

for (const [label, file, inBuild] of pages) {
  const path = join(root, file);
  if (!existsSync(path)) {
    check(`${label}: prerendered HTML exists`, false, path);
    continue;
  }
  const html = readFileSync(path, "utf8");

  const tiles = [...html.matchAll(/<button[^>]*data-slug="([a-z0-9-]+)"[^>]*>/g)].map((m) => m[0]);

  // `aria-current` is wrong for a detail pane but right for the current item
  // in navigation, and the language switcher uses it correctly. So the
  // assertion is about the tree, not about the document: no tile may carry it.
  check(
    `${label}: no tile uses aria-current`,
    tiles.every((t) => !t.includes("aria-current")),
    tiles.filter((t) => t.includes("aria-current")).length + " tiles",
  );
  check(
    `${label}: the language switcher's legitimate aria-current is untouched`,
    /hrefLang="[^"]+"[^>]*aria-current="true"/.test(html),
  );

  // `aria-selected` is legitimate inside a grid, but only if something
  // actually maintains it. Nothing does, so it must not appear at all rather
  // than sit alongside aria-expanded as a second name for the same state.
  check(`${label}: no aria-selected anywhere in the tree`,
    !html.includes("aria-selected"));
  check(`${label}: 30 tiles`, tiles.length === 30, `${tiles.length}`);

  check(
    `${label}: every tile is collapsed in the initial HTML`,
    tiles.every((t) => /aria-expanded="false"/.test(t)),
    `${tiles.filter((t) => !/aria-expanded="false"/.test(t)).length} not collapsed`,
  );

  // aria-controls must point at an element that exists.
  const controls = [...new Set(tiles.map((t) => t.match(/aria-controls="([^"]+)"/)?.[1]))].filter(
    (x): x is string => Boolean(x),
  );
  check(`${label}: every tile declares aria-controls`, controls.length > 0);
  check(
    `${label}: every aria-controls target exists in the document`,
    controls.every((id) => html.includes(`id="${id}"`)),
    controls.filter((id) => !html.includes(`id="${id}"`)).join(", "),
  );
  check(`${label}: one panel per tree`, controls.length === 3, `${controls.length}`);

  // IDs must be unique across the three trees on one page.
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  check(`${label}: no duplicate element ids`, dupes.length === 0, [...new Set(dupes)].join(", "));

  // A closed panel must not be in the document at all.
  check(`${label}: no dialog in the initial HTML`, !html.includes('role="dialog"'));

  // Composite structure.
  check(`${label}: 3 grids, 18 rows, 54 cells`,
    (html.match(/role="grid"/g) ?? []).length === 3 &&
      (html.match(/role="row"/g) ?? []).length === 18 &&
      (html.match(/role="gridcell"/g) ?? []).length === 54);

  check(`${label}: each grid names itself and points at the hint`,
    (html.match(/role="grid"[^>]*aria-label="[^"]+"[^>]*aria-describedby="[^"]+"/g) ?? []).length === 3);

  // Accessible names, as shipped.
  const labels = tiles
    .map((t) => t.match(/aria-label="([^"]+)"/)?.[1])
    .filter((x): x is string => Boolean(x))
    .map((x) => x.replace(/&#x27;/g, "'").replace(/&amp;/g, "&"));
  check(`${label}: every tile has an accessible name`, labels.length === 30, `${labels.length}`);

  if (inBuild) {
    const rl = labels.find((l) => l.startsWith("Resist Lightning"));
    check(`${label}: the flex tile reports its points and reads optional once`,
      Boolean(rl && /\b20 (points|pontos)\b/.test(rl) && (rl.toLowerCase().match(/optional|opcional/g) ?? []).length === 1),
      rl);
    const bh = labels.find((l) => l.startsWith("Blessed Hammer"));
    check(`${label}: the maxed tile reads maxed and mandatory`,
      Boolean(bh && /(maxed and mandatory|maximizada e obrigatória)/.test(bh)), bh);
  } else {
    check(`${label}: class-page tiles announce no points`,
      labels.every((l) => !/\b(points|pontos)\b/.test(l)),
      labels.find((l) => /\b(points|pontos)\b/.test(l)));
    check(`${label}: class-page tiles announce no obligation`,
      labels.every((l) => !/(mandatory|obrigatória|optional|opcional)/.test(l)),
      labels.find((l) => /(mandatory|obrigatória|optional|opcional)/.test(l)));
  }

  // No accessible name may repeat a word.
  const repeats = labels.filter((l) => {
    const w = l.toLowerCase().replace(/[.,]/g, " ").split(/\s+/).filter((x) => x.length > 3);
    // Skill names legitimately repeat words with the tree name ("Combat
    // Skills" and a skill called "Holy Bolt" share nothing, but "Auras" can
    // appear twice), so compare only the tail after the tree name.
    const tail = l.split(",").slice(3).join(",").toLowerCase().replace(/[.,]/g, " ").split(/\s+/).filter((x) => x.length > 3);
    return tail.some((x, i) => tail.indexOf(x) !== i) && w.length > 0;
  });
  check(`${label}: no accessible name repeats a word`, repeats.length === 0, repeats.slice(0, 2).join(" | "));
}

// ===========================================================================
console.log(
  failures.length === 0
    ? `\n${passed} checks passed.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
