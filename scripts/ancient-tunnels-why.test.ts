/**
 * The Ancient Tunnels line on the Avenger page says what the area data says.
 *
 * Ancient Tunnels is the area level 85 zone with *no* cold immunity in its
 * regular population — that absence is the entire reason a Blizzard Sorceress
 * farms it, and `commonImmunities` on the area entity records fire and poison.
 * The pt-BR Avenger page nevertheless shipped "muita imunidade a frio", which
 * inverts the fact and recommends the zone for the opposite of its real reason.
 * English had already been corrected; the translation had not, so the two
 * locales disagreed about the same area in production.
 *
 * This gate is deliberately narrow. It does not police wording across the site,
 * and it does not compare the locales string-for-string — a translation is
 * allowed to read differently from its source. It checks one entry,
 * `ancient-tunnels-hell` on the Avenger, against the `commonImmunities` of the
 * area entity that entry links to, in both locales.
 *
 * Every claim is read out of the farming card *for that one area*, sliced from
 * the prerendered HTML while the tags are still on. A page-wide search would go
 * green on the "fogo" in the immunity plan three sections above — the exact
 * false pass this file exists to prevent. The scoping controls below prove the
 * slice ignores the rest of the page, and the planted control at the bottom
 * puts the retracted sentence back and proves this suite stops it.
 *
 * Requires `npm run build`. Run with `npm run test:tunnels`.
 */
import { execSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve, sep } from "node:path";

import { assertFreshBuild } from "./build-freshness";

import { dictionaryFor } from "../lib/i18n";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { getFarmingArea } from "../lib/registry";

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

const root = assertFreshBuild();

/** The one build and area this file is about. */
const CLASS_SLUG = "paladin";
const BUILD_SLUG = "avenger";
const AREA = "ancient-tunnels";
const DIFFICULTY = "hell";

/** The sentence that shipped, kept verbatim so the control can put it back. */
const RETRACTED_PT =
  "Nível de área 85 com muita imunidade a frio, que é exatamente o tipo de zona para o qual esta build existe.";

const pageFor = (locale: Locale) =>
  join(root, locale, "builds", CLASS_SLUG, `${BUILD_SLUG}.html`);

/** Visible text only: the RSC payload legitimately carries source strings. */
const visible = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&middot;/g, "·")
    .replace(/&#x2011;/g, "-")
    .replace(/\s+/g, " ")
    .trim();

/** A `<section id="…">` block with its tags intact, counting nesting. */
const section = (html: string, id: string): string => {
  const open = html.indexOf(`<section id="${id}"`);
  if (open === -1) return "";
  const re = /<section\b|<\/section>/g;
  re.lastIndex = open;
  let depth = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    if (m[0] === "</section>") {
      depth--;
      if (depth === 0) return html.slice(open, re.lastIndex);
    } else {
      depth++;
    }
  }
  return "";
};

/** Every farming-area link in the farming section, in document order. */
const farmingAnchors = (sec: string, locale: Locale) => {
  const re = new RegExp(`href="/${locale}/farming/([a-z0-9-]+)"`, "g");
  const found: { slug: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(sec)) !== null) found.push({ slug: m[1], index: m.index });
  return found;
};

/**
 * One farming card, sliced from the link that opens it to the link that opens
 * the next one (or the end of the section). The cards are siblings, so the next
 * area link is the boundary — nothing from another card, and nothing from
 * another section, can reach the returned string.
 */
const farmingCard = (html: string, locale: Locale, area: string): string => {
  const sec = section(html, "farming");
  if (!sec) return "";
  const anchors = farmingAnchors(sec, locale);
  const at = anchors.findIndex((a) => a.slug === area);
  if (at === -1) return "";
  const end = at + 1 < anchors.length ? anchors[at + 1].index : sec.length;
  return sec.slice(anchors[at].index, end);
};

/** The justification paragraph inside a farming card, as visible text. */
const cardWhy = (card: string): string => {
  const m = card.match(/<p class="mt-2[^"]*">([\s\S]*?)<\/p>/);
  return m ? visible(m[1]) : "";
};

