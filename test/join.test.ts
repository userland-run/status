// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import { test } from "node:test";
import assert from "node:assert/strict";
import { join as joinFeatures } from "../generator/src/join";
import type { StateJson } from "../generator/src/types";
import { miniRegistry, miniSuites, miniFiles, FIXED_NOW } from "./helpers";

function run(prev: StateJson | null = null) {
  return joinFeatures(miniRegistry(), miniSuites(), miniFiles(), prev, FIXED_NOW);
}

const byId = (r: ReturnType<typeof run>, id: string) => r.features.find((f) => f.id === id)!;

test("a passing test makes a green, tested cell", () => {
  const r = run();
  const one = byId(r, "core.a.one");
  assert.equal(one.tested, true);
  assert.equal(one.green, true);
  assert.equal(one.cells.Core.state, "passed");
  assert.equal(one.cells.Core.counts.passed, 1);
  assert.equal(one.cells.Core.freshness?.age_min, 30);
});

test("an untagged feature is untested", () => {
  const two = byId(run(), "core.a.two");
  assert.equal(two.tested, false);
  assert.equal(two.green, null);
  assert.deepEqual(two.cells, {});
});

test("a failed result wins precedence and is not green", () => {
  const partial = byId(run(), "app.x.partial");
  assert.equal(partial.cells.App.state, "failed");
  assert.equal(partial.green, false);
});

test("a flaky result is flaky, not green, not failed", () => {
  const flaky = byId(run(), "core.b.flaky");
  assert.equal(flaky.cells.Core.state, "flaky");
  assert.equal(flaky.green, false);
});

test("layers come from suites.yaml order", () => {
  assert.deepEqual(run().layers, ["Core", "App", "Extra"]);
});

test("feature ids not in the registry surface as unknownIds", () => {
  const r = run();
  assert.equal(r.unknownIds.length, 1);
  assert.equal(r.unknownIds[0].id, "core.ghost.missing");
  assert.equal(r.unknownIds[0].from, "nano/unit");
});

test("history starts at one entry and is stable for the same run", () => {
  const first = run();
  const state1 = { features: first.features } as unknown as StateJson;
  assert.deepEqual(byId(first, "core.a.one").cells.Core.history, ["passed"]);

  // regenerate with identical inputs (same commit/finished_at) → no new entry
  const second = joinFeatures(miniRegistry(), miniSuites(), miniFiles(), state1, FIXED_NOW);
  assert.deepEqual(byId(second, "core.a.one").cells.Core.history, ["passed"]);
});

test("history appends when a new run (different commit) lands", () => {
  const first = run();
  const state1 = { features: first.features } as unknown as StateJson;

  const files = miniFiles();
  files[0].commit = "c1b"; // a new run of nano/unit
  files[0].finished_at = "2026-06-25T11:45:00Z";
  const second = joinFeatures(miniRegistry(), miniSuites(), files, state1, FIXED_NOW);
  assert.deepEqual(byId(second, "core.a.one").cells.Core.history, ["passed", "passed"]);
});

test("history is capped at five entries", () => {
  let state: StateJson | null = null;
  for (let i = 0; i < 8; i++) {
    const files = miniFiles();
    files[0].commit = `c${i}`;
    files[0].finished_at = `2026-06-25T1${i}:00:00Z`;
    const r = joinFeatures(miniRegistry(), miniSuites(), files, state, FIXED_NOW);
    state = { features: r.features } as unknown as StateJson;
  }
  const one = state!.features.find((f) => f.id === "core.a.one")!;
  assert.equal(one.cells.Core.history.length, 5);
});
