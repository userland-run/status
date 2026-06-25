// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import type { Area, Feature, Level, Registry } from "./types";
import { validateRegistry } from "./validate";

export interface LoadedRegistry {
  registry: Registry;
  errors: string[];
}

/** Load areas.yaml + features/*.yaml from a registry directory and validate. */
export function loadRegistry(registryDir: string): LoadedRegistry {
  const errors: string[] = [];

  const areasDoc = parse(readFileSync(join(registryDir, "areas.yaml"), "utf8")) as {
    areas?: Area[];
    levels?: Level[];
  };
  const areas = areasDoc.areas ?? [];
  const levels = areasDoc.levels ?? [];

  const featuresDir = join(registryDir, "features");
  const features: Feature[] = [];
  for (const name of readdirSync(featuresDir).sort()) {
    if (!name.endsWith(".yaml") && !name.endsWith(".yml")) continue;
    const doc = parse(readFileSync(join(featuresDir, name), "utf8"));
    if (!Array.isArray(doc)) {
      errors.push(`features/${name}: expected a top-level list`);
      continue;
    }
    for (const f of doc) features.push(f as Feature);
  }

  errors.push(...validateRegistry(areas, levels, features));
  return { registry: { areas, levels, features }, errors };
}