/** The same page with one farming card's justification replaced. */
const replaceCardWhy = (
  html: string,
  locale: Locale,
  area: string,
  why: string,
): string => {
  const card = farmingCard(html, locale, area);
  if (!card) return html;
  const m = card.match(/<p class="mt-2[^"]*">([\s\S]*?)<\/p>/);
  if (!m) return html;
  // Replacement *functions* throughout: prose containing `$&` or `$1` would
  // otherwise be re-interpreted as a substitution pattern.
  const rebuilt = card.replace(m[0], () => m[0].replace(m[1], () => why));
  return html.replace(card, () => rebuilt);
};

/** The words each locale uses for the two elements the area actually records. */
const ELEMENT_WORDS: Record<Locale, { fire: RegExp; poison: RegExp }> = {
  "en-us": { fire: /\bfire\b/i, poison: /\bpoison\b/i },
  "pt-br": { fire: /\bfogo\b/i, poison: /\bveneno\b/i },
};

/**
 * A cold-immunity claim: the immunity word and the element word inside one
 * clause, in either order and either locale. This runs over a single sentence
 * that this file already located, so it is a reading of one line rather than a
 * rule imposed on the site's prose.
 */
const claimsColdImmunity = (text: string) =>
  /\bimm?un\w*[^.;!?]{0,60}\b(frio|cold)\b/i.test(text) ||
  /\b(frio|cold)\b[^.;!?]{0,60}\bimm?un\w*/i.test(text);

// ---------------------------------------------------------------------------
console.log("\nThe area entity is what the prose has to agree with");
// ---------------------------------------------------------------------------
{
  const area = getFarmingArea("en-us", AREA);
  check(`${AREA} resolves as a farming area`, area !== undefined);
  const immunities = area?.commonImmunities ?? [];
  check(
    `${AREA} records fire among its immunities`,
    immunities.includes("fire"),
    immunities.join(", "),
  );
  check(
    `${AREA} records poison among its immunities`,
    immunities.includes("poison"),
    immunities.join(", "),
  );
  // The claim under repair. If the game data ever changes, this fails first and
  // says so, rather than the prose checks failing for an unexplained reason.
  check(
    `${AREA} records no cold immunity`,
    !immunities.includes("cold"),
    immunities.join(", "),
  );
  check(
    `${AREA} is an area level 85 zone in hell`,
    area?.levels[DIFFICULTY] === 85,
    String(area?.levels[DIFFICULTY]),
  );
}

// ---------------------------------------------------------------------------
console.log("\nThe card really is the ancient-tunnels-hell entry, in both locales");
// ---------------------------------------------------------------------------
const cards: Record<string, string> = {};
for (const locale of LOCALES) {
  const page = pageFor(locale);
  check(`${locale}: the Avenger page was prerendered`, existsSync(page), page);
  if (!existsSync(page)) continue;

  const html = readFileSync(page, "utf8");
  const card = farmingCard(html, locale, AREA);
  cards[locale] = card;

  check(`${locale}: the farming section has an ${AREA} card`, card !== "");
  check(
    `${locale}: the card links to /${locale}/farming/${AREA}`,
    card.includes(`href="/${locale}/farming/${AREA}"`),
  );
  // What ties this card to `ancient-tunnels-hell` rather than to some other
  // difficulty of the same area: the badge the card prints for itself.
  check(
    `${locale}: the card is the ${DIFFICULTY} entry`,
    visible(card).includes(dictionaryFor(locale).difficulty[DIFFICULTY]),
    dictionaryFor(locale).difficulty[DIFFICULTY],
  );
  check(`${locale}: the card carries a justification`, cardWhy(card).length > 20);
}

// ---------------------------------------------------------------------------
console.log("\nWhat that one line says");
// ---------------------------------------------------------------------------
for (const locale of LOCALES) {
  const why = cardWhy(cards[locale] ?? "");
  const words = ELEMENT_WORDS[locale];

  check(
    `${locale}: the Ancient Tunnels line names the fire immunity`,
    words.fire.test(why),
    why,
  );
  check(
    `${locale}: the Ancient Tunnels line names the poison immunity`,
    words.poison.test(why),
    why,
  );
  check(
    `${locale}: the Ancient Tunnels line makes no cold-immunity claim`,
    !claimsColdImmunity(why),
    why,
  );
}

