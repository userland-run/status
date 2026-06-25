// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
//
// Fire a workflow_dispatch at each producer suite whose cron is due. Run by
// scheduler.yml every 15 min. Needs GH_TOKEN with actions:write on the producers.
//
//   node --import tsx generator/src/scheduleTick.ts [--window 15] [--dry-run]

import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join as pjoin } from "node:path";
import { loadSchedules, dueSchedules } from "./schedule";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const windowMin = Number(arg("window", "15"));
const dryRun = process.argv.includes("--dry-run");
const now = new Date();

const schedules = loadSchedules(pjoin(ROOT, "ingest", "schedules.yaml"));
const due = dueSchedules(schedules, now, windowMin);

if (due.length === 0) {
  console.log(`No suites due in the next ${windowMin} min (${now.toISOString()}).`);
  process.exit(0);
}

for (const s of due) {
  const label = `${s.source}/${s.suite} → ${s.repo} ${s.workflow}`;
  if (dryRun) {
    console.log(`[dry-run] would dispatch ${label}`);
    continue;
  }
  try {
    execFileSync("gh", ["workflow", "run", s.workflow, "-R", s.repo, "--ref", "main"], { stdio: "inherit" });
    console.log(`✓ dispatched ${label}`);
  } catch (e) {
    console.error(`✗ failed to dispatch ${label}: ${(e as Error).message}`);
  }
}
