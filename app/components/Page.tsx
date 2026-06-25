// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { state } from "../lib/state";
import styles from "./Page.module.css";

export function Page({
  active,
  title,
  lede,
  children,
}: {
  active: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader active={active} />
      <main className={styles.main}>
        <header className={styles.head}>
          <h1 className={styles.title}>{title}</h1>
          {lede ? <p className={styles.lede}>{lede}</p> : null}
        </header>
        {children}
      </main>
      <SiteFooter generatedAt={state.generated_at} />
    </>
  );
}
