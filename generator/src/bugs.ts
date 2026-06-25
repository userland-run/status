// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
//
// Failure-transition detection. By diffing the previous state.json against the
// freshly joined features we surface regressions (green → failed) and recoveries
// (failed → passed). The result (data/bugs.json) is the foundation for auto-filing
// issues; v1 records the transitions and is consumed by the dashboard + freshness.

import type { CellState, FeatureState, StateJson } from "./types";

export type FindingKind = "regression" | "recovery" | "flaky";

export interface Finding {
  /** stable fingerprint: source/suite/feature, so re-reports update not duplicate */
  fingerprint: string;
  kind: FindingKind;
  id: string;
  title: string;
  area: string;
  layer: string;
  commit?: string;
  trace_url?: string;
}

export interface BugsJson {
  contract: 1;
  generated_at: string;
  findings: Finding[];
}

function cellStates(f: { cells: Record<string, { state: CellState; freshness?: { commit: string }; tests: { status: string; trace_url?: string }[] }> }) {
  return f.cells;
}

/** Diff prev → current per (feature, layer) and classify transitions. */
export function detectTransitions(prev: StateJson | null, current: FeatureState[], now: Date): BugsJson {
  const findings: Finding[] = [];
  const prevById = new Map((prev?.features ?? []).map((f) => [f.id, f]));

  for (const f of current) {
    const before = prevById.get(f.id);
    const cur = cellStates(f);
    for (const [layer, cell] of Object.entries(cur)) {
      const prevCell = before?.cells?.[layer];
      const prevState: CellState | undefined = prevCell?.state;
      const fp = `${layer}/${f.id}`;
      const traceFail = cell.tests.find((t) => t.status === "failed")?.trace_url;

      // green/new → failed = regression
      if (cell.state === "failed" && prevState !== "failed") {
        findings.push({ fingerprint: fp, kind: "regression", id: f.id, title: f.title, area: f.area, layer, commit: cell.freshness?.commit, trace_url: traceFail });
      }
      // failed → passed = recovery
      else if (cell.state === "passed" && prevState === "failed") {
        findings.push({ fingerprint: fp, kind: "recovery", id: f.id, title: f.title, area: f.area, layer, commit: cell.freshness?.commit });
      }
      // newly flaky
      else if (cell.state === "flaky" && prevState !== "flaky") {
        findings.push({ fingerprint: fp, kind: "flaky", id: f.id, title: f.title, area: f.area, layer, commit: cell.freshness?.commit });
      }
    }
  }

  return { contract: 1, generated_at: now.toISOString(), findings };
}
