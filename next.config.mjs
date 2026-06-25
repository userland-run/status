// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML/CSS/JS export — no server runtime. Output lands in `out/`.
  output: "export",
  // next/image optimization needs a server; disable for static export.
  images: { unoptimized: true },
  // Emit `path/index.html` so every route works as a static file.
  trailingSlash: true,

  // Hosting: the custom domain https://status.userland.run serves from the root,
  // so no basePath. For GitHub Pages PROJECT-page hosting uncomment below and
  // drop public/CNAME.
  // basePath: "/status",
  // assetPrefix: "/status/",
};

export default nextConfig;
