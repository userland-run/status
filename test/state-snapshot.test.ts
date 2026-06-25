// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
//
// End-to-end: run the real generator against the repo and assert structural
// invariants. Deterministic via an injected clock.

import { test } from "node:test";
import assert from "node:assert/strict";
import { loadRegistry } from "../generator/src/loadRegistry";
import { generate } from "../generator/src/generate";
import { join } from "node:path";
import { ROOT, FIXED_NOW } from "./helpers";

test("generate() over the real repo produces a clean, complete state", () => {
  const { state, errors } = generate(ROOT, FIXED_NOW);
  assert.deepEqual(errors, [], errors.join("\n"));

  const { registry } = loadRegistry(join(ROOT, "registry"));
  assert.equal(state.headline.total, registry.features.length, "every feature appears in state");
  assert.equal(state.features.length, registry.features.length);
  assert.equal(state.generated_at, "2026-06-25T12:00:00.000Z");

  // the seed producers tag real features, so the board is partly green
  assert.ok(state.headline.tested > 0, "seed data should make some features tested");
  assert.ok(state.headline.green > 0, "seed data should make some features green");
  // and the many untagged syscalls should surface as shipped-but-untested
  assert.ok(state.headline.untestedShipped > 0);
});

test("generate() is deterministic for a fixed clock", () => {
  const a = generate(ROOT, FIXED_NOW);
  const b = generate(ROOT, FIXED_NOW);
  assert.equal(JSON.stringify(a.state), JSON.stringify(b.state));
  assert.equal(a.statusMd, b.statusMd);
});

test("no seed result references an unknown feature id", () => {
  const { state } = generate(ROOT, FIXED_NOW);
  assert.deepEqual(state.drift.unknownIds, [], `unknown ids: ${JSON.stringify(state.drift.unknownIds)}`);
});
