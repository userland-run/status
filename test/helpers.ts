// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
//
// Shared in-memory fixtures for the join/drift tests. Not a *.test.ts, so the
// runner does not execute it directly.

import { fileURLToPath } from "node:url";
import type { Registry, ResultsFile, Suite } from "../generator/src/types";

/** Repo root (status/), for tests that load the real registry. */
export const ROOT = fileURLToPath(new URL("../", import.meta.url));

/** A fixed clock so age/staleness/snapshots are deterministic. */
export const FIXED_NOW = new Date("2026-06-25T12:00:00Z");

export function miniRegistry(): Registry {
  return {
    areas: [
      { id: "core", title: "Core", owner: "nano", repo: "x/nano", leveled: true },
      { id: "app", title: "App", owner: "app", repo: "x/app" },
    ],
    levels: ["specified", "implemented", "tested", "conformant"],
    features: [
      { id: "core.a.one", title: "One", area: "core", status: "shipped", level: "tested" },
      { id: "core.a.two", title: "Two", area: "core", status: "shipped" },
      { id: "core.b.flaky", title: "Flaky", area: "core", status: "shipped" },
      { id: "app.x.partial", title: "Partial", area: "app", status: "partial", notes: "wip" },
      { id: "app.x.inprog", title: "InProg", area: "app", status: "in-progress", since: "2026-01" },
      { id: "app.y.super", title: "Super", area: "app", status: "deprecated", superseded_by: "app.x.partial" },
    ],
  };
}

export function miniSuites(): Suite[] {
  return [
    { source: "nano", suite: "unit", layer: "Core", title: "core unit" },
    { source: "app", suite: "e2e", layer: "App", title: "app e2e" },
    { source: "extra", suite: "none", layer: "Extra", title: "never publishes" },
  ];
}

export function miniFiles(): ResultsFile[] {
  return [
    {
      contract: 1,
      source: "nano",
      suite: "unit",
      commit: "c1",
      branch: "main",
      run_id: "1",
      finished_at: "2026-06-25T11:30:00Z", // 30 min old → ok
      results: [
        { test_id: "t_one", features: ["core.a.one"], status: "passed", duration_ms: 5 },
        { test_id: "t_flaky", features: ["core.b.flaky"], status: "flaky", retries: 1 },
        { test_id: "t_ghost", features: ["core.ghost.missing"], status: "passed" },
      ],
    },
    {
      contract: 1,
      source: "app",
      suite: "e2e",
      commit: "c2",
      branch: "main",
      run_id: "2",
      finished_at: "2026-06-22T12:00:00Z", // 3 days old → silent
      results: [
        { test_id: "t_partial", features: ["app.x.partial"], status: "failed", trace_url: "https://ci/2" },
        { test_id: "t_super", features: ["app.y.super"], status: "passed" },
      ],
    },
  ];
}
