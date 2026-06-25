// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { validateResultsFile } from "../generator/src/validate";
import { ROOT } from "./helpers";

test("the SAMPLE contract file validates", () => {
  const sample = JSON.parse(readFileSync(join(ROOT, "contract", "SAMPLE.json"), "utf8"));
  const { file, errors } = validateResultsFile(sample);
  assert.deepEqual(errors, []);
  assert.ok(file, "expected a parsed file");
});

test("every committed data/incoming file validates", () => {
  // The seed producer files must always satisfy the contract.
  for (const name of [
    "nano.cargo-unit.json",
    "nano.node-harness.json",
    "sdk.sdk-unit.json",
    "terminal.playwright-e2e.json",
    "catalog.catalog-conformance.json",
  ]) {
    const obj = JSON.parse(readFileSync(join(ROOT, "data", "incoming", name), "utf8"));
    const { errors } = validateResultsFile(obj, name);
    assert.deepEqual(errors, [], `${name}:\n${errors.join("\n")}`);
  }
});

test("a wrong contract version is rejected", () => {
  const { errors } = validateResultsFile({ contract: 2, source: "x", suite: "y", commit: "c", branch: "main", finished_at: "2026-01-01T00:00:00Z", results: [] });
  assert.ok(errors.some((e) => e.includes("contract must be 1")));
});

test("missing features array is rejected", () => {
  const { errors } = validateResultsFile({
    contract: 1,
    source: "x",
    suite: "y",
    commit: "c",
    branch: "main",
    finished_at: "2026-01-01T00:00:00Z",
    results: [{ test_id: "t", status: "passed" }],
  });
  assert.ok(errors.some((e) => e.includes("features must be a non-empty array")));
});

test("a bad status enum and a malformed feature id are rejected", () => {
  const { errors } = validateResultsFile({
    contract: 1,
    source: "x",
    suite: "y",
    commit: "c",
    branch: "main",
    finished_at: "2026-01-01T00:00:00Z",
    results: [{ test_id: "t", features: ["NotAnId"], status: "won" }],
  });
  assert.ok(errors.some((e) => e.includes("invalid status")));
  assert.ok(errors.some((e) => e.includes("invalid feature id")));
});
