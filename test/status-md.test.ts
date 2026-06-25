// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import { test } from "node:test";
import assert from "node:assert/strict";
import { join as joinFeatures } from "../generator/src/join";
import { buildState } from "../generator/src/drift";
import { renderStatusMd } from "../generator/src/emitStatusMd";
import { miniRegistry, miniSuites, miniFiles, FIXED_NOW } from "./helpers";

function md() {
  const reg = miniRegistry();
  const suites = miniSuites();
  const files = miniFiles();
  const jr = joinFeatures(reg, suites, files, null, FIXED_NOW);
  return renderStatusMd(buildState(reg, suites, jr, files, [], FIXED_NOW));
}

test("STATUS.md renders the headline, red-now and an area table", () => {
  const out = md();
  assert.match(out, /^# userland\.run — status/);
  assert.match(out, /Generated 2026-06-25T12:00:00\.000Z/);
  assert.match(out, /## Red now/);
  assert.match(out, /`app\.x\.partial`/);
  assert.match(out, /## Shipped but untested \(1\)/);
  assert.match(out, /`core\.a\.two`/);
  assert.match(out, /## Areas/);
  assert.match(out, /\| Core \| 3 \|/);
});

test("STATUS.md is deterministic for fixed inputs", () => {
  assert.equal(md(), md());
});

test("a clean board reports the green states", () => {
  const reg = miniRegistry();
  // drop the failing/flaky/untested noise: a single green feature
  reg.features = [{ id: "core.a.one", title: "One", area: "core", status: "shipped", level: "tested" }];
  const suites = miniSuites();
  const files = miniFiles().slice(0, 1);
  files[0].results = [{ test_id: "t", features: ["core.a.one"], status: "passed" }];
  const jr = joinFeatures(reg, suites, files, null, FIXED_NOW);
  const out = renderStatusMd(buildState(reg, suites, jr, files, [], FIXED_NOW));
  assert.match(out, /Nothing failing\. 🟢/);
  assert.match(out, /every shipped feature has a test\. 🟢/);
});
