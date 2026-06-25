// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
//
// Entrypoint: load registry + ingested results, JOIN, derive drift, and emit
// data/state.json, data/meta.json and STATUS.md.
//
//   node --import tsx generator/src/generate.ts          # write outputs
//   node --import tsx generator/src/generate.ts --check  # validate + assert in-sync (CI gate)

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join as pjoin } from "node:path";
import { fileURLToPath } from "node:url";
import type { StateJson } from "./types";
import { loadRegistry } from "./loadRegistry";
import { loadSuites } from "./suites";
import { loadResults } from "./loadResults";
import { join } from "./join";
import { buildState } from "./drift";
import { detectTransitions, type BugsJson } from "./bugs";
import { writeState, serializeState } from "./emitState";
import { renderStatusMd } from "./emitStatusMd";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));

/** Strip time-dependent fields so --check compares structure, not wall-clock. */
function normalize(state: StateJson): unknown {
  const clone = JSON.parse(JSON.stringify(state)) as StateJson;
  clone.generated_at = "";
  for (const s of clone.suiteHealth) delete s.age_min;
  for (const f of clone.features) for (const c of Object.values(f.cells)) if (c.freshness) c.freshness.age_min = 0;
  for (const r of clone.redNow) delete r.age_min;
  return clone;
}

export interface RunResult {
  state: StateJson;
  statusMd: string;
  bugs: BugsJson;
  errors: string[];
}

/** Pure-ish core used by both the CLI and the tests (now is injectable). */
export function generate(root: string, now: Date): RunResult {
  const { registry, errors: regErrors } = loadRegistry(pjoin(root, "registry"));
  const suites = loadSuites(pjoin(root, "ingest", "suites.yaml"));
  const { files, malformed, errors: resErrors } = loadResults(pjoin(root, "data", "incoming"));

  const prevPath = pjoin(root, "data", "state.json");
  const prev = existsSync(prevPath) ? (JSON.parse(readFileSync(prevPath, "utf8")) as StateJson) : null;

  const joinResult = join(registry, suites, files, prev, now);
  const state = buildState(registry, suites, joinResult, files, malformed.map((m) => m.path), now);
  const statusMd = renderStatusMd(state);
  const bugs = detectTransitions(prev, joinResult.features, now);

  const errors = [...regErrors, ...resErrors];
  return { state, statusMd, bugs, errors };
}

function main(): void {
  const check = process.argv.includes("--check");
  const { state, statusMd, bugs, errors } = generate(ROOT, new Date());

  if (errors.length) {
    console.error(`✗ ${errors.length} validation error(s):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  if (check) {
    const prevPath = pjoin(ROOT, "data", "state.json");
    if (!existsSync(prevPath)) {
      console.error("✗ --check: data/state.json is missing; run `npm run generate` and commit it.");
      process.exit(1);
    }
    const committed = JSON.parse(readFileSync(prevPath, "utf8")) as StateJson;
    if (JSON.stringify(normalize(committed)) !== JSON.stringify(normalize(state))) {
      console.error("✗ --check: data/state.json is out of date. Run `npm run generate` and commit the result.");
      process.exit(1);
    }
    console.log("✓ registry valid and data/state.json in sync.");
    return;
  }

  writeState(pjoin(ROOT, "data"), state);
  writeFileSync(pjoin(ROOT, "data", "bugs.json"), JSON.stringify(bugs, null, 2) + "\n");
  writeFileSync(pjoin(ROOT, "STATUS.md"), statusMd);

  const h = state.headline;
  const transitions = bugs.findings.length ? ` · ${bugs.findings.length} transition(s)` : "";
  console.log(
    `✓ generated · ${h.tested}/${h.total} tested · ${h.green} green · ` +
      `${h.failingNow} failing · ${h.untestedShipped} untested-shipped · ${h.driftCount} drift${transitions}`,
  );
}

// run only when invoked directly (not when imported by tests)
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();

export { serializeState };
