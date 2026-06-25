// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run

import type { CellState, Status } from "../../generator/src/types";

export const pct = (x: number): string => `${Math.round(x * 100)}%`;

/** Human-friendly age from a minute count. */
export function ageLabel(min: number | undefined): string {
  if (min === undefined || !Number.isFinite(min)) return "—";
  if (min < 1) return "just now";
  if (min < 60) return `${min}m`;
  if (min < 60 * 24) return `${Math.floor(min / 60)}h`;
  return `${Math.floor(min / (60 * 24))}d`;
}

/** A short glyph for a cell/run state — paired with a color class. */
export function stateGlyph(state: CellState): string {
  switch (state) {
    case "passed":
      return "●";
    case "failed":
      return "●";
    case "flaky":
      return "◐";
    case "skipped":
      return "○";
    default:
      return "·";
  }
}

/** CSS-module-agnostic state key, used to pick a color class. */
export const stateKey = (state: CellState): string => state;

export const STATUS_LABEL: Record<Status, string> = {
  planned: "planned",
  "in-progress": "in progress",
  shipped: "shipped",
  partial: "partial",
  deprecated: "deprecated",
};

/** Amber after 30 min, red after 2 h — the generation freshness signal. */
export function freshnessLevel(ageMin: number | undefined): "ok" | "stale" | "old" {
  if (ageMin === undefined) return "ok";
  if (ageMin > 120) return "old";
  if (ageMin > 30) return "stale";
  return "ok";
}
