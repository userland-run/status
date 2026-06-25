// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
//
// Backstop alerting: a suite that has gone silent (no fresh result for >48h) or
// never reported is a broken ingestion path the dashboard can't show by itself.
// Run hourly by freshness.yml; opens/refreshes a GitHub issue per affected suite.
// Needs GH_TOKEN with issues:write on userland-run/status.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join as pjoin } from "node:path";
import type { StateJson, SuiteHealth } from "./types";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const REPO = "userland-run/status";
const LABEL = "suite-health";

/** Suites that warrant an alert. */
export function suitesNeedingAlert(suiteHealth: SuiteHealth[]): SuiteHealth[] {
  return suiteHealth.filter((s) => s.health === "silent" || s.health === "missing");
}

function gh(args: string[]): string {
  return execFileSync("gh", args, { encoding: "utf8" });
}

function openIssueTitles(): Set<string> {
  try {
    const out = gh(["issue", "list", "-R", REPO, "--state", "open", "--label", LABEL, "--json", "title", "--limit", "100"]);
    return new Set((JSON.parse(out) as { title: string }[]).map((i) => i.title));
  } catch {
    return new Set();
  }
}

function main(): void {
  const state = JSON.parse(readFileSync(pjoin(ROOT, "data", "state.json"), "utf8")) as StateJson;
  const affected = suitesNeedingAlert(state.suiteHealth);
  if (affected.length === 0) {
    console.log("✓ all suites fresh.");
    return;
  }
  const existing = openIssueTitles();
  for (const s of affected) {
    const title = `status: suite ${s.source}/${s.suite} is ${s.health}`;
    if (existing.has(title)) {
      console.log(`· already tracked: ${title}`);
      continue;
    }
    const body =
      s.health === "missing"
        ? `The suite **${s.source}/${s.suite}** (${s.layer}) has never published a result to the status hub. Wire its CI to emit \`userland-results.json\` and call the \`publish-results\` action.`
        : `The suite **${s.source}/${s.suite}** (${s.layer}) last published ${s.age_min} min ago (> 48h). Its ingestion path may be broken — check the producer's workflow.`;
    try {
      gh(["issue", "create", "-R", REPO, "--title", title, "--body", body, "--label", LABEL]);
      console.log(`✓ opened: ${title}`);
    } catch (e) {
      console.error(`✗ could not open issue for ${title}: ${(e as Error).message}`);
    }
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
