// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import type { Metadata, Viewport } from "next";
import { Newsreader, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./tokens.css";
import "./globals.css";

const display = Newsreader({ subsets: ["latin"], display: "swap", variable: "--font-display" });
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-mono" });

const SITE = "https://status.userland.run";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "userland.run — status",
    template: "%s — userland.run status",
  },
  description:
    "The live state of userland.run / NanoVM: what capabilities exist, what is tested, what is green, and where the gaps and drift are.",
  applicationName: "userland.run status",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "userland.run status",
    title: "userland.run — status",
    description: "The live feature-and-test state of NanoVM across nano, terminal, sdk, and catalog.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0e10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