{
  const ptPage = readFileSync(pageFor("pt-br"), "utf8");
  check(
    "pt-br: the retracted cold-immunity sentence is gone from the whole page",
    !visible(ptPage).includes(RETRACTED_PT),
  );
  // The RSC payload carries source strings verbatim, so a stale translation
  // would survive there even after the visible text was fixed.
  check(
    "pt-br: and gone from the flight data too",
    !ptPage.includes("muita imunidade a frio"),
  );
}

// ---------------------------------------------------------------------------
console.log("\nScoping: a mention elsewhere on the page cannot satisfy this");
// ---------------------------------------------------------------------------
{
  const html = readFileSync(pageFor("pt-br"), "utf8");
  const real = cardWhy(farmingCard(html, "pt-br", AREA));
  const words = ELEMENT_WORDS["pt-br"];

  // -- the slice stops at the card boundary ---------------------------------
  const neighbours = farmingAnchors(section(html, "farming"), "pt-br")
    .map((a) => a.slug)
    .filter((s) => s !== AREA);
  const card = cards["pt-br"] ?? "";
  check(
    "the card slice contains no other farming area's link",
    neighbours.every((slug) => !card.includes(`/pt-br/farming/${slug}"`)),
    neighbours.filter((s) => card.includes(`/pt-br/farming/${s}"`)).join(", "),
  );

  // -- a decoy in an adjacent card does not leak in --------------------------
  const decoy = "Zona com fogo e veneno entre as imunidades registradas.";
  const adjacent = replaceCardWhy(html, "pt-br", "pit", decoy);
  check(
    "a fire/poison sentence planted in the neighbouring card is not read as this one",
    cardWhy(farmingCard(adjacent, "pt-br", AREA)) === real,
  );
  check(
    "...and the plant really did land on that neighbouring card",
    cardWhy(farmingCard(adjacent, "pt-br", "pit")) === decoy,
  );

  // -- the decisive control -------------------------------------------------
  // Strip the two words from the Ancient Tunnels line, then put them somewhere
  // else on the page. A page-wide search passes; this file must not.
  const stripped = replaceCardWhy(
    html,
    "pt-br",
    AREA,
    "Nível de área 85 e trajeto curto.",
  );
  const marker = '<section id="farming"';
  const elsewhere = stripped.replace(
    marker,
    () => `<p>Esta build cobre fogo e veneno.</p>${marker}`,
  );
  const strippedWhy = cardWhy(farmingCard(elsewhere, "pt-br", AREA));
  const pageText = visible(elsewhere);

  check(
    "the decoy page does mention fogo and veneno somewhere",
    words.fire.test(pageText) && words.poison.test(pageText),
  );
  check(
    "but the Ancient Tunnels line on that page does not",
    !words.fire.test(strippedWhy) && !words.poison.test(strippedWhy),
    strippedWhy,
  );
  check(
    "...so a page-wide check would pass where this one fails",
    words.fire.test(pageText) && !words.fire.test(strippedWhy),
  );
}

// ---------------------------------------------------------------------------
console.log("\nA negative control: these assertions can fail");
// ---------------------------------------------------------------------------
{
  check(
    "the retracted sentence is recognised as a cold-immunity claim",
    claimsColdImmunity(RETRACTED_PT),
  );
  check(
    "the corrected English line is not",
    !claimsColdImmunity(
      "Area level 85, with fire and poison among its recorded immunities.",
    ),
  );
  check(
    "an English cold-immune claim is recognised too",
    claimsColdImmunity("Area level 85 packed with cold immunes."),
  );
  check(
    "the card slicer reports a missing area rather than guessing",
    farmingCard(readFileSync(pageFor("pt-br"), "utf8"), "pt-br", "no-such-area") === "",
  );
}

// ===========================================================================
// Planted control: put the retracted sentence back, and prove this suite stops
// it.
// ===========================================================================
/*
 * The assertions above are only worth their runtime if they can fail on the
 * regression they name. This restores the shipped pt-BR sentence into a *copy*
 * of the build and runs this same file as a whole process, which must exit
 * non-zero and say which claim broke.
 *
 * `D2R_BUILD_ROOT` makes that possible without a second `next build` and
 * without touching a tracked file: the corrupted pages live in a temporary
 * directory outside the repository, and the repository is only ever read.
 *
 * `D2R_CONTROL` stops the child from re-entering this block, which would
 * recurse without bound.
 */
