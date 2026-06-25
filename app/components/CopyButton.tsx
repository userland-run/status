// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
"use client";

import { useState } from "react";
import styles from "./CopyButton.module.css";

/** Copies a ready-made Claude Code prompt for a gap item. */
export function CopyButton({ text, label = "copy prompt" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className={styles.btn}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {done ? "copied ✓" : label}
    </button>
  );
}
