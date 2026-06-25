// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import type { CellState } from "../../generator/src/types";
import styles from "./HistoryGlyph.module.css";

/** The last up-to-5 run states as a row of dots, oldest → newest. */
export function HistoryGlyph({ history }: { history: CellState[] }) {
  if (!history.length) return null;
  return (
    <span className={styles.row} aria-label={`recent: ${history.join(", ")}`}>
      {history.map((s, i) => (
        <span key={i} className={`${styles.dot} ${styles[s]}`} />
      ))}
    </span>
  );
}
