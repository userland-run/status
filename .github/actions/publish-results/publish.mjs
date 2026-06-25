// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
//
// Validate a userland-results.json against the contract and the registry's known
// feature ids (the unknown-id gate), then commit it to the status hub at
// data/incoming/<source>.<suite>.json via the GitHub contents API.
//
// Runs in the producer's CI with plain Node 20 (no extra deps). The registry id
// set is read from the hub's committed data/state.json (this action's own checkout).

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ID_RE = /^[a-z0-9]+(\.[a-z0-9-]+)+$/;
const TEST_STATUSES = new Set(["passed", "failed", "skipped", "flaky"]);

function arg(name, fallback = "") {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const source = arg("source");
const suite = arg("suite");
const resultsPath = arg("results");
const statusRepo = arg("status-repo", "userland-run/status");
const actionPath = arg("action-path", process.env.GITHUB_ACTION_PATH ?? ".");
const token = process.env.STATUS_TOKEN ?? "";

function fail(msg, errors = []) {
  console.error(`✗ publish-results: ${msg}`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

// ── load known feature ids from the hub's committed state.json ───────────────
function knownIds() {
  const candidates = [
    join(actionPath, "../../../data/state.json"),
    join(actionPath, "../../..", "data", "state.json"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      const state = JSON.parse(readFileSync(p, "utf8"));
      return new Set((state.features ?? []).map((f) => f.id));
    }
  }
  return null; // registry snapshot unavailable → skip the unknown-id gate (warn)
}

// ── validate the results file ────────────────────────────────────────────────
if (!existsSync(resultsPath)) fail(`results file not found: ${resultsPath}`);
let doc;
try {
  doc = JSON.parse(readFileSync(resultsPath, "utf8"));
} catch (e) {
  fail(`results file is not valid JSON: ${e.message}`);
}

const errors = [];
if (doc.contract !== 1) errors.push(`contract must be 1 (got ${JSON.stringify(doc.contract)})`);
for (const k of ["source", "suite", "commit", "branch", "finished_at"]) if (typeof doc[k] !== "string" || !doc[k]) errors.push(`missing/invalid "${k}"`);
if (doc.source !== source) errors.push(`source "${doc.source}" != action input "${source}"`);
if (doc.suite !== suite) errors.push(`suite "${doc.suite}" != action input "${suite}"`);
if (!Array.isArray(doc.results)) errors.push("results must be an array");

const ids = knownIds();
if (ids === null) console.warn("⚠ registry snapshot (data/state.json) not found in action checkout — skipping unknown-id gate");

if (Array.isArray(doc.results)) {
  doc.results.forEach((r, i) => {
    if (typeof r.test_id !== "string" || !r.test_id) errors.push(`results[${i}]: missing test_id`);
    if (!Array.isArray(r.features) || r.features.length === 0) errors.push(`results[${i}]: features must be non-empty`);
    else
      r.features.forEach((fid) => {
        if (typeof fid !== "string" || !ID_RE.test(fid)) errors.push(`results[${i}]: invalid feature id ${JSON.stringify(fid)}`);
        else if (ids && !ids.has(fid)) errors.push(`results[${i}]: unknown feature id "${fid}" — add it to the registry first`);
      });
    if (!TEST_STATUSES.has(r.status)) errors.push(`results[${i}]: invalid status "${r.status}"`);
  });
}

if (errors.length) fail(`${errors.length} validation error(s)`, errors);
console.log(`✓ ${source}/${suite}: ${doc.results.length} results valid${ids ? "" : " (id gate skipped)"}`);

// ── commit to the hub ────────────────────────────────────────────────────────
if (!token) {
  console.warn("⚠ no token provided — validated only, not published. Set STATUS_DISPATCH_TOKEN to publish.");
  process.exit(0);
}

const path = `data/incoming/${source}.${suite}.json`;
const apiBase = `https://api.github.com/repos/${statusRepo}/contents/${path}`;
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "userland-publish-results",
};
const content = Buffer.from(JSON.stringify(doc, null, 2) + "\n").toString("base64");

async function currentSha() {
  const res = await fetch(`${apiBase}?ref=main`, { headers });
  if (res.status === 200) return (await res.json()).sha;
  if (res.status === 404) return undefined;
  throw new Error(`GET ${path} → ${res.status} ${await res.text()}`);
}

async function put(sha) {
  const body = {
    message: `chore(ingest): ${source}/${suite} @ ${doc.commit} [skip ci]`,
    content,
    branch: "main",
    ...(sha ? { sha } : {}),
  };
  const res = await fetch(apiBase, { method: "PUT", headers, body: JSON.stringify(body) });
  return res;
}

// retry on the 409 race when two producers push near-simultaneously
for (let attempt = 1; attempt <= 4; attempt++) {
  const sha = await currentSha();
  const res = await put(sha);
  if (res.ok) {
    console.log(`✓ published → ${statusRepo}/${path}`);
    process.exit(0);
  }
  if (res.status === 409 || res.status === 422) {
    console.warn(`… contention on ${path} (attempt ${attempt}), retrying`);
    await new Promise((r) => setTimeout(r, 500 * attempt));
    continue;
  }
  fail(`PUT ${path} → ${res.status} ${await res.text()}`);
}
fail(`could not publish ${path} after retries`);
