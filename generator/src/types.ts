// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

/** The lifecycle status of a registry feature. */
export type Status = "planned" | "in-progress" | "shipped" | "partial" | "deprecated";

/** The conformance ladder, for areas with `leveled: true`. */
export type Level = "specified" | "implemented" | "tested" | "conformant";

/** A single test outcome as reported by a producer. */
export type TestStatus = "passed" | "failed" | "skipped" | "flaky";

/** The rolled-up state of a (feature, layer) matrix cell. */
export type CellState = TestStatus | "untested";

export interface Area {
  id: string;
  title: string;
  owner: string;
  repo: string;
  leveled?: boolean;
  blurb?: string;
}

export interface Feature {
  id: string;
  title: string;
  area: string;
  status: Status;
  level?: Level;
  syscall?: number;
  spec?: string;
  since?: string;
  notes?: string;
  superseded_by?: string | null;
}

export interface Registry {
  areas: Area[];
  levels: Level[];
  features: Feature[];
}

export interface Suite {
  source: string;
  suite: string;
  layer: string;
  title: string;
}

export interface ResultEntry {
  test_id: string;
  features: string[];
  status: TestStatus;
  duration_ms?: number;
  retries?: number;
  trace_url?: string;
}

export interface ResultsFile {
  contract: 1;
  source: string;
  suite: string;
  commit: string;
  branch: string;
  run_id?: string;
  finished_at: string;
  results: ResultEntry[];
  /** Absolute path the file was read from (injected at load). */
  _path?: string;
}

// ── Joined state model (data/state.json) ─────────────────────────────────────

export interface Counts {
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
}

export interface CellTest {
  test_id: string;
  status: TestStatus;
  duration_ms?: number;
  trace_url?: string;
}

export interface Cell {
  layer: string;
  state: CellState;
  counts: Counts;
  /** Last up-to-5 per-run rolled-up states, oldest first. */
  history: CellState[];
  /** Identity of the run that last contributed, for history de-duplication. */
  lastRun?: string;
  freshness?: { source: string; suite: string; commit: string; finished_at: string; age_min: number };
  tests: CellTest[];
}

export interface FeatureState extends Feature {
  /** Cells keyed by layer name (only layers that have results). */
  cells: Record<string, Cell>;
  tested: boolean;
  /** true if tested and every tested cell passed; null if untested. */
  green: boolean | null;
}

export interface SuiteHealth {
  source: string;
  suite: string;
  layer: string;
  title: string;
  present: boolean;
  commit?: string;
  finished_at?: string;
  age_min?: number;
  passRate?: number;
  /** ok | silent (>48h) | missing | unknown (not in suites.yaml) */
  health: "ok" | "silent" | "missing" | "unknown";
}

export interface AreaRollup {
  id: string;
  title: string;
  total: number;
  byStatus: Record<Status, number>;
  shippedPct: number;
  greenPct: number;
  tested: number;
  green: number;
}

export interface RedItem {
  id: string;
  title: string;
  area: string;
  layers: string[];
  commit?: string;
  age_min?: number;
  trace_url?: string;
}

export interface DriftReport {
  unknownIds: { id: string; from: string }[];
  staleInProgress: { id: string; title: string; since?: string; months?: number }[];
  partialNoNotes: { id: string; title: string }[];
  superseded: { id: string; title: string; superseded_by: string }[];
}

export interface Headline {
  total: number;
  shipped: number;
  shippedPct: number;
  tested: number;
  green: number;
  greenPct: number;
  failingNow: number;
  untestedShipped: number;
  driftCount: number;
}

export interface StateJson {
  contract: 1;
  generated_at: string;
  layers: string[];
  headline: Headline;
  areaRollups: AreaRollup[];
  suiteHealth: SuiteHealth[];
  redNow: RedItem[];
  shippedUntested: { id: string; title: string; area: string }[];
  drift: DriftReport;
  features: FeatureState[];
}
