// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import type { MetadataRoute } from "next";
import { STATUS_URL } from "./lib/site";

// Static export emits this as /robots.txt at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${STATUS_URL}/sitemap.xml`,
    host: STATUS_URL,
  };
}
