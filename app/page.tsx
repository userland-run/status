// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import Link from "next/link";
import { Page } from "./components/Page";
import { state } from "./lib/state";
import { pct, ageLabel } from "./lib/format";
import { REPO } from "./lib/site";
import styles from "./overview.module.css";

const STATUS_ORDER = ["shipped", "partial", "in-progress", "planned", "deprecated"] as const;

export default function OverviewPage() {
  const h = state.headline;
  const tiles = [
    { label: "Features", value: String(h.total), sub: `${state.areaRollups.length} areas` },
    { label: "Shipped", value: pct(h.shippedPct), sub: `${h.shipped} of ${h.total}` },
    { label: "Green", value: pct(h.greenPct), sub: `${h.green} of ${h.tested} tested`, tone: "ok" as const },
    { label: "Failing now", value: String(h.failingNow), sub: "red cells", tone: h.failingNow ? ("fail" as const) : undefined },
    { label: "Untested shipped", value: String(h.untestedShipped), sub: "no test yet", tone: h.untestedShipped ? ("warn" as const) : undefined },
    { label: "Drift", value: String(h.driftCount), sub: "needs attention", tone: h.driftCount ? ("warn" as const) : undefined },
  ];

  return (
    <Page active="/" title="State of userland.run" lede="What exists, what's tested, and what's green — joined from the feature registry and every producer's latest CI results.">
      <section className={styles.tiles}>
        {tiles.map((t) => (
          <div key={t.label} className={styles.tile}>
            <div className={`${styles.tileValue} ${t.tone ? styles[t.tone] : ""}`}>{t.value}</div>
            <div className={styles.tileLabel}>{t.label}</div>
            <div className={styles.tileSub}>{t.sub}</div>
          </div>
        ))}
      </section>

      <div className={styles.cols}>
        <section className={styles.panel}>
          <h2 className={styles.h2}>Areas</h2>
          <div className={styles.rollups}>
            {state.areaRollups.map((a) => (
              <div key={a.id} className={styles.rollup}>
                <div className={styles.rollupHead}>
                  <span className={styles.rollupTitle}>{a.title}</span>
                  <span className={styles.rollupNums}>
                    {pct(a.greenPct)} green · {a.total}
                  </span>
                </div>
                <div className={styles.bar}>
                  {STATUS_ORDER.map((s) =>
                    a.byStatus[s] ? (
                      <span
                        key={s}
                        className={`${styles.seg} ${styles[`seg_${s}`]}`}
                        style={{ flexGrow: a.byStatus[s] }}
                        title={`${a.byStatus[s]} ${s}`}
                      />
                    ) : null,
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.h2}>
            Red now{" "}
            <span className={styles.count}>{state.redNow.length}</span>
          </h2>
          {state.redNow.length === 0 ? (
            <p className={styles.empty}>Nothing failing. The board is green.</p>
          ) : (
            <ul className={styles.redList}>
              {state.redNow.map((r) => (
                <li key={r.id} className={styles.redItem}>
                  <div>
                    <code className={styles.code}>{r.id}</code>
                    <span className={styles.redTitle}>{r.title}</span>
                  </div>
                  <div className={styles.redMeta}>
                    <span className={styles.redLayer}>{r.layers.join(", ")}</span>
                    <span>{ageLabel(r.age_min)}</span>
                    {r.trace_url ? (
                      <a href={r.trace_url} target="_blank" rel="noreferrer" className={styles.traceLink}>
                        trace
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className={styles.panel}>
        <h2 className={styles.h2}>Suite health</h2>
        <div className={styles.suites}>
          {state.suiteHealth.map((s) => (
            <a
              key={`${s.source}/${s.suite}`}
              href={REPO(s.source)}
              target="_blank"
              rel="noreferrer"
              className={`${styles.suite} ${styles[`health_${s.health}`]}`}
            >
              <span className={styles.suiteDot} />
              <span className={styles.suiteName}>
                {s.source}/{s.suite}
              </span>
              <span className={styles.suiteMeta}>
                {s.health === "missing" ? "no data yet" : `${s.passRate !== undefined ? pct(s.passRate) : "—"} · ${ageLabel(s.age_min)}`}
              </span>
            </a>
          ))}
        </div>
      </section>

      <p className={styles.more}>
        Dig into the <Link href="/matrix/" className={styles.inlineLink}>feature × layer matrix</Link> or the actionable{" "}
        <Link href="/gaps/" className={styles.inlineLink}>gaps &amp; drift</Link>.
      </p>
    </Page>
  );
}