if (process.env.D2R_CONTROL !== "1") {
  console.log("\nControl: putting the cold-immunity sentence back must fail");

  const repoRoot = resolve(__dirname, "..");
  const gitStatus = () =>
    execSync("git status --porcelain", { cwd: repoRoot, encoding: "utf8" }).trim();
  // Snapshot rather than assert-clean: the claim is "this control changed
  // nothing", which has to hold whether or not the tree was already dirty.
  const before = gitStatus();

  const tmpRoot = realpathSync(tmpdir());
  const dir = mkdtempSync(join(tmpRoot, "d2r-tunnels-control-"));

  try {
    for (const locale of LOCALES) {
      const to = join(dir, locale, "builds", CLASS_SLUG, `${BUILD_SLUG}.html`);
      mkdirSync(dirname(to), { recursive: true });
      copyFileSync(pageFor(locale), to);
    }

    // The mutation: exactly the sentence that was published, back in the one
    // card it was published in. English is left alone, as it was in production.
    const ptPage = join(dir, "pt-br", "builds", CLASS_SLUG, `${BUILD_SLUG}.html`);
    const before1 = readFileSync(ptPage, "utf8");
    const mutated = replaceCardWhy(before1, "pt-br", AREA, RETRACTED_PT);
    check("the planted mutation changed the page", mutated !== before1);
    check(
      "...and it restored the retracted sentence in the right card",
      cardWhy(farmingCard(mutated, "pt-br", AREA)) === RETRACTED_PT,
    );
    writeFileSync(ptPage, mutated, "utf8");

    const run = () => {
      try {
        execSync(`npx tsx ${JSON.stringify(__filename)}`, {
          cwd: repoRoot,
          stdio: "pipe",
          env: { ...process.env, D2R_CONTROL: "1", D2R_BUILD_ROOT: dir },
        });
        return { code: 0, out: "" };
      } catch (e) {
        const err = e as { status?: number; stdout?: Buffer; stderr?: Buffer };
        return {
          code: err.status ?? 1,
          out: `${err.stdout?.toString() ?? ""}${err.stderr?.toString() ?? ""}`,
        };
      }
    };

    const planted = run();
    check("the suite exits non-zero with the sentence back", planted.code !== 0);
    // Exit code alone proves nothing — a broken import is also non-zero.
    check(
      "...and it failed on the cold-immunity claim, not on a crash",
      planted.out.includes(
        "pt-br: the Ancient Tunnels line makes no cold-immunity claim",
      ),
      planted.out.split("\n").find((l) => l.includes("FAIL"))?.slice(0, 120) ??
        "no FAIL line",
    );
    check(
      "...and on the missing fire immunity",
      planted.out.includes("pt-br: the Ancient Tunnels line names the fire immunity"),
    );
    check(
      "...and on the missing poison immunity",
      planted.out.includes("pt-br: the Ancient Tunnels line names the poison immunity"),
    );
    check(
      "...and on the retracted sentence still being on the page",
      planted.out.includes("pt-br: the retracted cold-immunity sentence is gone"),
    );
    // The mutation was pt-BR only, so English must stay green — otherwise this
    // suite is failing for a reason other than the one it names.
    check(
      "...while English stayed green",
      !planted.out.includes("FAIL en-us:"),
      planted.out.split("\n").find((l) => l.includes("FAIL en-us:")) ?? "",
    );
  } finally {
    // Only ever remove the directory this control created, and only after
    // confirming it still resolves inside the OS temp root.
    const resolved = realpathSync(dir);
    const inTemp = resolved.startsWith(tmpRoot + sep);
    const isOurs = basename(resolved).startsWith("d2r-tunnels-control-");
    if (inTemp && isOurs) rmSync(resolved, { recursive: true, force: true });
    check("the temporary directory was inside the OS temp root", inTemp, resolved);
    check("the temporary directory was one this control created", isOurs, basename(resolved));
    check("the temporary directory is gone", !existsSync(dir));
    check("the control left the repository untouched", gitStatus() === before);
  }
}

// ---------------------------------------------------------------------------
console.log(
  failures.length === 0
    ? `\n${passed} checks passed.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
