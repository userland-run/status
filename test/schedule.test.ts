// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import { test } from "node:test";
import assert from "node:assert/strict";
import { cronMatches, cronDue, dueSchedules, loadSchedules } from "../generator/src/schedule";
import { join } from "node:path";
import { ROOT } from "./helpers";

test("cronMatches handles *, lists, steps and ranges (UTC)", () => {
  const at = (iso: string) => new Date(iso);
  assert.equal(cronMatches("0 3 * * *", at("2026-06-25T03:00:00Z")), true);
  assert.equal(cronMatches("0 3 * * *", at("2026-06-25T04:00:00Z")), false);
  assert.equal(cronMatches("0 */6 * * *", at("2026-06-25T12:00:00Z")), true);
  assert.equal(cronMatches("0 */6 * * *", at("2026-06-25T13:00:00Z")), false);
  assert.equal(cronMatches("0 6,18 * * *", at("2026-06-25T18:00:00Z")), true);
  assert.equal(cronMatches("*/15 * * * *", at("2026-06-25T10:30:00Z")), true);
});

test("cronDue scans the window", () => {
  // window is [now, now+15min)
  assert.equal(cronDue("0 3 * * *", new Date("2026-06-25T02:55:00Z"), 15), true); // covers 03:00
  assert.equal(cronDue("0 3 * * *", new Date("2026-06-25T02:40:00Z"), 15), false); // 02:40–02:55 misses 03:00
  assert.equal(cronDue("0 3 * * *", new Date("2026-06-25T03:00:00Z"), 15), true); // exact match
});

test("dueSchedules filters the real schedules.yaml", () => {
  const schedules = loadSchedules(join(ROOT, "ingest", "schedules.yaml"));
  assert.ok(schedules.length >= 5, "expected the producer schedules");
  // nano cargo-unit is "0 */6 * * *" → due at 06:00
  const due = dueSchedules(schedules, new Date("2026-06-25T06:00:00Z"), 15);
  assert.ok(due.some((s) => s.source === "nano" && s.suite === "cargo-unit"));
});
