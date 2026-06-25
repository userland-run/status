// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { ResultsFile } from "./types";
import { validateResultsFile } from "./validate";

export interface LoadedResults {
  files: ResultsFile[];
  /** Files that failed validation (malformed) — surfaced in suite health. */
  malformed: { path: string; errors: string[] }[];
  errors: string[];
}

/** Load and validate every data/incoming/*.json results file. */
export function loadResults(incomingDir: string): LoadedResults {
  const files: ResultsFile[] = [];
  const malformed: { path: string; errors: string[] }[] = [];
  const errors: string[] = [];

  if (!existsSync(incomingDir)) return { files, malformed, errors };

  for (const name of readdirSync(incomingDir).sort()) {
    if (!name.endsWith(".json")) continue;
    const path = join(incomingDir, name);
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(path, "utf8"));
    } catch (e) {
      malformed.push({ path, errors: [`invalid JSON: ${(e as Error).message}`] });
      continue;
    }
    const { file, errors: errs } = validateResultsFile(parsed, name);
    if (file) {
      file._path = path;
      files.push(file);
    } else {
      malformed.push({ path, errors: errs });
      errors.push(...errs);
    }
  }

  return { files, malformed, errors };
}
