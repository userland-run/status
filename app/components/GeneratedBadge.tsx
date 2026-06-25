// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
"use client";

import { useEffect, useState } from "react";
import styles from "./GeneratedBadge.module.css";

interface Meta {
  generated_at: string;
}

/** Refetches /data/meta.json every 60s; goes amber >30 min, red >2 h. */
export function GeneratedBadge() {
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [, tick] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/data/meta.json", { cache: "no-store" })
        .then((r) => (r.ok ? (r.json() as Promise<Meta>) : null))
        .then((m) => alive && m && setGeneratedAt(m.generated_at))
        .catch(() => {});
    load();
    const a = setInterval(load, 60_000);
    const b = setInterval(() => alive && tick((n) => n + 1), 60_000);
    return () => {
      alive = false;
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  if (!generatedAt) return null;
  const ageMin = Math.max(0, Math.floor((Date.now() - Date.parse(generatedAt)) / 60000));
  const level = ageMin > 120 ? "old" : ageMin > 30 ? "stale" : "ok";
  const label = ageMin < 1 ? "just now" : ageMin < 60 ? `${ageMin}m ago` : `${Math.floor(ageMin / 60)}h ago`;

  return (
    <span className={`${styles.badge} ${styles[level]}`} title={`Generated ${generatedAt}`}>
      <span className={styles.dot} />
      generated {label}
    </span>
  );
}
