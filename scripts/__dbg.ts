import { claimEntriesFor, checkDiminishingClaims } from "./diminishing-claims";
import { getBuilds } from "../lib/registry";
import { LOCALES, type Locale } from "../lib/i18n/config";
import type { Slug } from "../lib/types";

const entries = LOCALES.flatMap((l) =>
  getBuilds(l as Locale).flatMap((b) =>
    claimEntriesFor(b, l, `${l} build ${b.slug}`),
  ),
);
console.log("entries:", entries.length);

for (const e of entries) {
  for (const line of e.lines) {
    if (!/Claw Mastery (reaches|da Assassin alcan)/.test(line)) continue;
    console.log(`\npath=${e.path}`);
    console.log(`scoped=${JSON.stringify(e.skills)}`);
    console.log(`line=${line.slice(0, 230)}`);
  }
}

const problems = checkDiminishingClaims(entries);
console.log(`\nproblems: ${problems.length}`);
for (const p of problems.slice(0, 4)) console.log(`  [${p.rule}] ${p.path} ${p.skillSlug}`);
void (0 as unknown as Slug);
