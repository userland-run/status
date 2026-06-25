// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import { Page } from "../components/Page";
import { CopyButton } from "../components/CopyButton";
import { state } from "../lib/state";
import styles from "./gaps.module.css";

const featureById = new Map(state.features.map((f) => [f.id, f]));

function prompt(id: string, kind: string): string {
  const f = featureById.get(id);
  const where = f?.spec ? ` Spec/pointer: ${f.spec}.` : "";
  return `In the userland.run workspace, address this ${kind} for feature \`${id}\`${f ? ` ("${f.title}", area ${f.area})` : ""}.${where} Add or fix a feature-tagged test (@feat:${id}) in the owning repo so the status dashboard turns green, then make sure its CI publishes results to userland-run/status.`;
}

export default function GapsPage() {
  const { redNow, shippedUntested, drift } = state;
  const driftItems = [
    ...drift.unknownIds.map((u) => ({ id: u.id, text: `unknown id referenced from ${u.from}`, kind: "unknown-id drift" })),
    ...drift.staleInProgress.map((s) => ({ id: s.id, text: `in progress > 60 days (since ${s.since ?? "?"})`, kind: "stale in-progress" })),
    ...drift.superseded.map((s) => ({ id: s.id, text: `superseded by ${s.superseded_by} but still tested`, kind: "superseded drift" })),
    ...drift.partialNoNotes.map((p) => ({ id: p.id, text: "marked partial without notes", kind: "registry hygiene" })),
  ];

  return (
    <Page active="/gaps/" title="Gaps & drift" lede="The actionable list. Every item ships with a ready-made prompt you can paste into a Claude Code session in the owning repo.">
      <section className={styles.section}>
        <h2 className={styles.h2}>
          Red now <span className={styles.count}>{redNow.length}</span>
        </h2>
        {redNow.length === 0 ? (
          <p className={styles.empty}>Nothing failing. 🟢</p>
        ) : (
          <ul className={styles.list}>
            {redNow.map((r) => (
              <li key={r.id} className={`${styles.item} ${styles.fail}`}>
                <div className={styles.itemMain}>
                  <code className={styles.id}>{r.id}</code>
                  <span className={styles.desc}>
                    {r.title} — failing in {r.layers.join(", ")}
                  </span>
                </div>
                <div className={styles.actions}>
                  {r.trace_url ? (
                    <a href={r.trace_url} target="_blank" rel="noreferrer" className={styles.trace}>
                      trace
                    </a>
                  ) : null}
                  <CopyButton text={prompt(r.id, "failing test")} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>
          Shipped but untested <span className={styles.count}>{shippedUntested.length}</span>
        </h2>
        <p className={styles.note}>Shipped features with no test backing them — the most valuable place to add coverage.</p>
        {shippedUntested.length === 0 ? (
          <p className={styles.empty}>Every shipped feature has a test. 🟢</p>
        ) : (
          <ul className={styles.list}>
            {shippedUntested.map((s) => (
              <li key={s.id} className={`${styles.item} ${styles.warn}`}>
                <div className={styles.itemMain}>
                  <code className={styles.id}>{s.id}</code>
                  <span className={styles.desc}>{s.title}</span>
                </div>
                <div className={styles.actions}>
                  <span className={styles.area}>{s.area}</span>
                  <CopyButton text={prompt(s.id, "missing test")} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>
          Drift <span className={styles.count}>{driftItems.length}</span>
        </h2>
        <p className={styles.note}>The system catching itself: tests tagging unknown ids, stale work, and registry hygiene.</p>
        {driftItems.length === 0 ? (
          <p className={styles.empty}>No drift. 🟢</p>
        ) : (
          <ul className={styles.list}>
            {driftItems.map((d, i) => (
              <li key={`${d.id}-${i}`} className={styles.item}>
                <div className={styles.itemMain}>
                  <code className={styles.id}>{d.id}</code>
                  <span className={styles.desc}>{d.text}</span>
                </div>
                <div className={styles.actions}>
                  <span className={styles.kind}>{d.kind}</span>
                  <CopyButton text={prompt(d.id, d.kind)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Page>
  );
}
