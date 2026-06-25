// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

/** Shared links used across the status portal. */
export const GITHUB_URL = "https://github.com/userland-run/status";
export const SITE_URL = "https://userland.run";
export const REPO = (slug: string) => `https://github.com/userland-run/${slug}`;

export const NAV = [
  { href: "/", label: "Overview" },
  { href: "/matrix/", label: "Matrix" },
  { href: "/gaps/", label: "Gaps" },
];
