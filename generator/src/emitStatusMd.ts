// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
//
// Render the committed STATUS.md twin of the dashboard. Referenced from each
// repo's CLAUDE.md so a coding session can see the state without the browser.

import type { StateJson } from "./types";

const pct = (x: number): string => `${Math.round(x * 100)}%`;
const CAP = 15;

function list<T>(items: T[], render: (t: T) => string): string {
  const shown = items.slice(0, CAP).map(render);
  if (items.length > CAP) shown.push(`- …and ${items.length - CAP} more`);
  return shown.join("\n");
}

export function renderStatusMd(state: StateJson): string {
  const h = state.headline;
  const out: string[] = [];

  out.push("# userland.run — status");
  out.push("");
  out.push(`> Generated ${state.generated_at} · live at https://status.userland.run`);
  out.push("");
  out.push(
    `**${h.green} / ${h.tested} tested features green** (${pct(h.greenPct)}) · ` +
      `${h.shipped} shipped (${pct(h.shippedPct)}) · ` +
      `${h.failingNow} failing now · ${h.untestedShipped} shipped-but-untested · ${h.driftCount} drift`,
  );
  out.push("");

  out.push("## Red now");
  if (state.redNow.length === 0) out.push("Nothing failing. 🟢");
  else
    out.push(
      list(state.redNow, (r) => {
        const where = r.layers.join(", ");
        const trace = r.trace_url ? ` · ${r.trace_url}` : "";
        return `- \`${r.id}\` — ${r.title} (${where})${trace}`;
      }),
    );
  out.push("");

  out.push(`## Shipped but untested (${state.shippedUntested.length})`);
  if (state.shippedUntested.length === 0) out.push("None — every shipped feature has a test. 🟢");
  else out.push(list(state.shippedUntested, (s) => `- \`${s.id}\` — ${s.title}`));
  out.push("");

  const d = state.drift;
  const driftLines = [
    ...d.unknownIds.map((u) => `- unknown id \`${u.id}\` referenced from ${u.from}`),
    ...d.staleInProgress.map((s) => `- in-progress > 60d: \`${s.id}\` — ${s.title} (since ${s.since ?? "?"})`),
    ...d.superseded.map((s) => `- superseded but still tested: \`${s.id}\` → \`${s.superseded_by}\``),
    ...d.partialNoNotes.map((p) => `- partial without notes: \`${p.id}\` — ${p.title}`),
  ];
  out.push(`## Drift (${driftLines.length})`);
  out.push(driftLines.length === 0 ? "No drift. 🟢" : driftLines.slice(0, CAP).join("\n") + (driftLines.length > CAP ? `\n- …and ${driftLines.length - CAP} more` : ""));
  out.push("");

  out.push("## Areas");
  out.push("| Area | Features | Shipped | Green (of tested) |");
  out.push("| ---- | -------- | ------- | ----------------- |");
  for (const a of state.areaRollups) out.push(`| ${a.title} | ${a.total} | ${pct(a.shippedPct)} | ${pct(a.greenPct)} (${a.green}/${a.tested}) |`);
  out.push("");

  out.push("## Suites");
  out.push("| Suite | Layer | Health | Pass rate | Age (min) |");
  out.push("| ----- | ----- | ------ | --------- | --------- |");
  for (const s of state.suiteHealth)
    out.push(`| ${s.source}/${s.suite} | ${s.layer} | ${s.health} | ${s.passRate !== undefined ? pct(s.passRate) : "—"} | ${s.age_min ?? "—"} |`);
  out.push("");

  out.push("_Regenerated on every result push. Edit features in `registry/`, never this file._");
  out.push("");
  return out.join("\n");
}
