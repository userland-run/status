// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import { test } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { loadRegistry } from "../generator/src/loadRegistry";
import { validateRegistry } from "../generator/src/validate";
import { ROOT } from "./helpers";

test("the real registry loads and validates clean", () => {
  const { registry, errors } = loadRegistry(join(ROOT, "registry"));
  assert.deepEqual(errors, [], `registry has validation errors:\n${errors.join("\n")}`);
  assert.ok(registry.features.length > 50, "expected a substantial seed registry");
  assert.ok(registry.areas.length >= 6, "expected the six userland.run areas");
});

test("feature ids are unique across all files", () => {
  const { registry } = loadRegistry(join(ROOT, "registry"));
  const ids = registry.features.map((f) => f.id);
  assert.equal(new Set(ids).size, ids.length, "duplicate feature ids");
});

test("every feature references a declared area and starts with it", () => {
  const { registry } = loadRegistry(join(ROOT, "registry"));
  const areaIds = new Set(registry.areas.map((a) => a.id));
  for (const f of registry.features) {
    assert.ok(areaIds.has(f.area), `${f.id}: area ${f.area} not declared`);
    assert.ok(f.id.startsWith(f.area + "."), `${f.id}: id should start with area ${f.area}.`);
  }
});

test("partial features carry notes; levels only on leveled areas", () => {
  const { registry } = loadRegistry(join(ROOT, "registry"));
  const leveled = new Set(registry.areas.filter((a) => a.leveled).map((a) => a.id));
  for (const f of registry.features) {
    if (f.status === "partial") assert.ok(f.notes && f.notes.length > 0, `${f.id}: partial needs notes`);
    if (f.level !== undefined) assert.ok(leveled.has(f.area), `${f.id}: level on non-leveled area`);
  }
});

test("validateRegistry rejects a duplicate id and an unknown area", () => {
  const errors = validateRegistry(
    [{ id: "core", title: "C", owner: "o", repo: "r", leveled: true }],
    ["specified", "tested"],
    [
      { id: "core.a.x", title: "X", area: "core", status: "shipped" },
      { id: "core.a.x", title: "X dup", area: "core", status: "shipped" },
      { id: "nope.a.y", title: "Y", area: "ghost", status: "shipped" },
    ],
  );
  assert.ok(errors.some((e) => e.includes("duplicate id")));
  assert.ok(errors.some((e) => e.includes('area "ghost"')));
});
