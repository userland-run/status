// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
//
// prebuild: copy generated data/*.json into public/data/ so the client-side
// GeneratedBadge can fetch it at runtime (the static export inlines the rest).

import { mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "data");
mkdirSync(out, { recursive: true });

for (const name of ["state.json", "meta.json"]) {
  const src = join(root, "data", name);
  if (existsSync(src)) copyFileSync(src, join(out, name));
  else console.warn(`copy-data: ${name} not found — run \`npm run generate\` first`);
}
console.log("copy-data: public/data ready");
