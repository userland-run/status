// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
//
// Derive the monitoring views from the joined features: headline tiles, area
// roll-ups, suite health, the "red now" list, shipped-but-untested, and drift.

import type {
  AreaRollup,
  DriftReport,
  FeatureState,
  Headline,
  RedItem,
  Registry,
  ResultsFile,
  StateJson,
  Status,
  SuiteHealth,
  Suite,
} from "./types";
import type { JoinResult } from "./join";
import { suiteKey } from "./suites";

const STALE_MONTHS = 2; // in-progress longer than ~60 days is drift
const SILENT_MIN = 48 * 60; // a suite with no fresh result for 48h is "silent"

function monthsSince(since: string | undefined, now: Date): number | undefined {
  if (!since) return undefined;
  const m = /^([0-9]{4})-([0-9]{2})$/.exec(since);
  if (!m) return undefined;
  return (now.getFullYear() - Number(m[1])) * 12 + (now.getMonth() + 1 - Number(m[2]));
}

const EMPTY_STATUS: Record<Status, number> = {
  planned: 0,
  "in-progress": 0,
  shipped: 0,
  partial: 0,
  deprecated: 0,
};

export function suiteHealth(
  suites: Suite[],
  files: ResultsFile[],
  malformedPaths: string[],
  now: Date,
): SuiteHealth[] {
  const byKey = new Map<string, ResultsFile>();
  for (const f of files) byKey.set(suiteKey(f.source, f.suite), f);

  const known = new Set(suites.map((s) => suiteKey(s.source, s.suite)));
  const rows: SuiteHealth[] = suites.map((s) => {
    const file = byKey.get(suiteKey(s.source, s.suite));
    if (!file) return { ...s, present: false, health: "missing" };
    const age = Math.max(0, Math.floor((now.getTime() - Date.parse(file.finished_at)) / 60000));
    const total = file.results.length || 1;
    const passed = file.results.filter((r) => r.status === "passed").length;
    return {
      ...s,
      present: true,
      commit: file.commit,
      finished_at: file.finished_at,
      age_min: age,
      passRate: passed / total,
      health: age > SILENT_MIN ? "silent" : "ok",
    };
  });

  // suites present in data/incoming but not declared in suites.yaml
  for (const f of files) {
    const k = suiteKey(f.source, f.suite);
    if (!known.has(k))
      rows.push({ source: f.source, suite: f.suite, layer: "?", title: "(undeclared suite)", present: true, health: "unknown" });
  }
  // note malformed files via a synthetic unknown row so they never read as green
  for (const p of malformedPaths) {
    const name = p.split("/").pop() ?? p;
    rows.push({ source: name, suite: "malformed", layer: "?", title: `(malformed: ${name})`, present: true, health: "unknown" });
  }
  return rows;
}

export function areaRollups(registry: Registry, features: FeatureState[]): AreaRollup[] {
  return registry.areas.map((a) => {
    const fs = features.filter((f) => f.area === a.id);
    const byStatus = { ...EMPTY_STATUS };
    for (const f of fs) byStatus[f.status]++;
    const shipped = byStatus.shipped;
    const tested = fs.filter((f) => f.tested).length;
    const green = fs.filter((f) => f.green === true).length;
    return {
      id: a.id,
      title: a.title,
      total: fs.length,
      byStatus,
      shippedPct: fs.length ? shipped / fs.length : 0,
      greenPct: tested ? green / tested : 0,
      tested,
      green,
    };
  });
}

export function redNow(features: FeatureState[]): RedItem[] {
  const items: RedItem[] = [];
  for (const f of features) {
    const failing = Object.values(f.cells).filter((c) => c.state === "failed");
    if (failing.length === 0) continue;
    const newest = failing.reduce((a, b) => ((b.freshness?.age_min ?? 0) < (a.freshness?.age_min ?? 0) ? b : a));
    const failingTest = newest.tests.find((t) => t.status === "failed");
    items.push({
      id: f.id,
      title: f.title,
      area: f.area,
      layers: failing.map((c) => c.layer),
      commit: newest.freshness?.commit,
      age_min: newest.freshness?.age_min,
      trace_url: failingTest?.trace_url,
    });
  }
  return items;
}

export function driftReport(registry: Registry, join: JoinResult, now: Date): DriftReport {
  const { features, unknownIds, testedIds } = join;
  return {
    unknownIds,
    staleInProgress: features
      .filter((f) => f.status === "in-progress")
      .map((f) => ({ id: f.id, title: f.title, since: f.since, months: monthsSince(f.since, now) }))
      .filter((x) => (x.months ?? 0) > STALE_MONTHS),
    partialNoNotes: registry.features.filter((f) => f.status === "partial" && !f.notes).map((f) => ({ id: f.id, title: f.title })),
    superseded: registry.features
      .filter((f) => f.superseded_by && testedIds.has(f.id))
      .map((f) => ({ id: f.id, title: f.title, superseded_by: f.superseded_by as string })),
  };
}

export function headline(features: FeatureState[], red: RedItem[], drift: DriftReport): Headline {
  const total = features.length;
  const shipped = features.filter((f) => f.status === "shipped").length;
  const tested = features.filter((f) => f.tested).length;
  const green = features.filter((f) => f.green === true).length;
  const untestedShipped = features.filter((f) => f.status === "shipped" && !f.tested).length;
  const driftCount =
    drift.unknownIds.length + drift.staleInProgress.length + drift.partialNoNotes.length + drift.superseded.length;
  return {
    total,
    shipped,
    shippedPct: total ? shipped / total : 0,
    tested,
    green,
    greenPct: tested ? green / tested : 0,
    failingNow: red.length,
    untestedShipped,
    driftCount,
  };
}

/** Assemble the complete state.json from the join + registry + ingest inputs. */
export function buildState(
  registry: Registry,
  suites: Suite[],
  joinResult: JoinResult,
  files: ResultsFile[],
  malformedPaths: string[],
  now: Date,
): StateJson {
  const red = redNow(joinResult.features);
  const drift = driftReport(registry, joinResult, now);
  return {
    contract: 1,
    generated_at: now.toISOString(),
    layers: joinResult.layers,
    headline: headline(joinResult.features, red, drift),
    areaRollups: areaRollups(registry, joinResult.features),
    suiteHealth: suiteHealth(suites, files, malformedPaths, now),
    redNow: red,
    shippedUntested: joinResult.features
      .filter((f) => f.status === "shipped" && !f.tested)
      .map((f) => ({ id: f.id, title: f.title, area: f.area })),
    drift,
    features: joinResult.features,
  };
}
