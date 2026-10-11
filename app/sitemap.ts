// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import type { MetadataRoute } from "next";
import { NAV, STATUS_URL } from "./lib/site";
import { state } from "./lib/state";

// Static export emits this as /sitemap.xml at build time.
export const dynamic = "force-static";

// Every page renders from the generated state, so its generated_at is the real
// last-modified date (not the build time).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = state.generated_at;
  return NAV.map((n) => ({
    url: `${STATUS_URL}${n.href}`,
    changeFrequency: "hourly",
    priority: n.href === "/" ? 1 : 0.8,
    lastModified,
  }));
}
