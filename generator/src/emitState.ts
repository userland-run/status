// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { StateJson } from "./types";

/** Stable-key JSON so diffs of data/state.json stay readable in git. */
export function serializeState(state: StateJson): string {
  return JSON.stringify(state, null, 2) + "\n";
}

export interface Meta {
  generated_at: string;
  generator_version: number;
  sources: { source: string; suite: string; commit?: string; age_min?: number; health: string }[];
}

export function buildMeta(state: StateJson): Meta {
  return {
    generated_at: state.generated_at,
    generator_version: 1,
    sources: state.suiteHealth.map((s) => ({
      source: s.source,
      suite: s.suite,
      commit: s.commit,
      age_min: s.age_min,
      health: s.health,
    })),
  };
}

export function writeState(dataDir: string, state: StateJson): void {
  writeFileSync(join(dataDir, "state.json"), serializeState(state));
  writeFileSync(join(dataDir, "meta.json"), JSON.stringify(buildMeta(state), null, 2) + "\n");
}
