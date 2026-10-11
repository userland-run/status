// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
//
// Server component: reads the (large) generated state at build time and hands
// the client filter only the fields the table renders, so state.json never
// ships in the browser bundle.

import type { Metadata } from "next";
import { Page } from "../components/Page";
import { state } from "../lib/state";
import { MatrixTable, type MatrixFeature } from "./MatrixTable";

export const metadata: Metadata = {
  title: "Matrix",
  description: "Every userland.run feature × every test layer — the latest state and the last five runs per cell.",
  alternates: { canonical: "/matrix/" },
};

const features: MatrixFeature[] = state.features.map((f) => ({
  id: f.id,
  title: f.title,
  area: f.area,
  status: f.status,
  tested: f.tested,
  cells: Object.fromEntries(
    Object.entries(f.cells).map(([layer, c]) => [
      layer,
      { state: c.state, counts: c.counts, history: c.history, ageMin: c.freshness?.age_min },
    ]),
  ),
}));

const areas = state.areaRollups.map((a) => ({ id: a.id, title: a.title }));

export default function MatrixPage() {
  return (
    <Page active="/matrix/" title="Matrix" lede="Every feature × every test layer. A dot is the latest state; the trailing dots are the last five runs.">
      <MatrixTable features={features} areas={areas} layers={state.layers} />
    </Page>
  );
}
