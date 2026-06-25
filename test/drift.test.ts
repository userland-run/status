// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import { test } from "node:test";
import assert from "node:assert/strict";
import { join as joinFeatures } from "../generator/src/join";
import { buildState, driftReport } from "../generator/src/drift";
import type { Registry } from "../generator/src/types";
import { miniRegistry, miniSuites, miniFiles, FIXED_NOW } from "./helpers";

function build() {
  const reg = miniRegistry();
  const suites = miniSuites();
  const files = miniFiles();
  const jr = joinFeatures(reg, suites, files, null, FIXED_NOW);
  return { reg, suites, files, jr, state: buildState(reg, suites, jr, files, [], FIXED_NOW) };
}

test("red-now lists the failing feature with its trace and layer", () => {
  const { state } = build();
  assert.equal(state.redNow.length, 1);
  assert.equal(state.redNow[0].id, "app.x.partial");
  assert.deepEqual(state.redNow[0].layers, ["App"]);
  assert.equal(state.redNow[0].trace_url, "https://ci/2");
});

test("shipped-but-untested catches a shipped feature with no test", () => {
  const { state } = build();
  const ids = state.shippedUntested.map((s) => s.id);
  assert.ok(ids.includes("core.a.two"));
  assert.ok(!ids.includes("core.a.one"));
});

test("drift: unknown ids, stale in-progress, and superseded-but-tested", () => {
  const { state } = build();
  assert.equal(state.drift.unknownIds[0].id, "core.ghost.missing");
  assert.ok(state.drift.staleInProgress.some((s) => s.id === "app.x.inprog"));
  assert.ok(state.drift.superseded.some((s) => s.id === "app.y.super"));
});

test("drift: partial without notes is flagged", () => {
  const reg: Registry = {
    areas: [{ id: "app", title: "App", owner: "o", repo: "r" }],
    levels: [],
    features: [{ id: "app.x.nonote", title: "No note", area: "app", status: "partial" }],
  };
  const jr = joinFeatures(reg, [], [], null, FIXED_NOW);
  const d = driftReport(reg, jr, FIXED_NOW);
  assert.ok(d.partialNoNotes.some((p) => p.id === "app.x.nonote"));
});

test("suite health: ok, silent (>48h), and missing", () => {
  const { state } = build();
  const health = Object.fromEntries(state.suiteHealth.map((s) => [`${s.source}/${s.suite}`, s.health]));
  assert.equal(health["nano/unit"], "ok");
  assert.equal(health["app/e2e"], "silent");
  assert.equal(health["extra/none"], "missing");
});

test("area roll-ups count statuses and green ratios", () => {
  const { state } = build();
  const core = state.areaRollups.find((a) => a.id === "core")!;
  assert.equal(core.total, 3);
  assert.equal(core.byStatus.shipped, 3);
  assert.equal(core.tested, 2); // core.a.one + core.b.flaky
  assert.equal(core.green, 1); // only core.a.one
});

test("headline aggregates the whole board", () => {
  const { state } = build();
  const h = state.headline;
  assert.equal(h.total, 6);
  assert.equal(h.failingNow, 1);
  assert.equal(h.untestedShipped, 1);
  assert.ok(h.driftCount >= 3);
});
