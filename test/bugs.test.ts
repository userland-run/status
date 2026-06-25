// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import { test } from "node:test";
import assert from "node:assert/strict";
import { join as joinFeatures } from "../generator/src/join";
import { detectTransitions } from "../generator/src/bugs";
import type { StateJson } from "../generator/src/types";
import { miniRegistry, miniSuites, miniFiles, FIXED_NOW } from "./helpers";

// A previous state where everything that's now failing/flaky used to pass.
function prevAllGreen(): StateJson {
  return {
    features: [
      { id: "app.x.partial", cells: { App: { state: "passed" } } },
      { id: "core.b.flaky", cells: { Core: { state: "passed" } } },
      { id: "core.a.one", cells: { Core: { state: "passed" } } },
    ],
  } as unknown as StateJson;
}

test("a green→failed cell is reported as a regression", () => {
  const cur = joinFeatures(miniRegistry(), miniSuites(), miniFiles(), null, FIXED_NOW);
  const bugs = detectTransitions(prevAllGreen(), cur.features, FIXED_NOW);
  const reg = bugs.findings.find((f) => f.id === "app.x.partial");
  assert.ok(reg, "expected a finding for app.x.partial");
  assert.equal(reg!.kind, "regression");
  assert.equal(reg!.layer, "App");
  assert.equal(reg!.trace_url, "https://ci/2");
});

test("a green→flaky cell is reported as flaky", () => {
  const cur = joinFeatures(miniRegistry(), miniSuites(), miniFiles(), null, FIXED_NOW);
  const bugs = detectTransitions(prevAllGreen(), cur.features, FIXED_NOW);
  assert.ok(bugs.findings.some((f) => f.id === "core.b.flaky" && f.kind === "flaky"));
});

test("a failed→passed cell is reported as a recovery", () => {
  const prev = {
    features: [{ id: "core.a.one", cells: { Core: { state: "failed" } } }],
  } as unknown as StateJson;
  const cur = joinFeatures(miniRegistry(), miniSuites(), miniFiles(), null, FIXED_NOW);
  const bugs = detectTransitions(prev, cur.features, FIXED_NOW);
  const rec = bugs.findings.find((f) => f.id === "core.a.one");
  assert.ok(rec, "expected a recovery finding");
  assert.equal(rec!.kind, "recovery");
});

test("no prior state and a passing board yields no findings for passing cells", () => {
  const cur = joinFeatures(miniRegistry(), miniSuites(), miniFiles(), null, FIXED_NOW);
  const bugs = detectTransitions(null, cur.features, FIXED_NOW);
  // app.x.partial is failing now with no prior → still a regression (new failure)
  assert.ok(bugs.findings.every((f) => f.kind !== "recovery"));
  assert.ok(!bugs.findings.some((f) => f.id === "core.a.one")); // passing, no transition
});
