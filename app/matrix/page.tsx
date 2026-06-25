// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
"use client";

import { useMemo, useState } from "react";
import { Page } from "../components/Page";
import { HistoryGlyph } from "../components/HistoryGlyph";
import { state } from "../lib/state";
import { ageLabel, STATUS_LABEL } from "../lib/format";
import type { Cell, FeatureState } from "../../generator/src/types";
import styles from "./matrix.module.css";

type Quick = "all" | "failing" | "flaky" | "untested" | "untested-shipped";

function matches(f: FeatureState, q: string, area: string, quick: Quick): boolean {
  if (area !== "all" && f.area !== area) return false;
  if (q && !(f.id.includes(q) || f.title.toLowerCase().includes(q))) return false;
  const cells = Object.values(f.cells);
  switch (quick) {
    case "failing":
      return cells.some((c) => c.state === "failed");
    case "flaky":
      return cells.some((c) => c.state === "flaky");
    case "untested":
      return !f.tested;
    case "untested-shipped":
      return f.status === "shipped" && !f.tested;
    default:
      return true;
  }
}

function CellView({ cell }: { cell: Cell | undefined }) {
  if (!cell) return <span className={styles.cellEmpty}>·</span>;
  const total = cell.counts.passed + cell.counts.failed + cell.counts.skipped + cell.counts.flaky;
  const title = `${cell.state} · ${cell.counts.passed}/${total} passed · ${cell.freshness ? ageLabel(cell.freshness.age_min) : ""}`;
  return (
    <span className={styles.cell} title={title}>
      <span className={`${styles.cellDot} ${styles[cell.state]}`} />
      <HistoryGlyph history={cell.history} />
    </span>
  );
}

export default function MatrixPage() {
  const [q, setQ] = useState("");
  const [area, setArea] = useState("all");
  const [quick, setQuick] = useState<Quick>("all");

  const rows = useMemo(
    () => state.features.filter((f) => matches(f, q.trim().toLowerCase(), area, quick)),
    [q, area, quick],
  );

  const QUICKS: { key: Quick; label: string }[] = [
    { key: "all", label: "All" },
    { key: "failing", label: "Failing" },
    { key: "flaky", label: "Flaky" },
    { key: "untested", label: "Untested" },
    { key: "untested-shipped", label: "Shipped · untested" },
  ];

  return (
    <Page active="/matrix/" title="Matrix" lede="Every feature × every test layer. A dot is the latest state; the trailing dots are the last five runs.">
      <div className={styles.controls}>
        <input className={styles.search} placeholder="filter by id or title…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={styles.select} value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="all">all areas</option>
          {state.areaRollups.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
        <div className={styles.quicks}>
          {QUICKS.map((Q) => (
            <button key={Q.key} className={`${styles.quick} ${quick === Q.key ? styles.quickOn : ""}`} onClick={() => setQuick(Q.key)}>
              {Q.label}
            </button>
          ))}
        </div>
        <span className={styles.resultCount}>{rows.length} features</span>
      </div>

      <div className={styles.legend}>
        <span><i className={`${styles.cellDot} ${styles.passed}`} /> passed</span>
        <span><i className={`${styles.cellDot} ${styles.failed}`} /> failed</span>
        <span><i className={`${styles.cellDot} ${styles.flaky}`} /> flaky</span>
        <span><i className={`${styles.cellDot} ${styles.skipped}`} /> skipped</span>
        <span><i className={styles.cellEmptyDot} /> untested</span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thFeature}>Feature</th>
              <th className={styles.thStatus}>Status</th>
              {state.layers.map((l) => (
                <th key={l} className={styles.thLayer}>{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id} className={styles.tr}>
                <td className={styles.tdFeature}>
                  <code className={styles.id}>{f.id}</code>
                  <span className={styles.title}>{f.title}</span>
                </td>
                <td>
                  <span className={`${styles.pill} ${styles[`st_${f.status}`]}`}>{STATUS_LABEL[f.status]}</span>
                </td>
                {state.layers.map((l) => (
                  <td key={l} className={styles.tdCell}>
                    <CellView cell={f.cells[l]} />
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={2 + state.layers.length} className={styles.noRows}>
                  No features match.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Page>
  );
}
