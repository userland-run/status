// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
//
// Hand-rolled validation. The schemas are closed and simple, so a small typed
// validator beats pulling in ajv. JSON Schema mirrors live under registry/schema
// and contract/ for documentation.

import type { Area, Feature, Level, ResultsFile, TestStatus } from "./types";

const ID_RE = /^[a-z0-9]+(\.[a-z0-9-]+)+$/;
const SINCE_RE = /^[0-9]{4}-[0-9]{2}$/;
const STATUSES = ["planned", "in-progress", "shipped", "partial", "deprecated"];
const TEST_STATUSES: TestStatus[] = ["passed", "failed", "skipped", "flaky"];

/** Validate the parsed registry. Returns a list of human-readable errors. */
export function validateRegistry(areas: Area[], levels: Level[], features: Feature[]): string[] {
  const errors: string[] = [];
  const areaIds = new Set(areas.map((a) => a.id));
  const leveled = new Set(areas.filter((a) => a.leveled).map((a) => a.id));
  const levelSet = new Set<string>(levels);
  const seen = new Map<string, number>();

  for (const a of areas) {
    if (!a.id || !/^[a-z0-9-]+$/.test(a.id)) errors.push(`area "${a.id}": invalid id`);
    if (!a.title) errors.push(`area "${a.id}": missing title`);
    if (!a.owner) errors.push(`area "${a.id}": missing owner`);
    if (!a.repo) errors.push(`area "${a.id}": missing repo`);
  }

  for (const f of features) {
    const where = `feature "${f.id ?? "(no id)"}"`;
    if (!f.id || !ID_RE.test(f.id)) errors.push(`${where}: id must match ${ID_RE}`);
    else seen.set(f.id, (seen.get(f.id) ?? 0) + 1);
    if (!f.title) errors.push(`${where}: missing title`);
    if (!areaIds.has(f.area)) errors.push(`${where}: area "${f.area}" not in areas.yaml`);
    if (!STATUSES.includes(f.status)) errors.push(`${where}: invalid status "${f.status}"`);
    if (f.level !== undefined) {
      if (!leveled.has(f.area)) errors.push(`${where}: area "${f.area}" is not leveled but has level`);
      if (!levelSet.has(f.level)) errors.push(`${where}: invalid level "${f.level}"`);
    }
    if (f.status === "partial" && !f.notes) errors.push(`${where}: status partial requires notes`);
    if (f.since !== undefined && !SINCE_RE.test(f.since)) errors.push(`${where}: since must be YYYY-MM`);
    if (f.id && ID_RE.test(f.id) && f.area && !f.id.startsWith(f.area + "."))
      errors.push(`${where}: id should start with its area "${f.area}."`);
  }

  for (const [id, n] of seen) if (n > 1) errors.push(`feature "${id}": duplicate id (${n}×)`);

  const ids = new Set(features.map((f) => f.id));
  for (const f of features)
    if (f.superseded_by && !ids.has(f.superseded_by))
      errors.push(`feature "${f.id}": superseded_by "${f.superseded_by}" does not resolve`);

  return errors;
}

export interface ResultsValidation {
  file?: ResultsFile;
  errors: string[];
}

/** Validate one parsed userland-results.json object. */
export function validateResultsFile(obj: unknown, label = "results"): ResultsValidation {
  const errors: string[] = [];
  const o = obj as Record<string, unknown>;
  const bad = (m: string) => errors.push(`${label}: ${m}`);

  if (!o || typeof o !== "object") {
    bad("not an object");
    return { errors };
  }
  if (o.contract !== 1) bad(`contract must be 1 (got ${JSON.stringify(o.contract)})`);
  for (const k of ["source", "suite", "commit", "branch", "finished_at"] as const)
    if (typeof o[k] !== "string" || !(o[k] as string).length) bad(`missing/invalid "${k}"`);
  if (typeof o.source === "string" && !/^[a-z0-9-]+$/.test(o.source)) bad(`invalid source "${o.source}"`);
  if (typeof o.suite === "string" && !/^[a-z0-9-]+$/.test(o.suite)) bad(`invalid suite "${o.suite}"`);
  if (!Array.isArray(o.results)) bad("results must be an array");

  if (Array.isArray(o.results)) {
    o.results.forEach((r: unknown, i: number) => {
      const e = r as Record<string, unknown>;
      const at = `${label}.results[${i}]`;
      if (typeof e?.test_id !== "string" || !e.test_id) errors.push(`${at}: missing test_id`);
      if (!Array.isArray(e?.features) || e.features.length === 0) errors.push(`${at}: features must be a non-empty array`);
      else
        e.features.forEach((fid: unknown) => {
          if (typeof fid !== "string" || !ID_RE.test(fid)) errors.push(`${at}: invalid feature id ${JSON.stringify(fid)}`);
        });
      if (!TEST_STATUSES.includes(e?.status as TestStatus)) errors.push(`${at}: invalid status "${String(e?.status)}"`);
    });
  }

  if (errors.length) return { errors };
  return { file: obj as ResultsFile, errors };
}
