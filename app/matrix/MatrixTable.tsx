// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
"use client";

import { useMemo, useState } from "react";
import { HistoryGlyph } from "../components/HistoryGlyph";
import { ageLabel, STATUS_LABEL } from "../lib/format";
import type { CellState, Counts, Status } from "../../generator/src/types";
import styles from "./matrix.module.css";

/** The trimmed per-cell data the table renders (see page.tsx). */
export interface MatrixCell {
  state: CellState;
  counts: Counts;
  history: CellState[];
  ageMin?: number;
}

/** The trimmed per-feature data the table renders (see page.tsx). */
export interface MatrixFeature {
  id: string;
  title: string;
  area: string;
  status: Status;
  tested: boolean;
  cells: Record<string, MatrixCell>;
}

type Quick = "all" | "failing" | "flaky" | "untested" | "untested-shipped";

const QUICKS: { key: Quick; label: string }[] = [
  { key: "all", label: "All" },
  { key: "failing", label: "Failing" },
  { key: "flaky", label: "Flaky" },
  { key: "untested", label: "Untested" },
  { key: "untested-shipped", label: "Shipped · untested" },
];

function matches(f: MatrixFeature, q: string, area: string, quick: Quick): boolean {
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

function CellView({ cell }: { cell: MatrixCell | undefined }) {
  if (!cell) return <span className={styles.cellEmpty}>·</span>;
  const total = cell.counts.passed + cell.counts.failed + cell.counts.skipped + cell.counts.flaky;
  const title = `${cell.state} · ${cell.counts.passed}/${total} passed · ${cell.ageMin !== undefined ? ageLabel(cell.ageMin) : ""}`;
  return (
    <span className={styles.cell} title={title}>
      <span className={`${styles.cellDot} ${styles[cell.state]}`} />
      <HistoryGlyph history={cell.history} />
    </span>
  );
}

export function MatrixTable({
  features,
  areas,
  layers,
}: {
  features: MatrixFeature[];
  areas: { id: string; title: string }[];
  layers: string[];
}) {
  const [q, setQ] = useState("");
  const [area, setArea] = useState("all");
  const [quick, setQuick] = useState<Quick>("all");

  const rows = useMemo(
    () => features.filter((f) => matches(f, q.trim().toLowerCase(), area, quick)),
    [features, q, area, quick],
  );

  return (
    <>
      <div className={styles.controls}>
        <input
          className={styles.search}
          placeholder="filter by id or title…"
          aria-label="Filter features by id or title"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className={styles.select} aria-label="Filter by area" value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="all">all areas</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
        <div className={styles.quicks} role="group" aria-label="Quick filters">
          {QUICKS.map((Q) => (
            <button
              key={Q.key}
              type="button"
              aria-pressed={quick === Q.key}
              className={`${styles.quick} ${quick === Q.key ? styles.quickOn : ""}`}
              onClick={() => setQuick(Q.key)}
            >
              {Q.label}
            </button>
          ))}
        </div>
        <span className={styles.resultCount} aria-live="polite">
          {rows.length} features
        </span>
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
              {layers.map((l) => (
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
                {layers.map((l) => (
                  <td key={l} className={styles.tdCell}>
                    <CellView cell={f.cells[l]} />
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={2 + layers.length} className={styles.noRows}>
                  No features match.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
