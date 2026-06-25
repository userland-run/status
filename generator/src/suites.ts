// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import { readFileSync } from "node:fs";
import { parse } from "yaml";
import type { Suite } from "./types";

export const suiteKey = (source: string, suite: string): string => `${source}/${suite}`;

/** Load ingest/suites.yaml. */
export function loadSuites(suitesPath: string): Suite[] {
  const doc = parse(readFileSync(suitesPath, "utf8")) as { suites?: Suite[] };
  return doc.suites ?? [];
}

/** Distinct layers, in the order they first appear in suites.yaml. */
export function layersOf(suites: Suite[]): string[] {
  const seen: string[] = [];
  for (const s of suites) if (!seen.includes(s.layer)) seen.push(s.layer);
  return seen;
}
