// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import Link from "next/link";
import { GitHubIcon } from "./icons";
import { GeneratedBadge } from "./GeneratedBadge";
import { GITHUB_URL, NAV, SITE_URL } from "../lib/site";
import styles from "./SiteHeader.module.css";

/** The lowercase "userland.run" wordmark — the violet ".run" is part of the mark. */
export function Wordmark({ size = 16 }: { size?: number }) {
  return (
    <span className={styles.wordmark} style={{ fontSize: size }}>
      userland<span className={styles.dot}>.run</span>
    </span>
  );
}

export function SiteHeader({ active }: { active?: string }) {
  return (
    <nav className={styles.nav}>
      <a href={SITE_URL} aria-label="userland.run home">
        <Wordmark />
      </a>
      <span className={styles.crumbSlash}>/</span>
      <span className={styles.crumb}>status</span>

      <span className={styles.spacer} />

      {NAV.map((n) => (
        <Link key={n.href} href={n.href} className={`${styles.link} ${active === n.href ? styles.active : ""}`}>
          {n.label}
        </Link>
      ))}

      <GeneratedBadge />

      <a href={GITHUB_URL} className={styles.ghost} target="_blank" rel="noreferrer">
        <GitHubIcon />
        <span className={styles.hideSm}>GitHub</span>
      </a>
    </nav>
  );
}
