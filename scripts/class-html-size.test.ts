/**
 * The HTML budget per class page (R-TREE-17, R-TREE-19).
 *
 * The spike of 2026-09-08 set the ceiling at 368,640 bytes (360 KiB) per
 * class-page document, measured as the size of the prerendered file in
 * `.next/server/app`, undecoded and uncompressed — the same method that
 * produced the 312 KB baseline it argues from. The alert line, 348,160 bytes
 * (340 KiB), is a warning, not a failure: it is where the phase's stop rule
 * in plan §3.4 starts to apply, and the report needs the number, not a red.
 *
 * Every one of the sixteen documents is printed, so the report can carry the
 * table; the control at the end runs the same judgement under a ceiling of
 * one byte and must fail, so a gate that stopped reading sizes could not stay
 * green.
 *
 * Requires `npm run build` to have run. Run with `npm run test:class-html-size`.
 */
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";

import { LOCALES } from "../lib/i18n/config";
import { CLASSES_WITH_SKILL_PAGES } from "../lib/skills";

/** Spike §11.5: 360 KiB ceiling, 340 KiB alert. */
export const HTML_CEILING = 368_640;
export const HTML_ALERT = 348_160;

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

const bytes = (n: number) => n.toLocaleString("en-US");

/** One judgement, used for the real ceiling and for the control. */
function judge(name: string, size: number, ceiling: number): { ok: boolean; detail: string } {
  const slack = ceiling - size;
  return {
    ok: size <= ceiling,
    detail: `${name}: ${bytes(size)} bytes, ceiling ${bytes(ceiling)}, ${slack < 0 ? `over by ${bytes(-slack)}` : `slack ${bytes(slack)}`}`,
  };
}

// ===========================================================================
console.log("\nClass-page documents against the ceiling");
// ===========================================================================

const root = assertFreshBuild();

const documents = LOCALES.flatMap((locale) => CLASSES_WITH_SKILL_PAGES.map((cls) => ({ name: `${locale}/${cls}`, path: join(root, locale, "classes", `${cls}.html`) })));
check("sixteen documents: eight classes in two locales", documents.length === 16, `${documents.length}`);

const sizes: { name: string; size: number }[] = [];
for (const doc of documents) {
  if (!existsSync(doc.path)) {
    check(`${doc.name}: prerendered HTML exists`, false, doc.path);
    continue;
  }
  const size = statSync(doc.path).size;
  sizes.push({ name: doc.name, size });
  const verdict = judge(doc.name, size, HTML_CEILING);
  console.log(`       ${doc.name.padEnd(22)} ${bytes(size).padStart(9)} bytes  (${(size / 1024).toFixed(1)} KiB)`);
  if (size >= HTML_ALERT) {
    console.log(`  WARNING ${doc.name} is at or above the alert line: ${bytes(size)} ≥ ${bytes(HTML_ALERT)} (${bytes(HTML_CEILING - size)} below the ceiling)`);
  }
  check(`${doc.name} ≤ ${bytes(HTML_CEILING)} bytes`, verdict.ok, verdict.detail);
}

if (sizes.length > 0) {
  const worst = sizes.reduce((a, b) => (b.size > a.size ? b : a));
  console.log(`\n  worst document: ${worst.name} at ${bytes(worst.size)} bytes; ${bytes(HTML_CEILING - worst.size)} below the ceiling, ${sizes.filter((s) => s.size >= HTML_ALERT).length} at or above the alert`);
  check("every document was measured as a positive number of bytes", sizes.length === 16 && sizes.every((s) => s.size > 0));
}

// ===========================================================================
console.log("\nControl: the judgement can fail");
// ===========================================================================

{
  const failing = sizes.map((s) => judge(s.name, s.size, 1)).filter((v) => !v.ok);
  check("under a ceiling of one byte every document fails the same judgement", sizes.length > 0 && failing.length === sizes.length, `${failing.length} of ${sizes.length}`);
  check("and the failure names the document, the size and the overrun",
    failing.every((v) => /: [\d,]+ bytes, ceiling 1, over by [\d,]+$/.test(v.detail)), failing[0]?.detail);
  const alert = judge("synthetic", HTML_ALERT, HTML_CEILING);
  check("a document exactly at the alert line still passes the ceiling with the published slack",
    alert.ok && alert.detail.endsWith(`slack ${bytes(HTML_CEILING - HTML_ALERT)}`), alert.detail);
  check("the alert line sits below the ceiling", HTML_ALERT < HTML_CEILING);
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
