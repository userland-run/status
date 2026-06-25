// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import { Wordmark } from "./SiteHeader";
import styles from "./SiteFooter.module.css";

export function SiteFooter({ generatedAt }: { generatedAt: string }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.row}>
        <span className={styles.brand}>
          <Wordmark size={15} /> <span className={styles.crumb}>/ status</span>
        </span>
        <span className={styles.meta}>
          Regenerated on every result push · last build {generatedAt}
        </span>
      </div>
      <div className={styles.baseline}>
        <span>© 2026 userland.run · Open source (AGPL-3.0 OR UEL)</span>
        <span>Joined from the feature registry × producer test results</span>
      </div>
    </footer>
  );
}
