// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
//
// Central test cadence. scheduler.yml ticks every 15 min and fires a
// workflow_dispatch at each producer suite whose cron is due in the window.
// "Push" runs cover "code changed"; this covers "world changed".

import { readFileSync } from "node:fs";
import { parse } from "yaml";

export interface Schedule {
  source: string;
  suite: string;
  repo: string;
  workflow: string;
  cron: string;
}

/** Parse one cron field (minute/hour/dom/month/dow) into the matching set. */
function parseField(field: string, min: number, max: number): Set<number> {
  const out = new Set<number>();
  for (const part of field.split(",")) {
    if (part === "*") for (let i = min; i <= max; i++) out.add(i);
    else if (part.startsWith("*/")) {
      const step = Number(part.slice(2));
      for (let i = min; i <= max; i += step) out.add(i);
    } else if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      for (let i = a; i <= b; i++) out.add(i);
    } else out.add(Number(part));
  }
  return out;
}

/** Does a 5-field UTC cron match this instant (minute resolution)? */
export function cronMatches(expr: string, d: Date): boolean {
  const f = expr.trim().split(/\s+/);
  if (f.length !== 5) return false;
  const [mi, ho, dom, mo, dow] = f;
  return (
    parseField(mi, 0, 59).has(d.getUTCMinutes()) &&
    parseField(ho, 0, 23).has(d.getUTCHours()) &&
    parseField(dom, 1, 31).has(d.getUTCDate()) &&
    parseField(mo, 1, 12).has(d.getUTCMonth() + 1) &&
    parseField(dow, 0, 6).has(d.getUTCDay())
  );
}

/** Is the cron due anywhere in [now, now + windowMin)? */
export function cronDue(expr: string, now: Date, windowMin: number): boolean {
  for (let m = 0; m < windowMin; m++) if (cronMatches(expr, new Date(now.getTime() + m * 60000))) return true;
  return false;
}

export function loadSchedules(path: string): Schedule[] {
  const doc = parse(readFileSync(path, "utf8")) as { schedules?: Schedule[] };
  return doc.schedules ?? [];
}

/** The subset of schedules due in the window. */
export function dueSchedules(schedules: Schedule[], now: Date, windowMin: number): Schedule[] {
  return schedules.filter((s) => cronDue(s.cron, now, windowMin));
}
