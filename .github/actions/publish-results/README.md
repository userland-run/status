# publish-results

A composite action producers add as the **last step of their default-branch CI**.
It validates a `userland-results.json` against the contract and the live registry
(the unknown-id gate), then commits it to `userland-run/status` at
`data/incoming/<source>.<suite>.json` — which triggers the hub's `generate` workflow.

## Usage

```yaml
- uses: userland-run/status/.github/actions/publish-results@main
  if: github.ref == 'refs/heads/main'
  with:
    source: nano            # repo short name (matches an area owner)
    suite: cargo-unit       # unique per (source, suite)
    results-file: userland-results.json
    token: ${{ secrets.STATUS_DISPATCH_TOKEN }}
```

## Inputs

| input          | required | description                                                       |
| -------------- | -------- | ----------------------------------------------------------------- |
| `source`       | yes      | producer short name; must match `source` inside the results file  |
| `suite`        | yes      | suite name; must match `suite` inside the results file            |
| `results-file` | yes      | path to the emitted `userland-results.json`                       |
| `token`        | no       | PAT with **Contents: write** on `userland-run/status`. Empty → validate-only |
| `status-repo`  | no       | defaults to `userland-run/status`                                 |

## The token

Create a fine-grained PAT with **Contents: write** on `userland-run/status` and add
it to each producing repo as the secret **`STATUS_DISPATCH_TOKEN`**. Without it the
action validates and logs but does not publish (so PR runs are safe).

## What it checks

- `contract === 1`, required fields present, `source`/`suite` match the inputs.
- Every `features[]` id matches the id grammar **and exists in the registry**
  (read from the hub's committed `data/state.json`). An unknown id fails the
  producer's CI — fix it by adding the feature to `registry/` first.

## Fallback delivery (no hub write access)

If you'd rather producers not hold a write token, switch this step to
`actions/upload-artifact` + a `repository_dispatch` (event `results-published`)
and let the hub pull the artifact. The hub's `generate.yml` already listens for
that event; only the ingestion source changes — everything downstream is identical.
