# userland.run — status

The **single source of truth for the state of userland.run / NanoVM**: what
capabilities exist, what is tested, what is green or red, and where the gaps and
drift are. Live at **https://status.userland.run**.

It is a *hub*: a feature **registry** is joined against **test results** that each
producing repo's CI publishes, producing a unified matrix that is rendered as a
static dashboard and committed as [`STATUS.md`](./STATUS.md).

```
 nano · terminal · sdk · catalog   ── each CI run emits userland-results.json ──┐
   (real, feature-tagged tests)                                                 │
                                                                                ▼
                          .github/actions/publish-results  (validate IDs, commit)
                                                                                │
                       push to data/incoming/** ──► generate ──► state.json + STATUS.md
                                                                                │
                                              next build (static) ──► GitHub Pages
```

## Layout

| Path | What |
| ---- | ---- |
| `registry/`        | the source of truth: `areas.yaml` + `features/*.yaml` (immutable IDs) |
| `contract/`        | `results.schema.json` — the JSON every producer emits (`userland-results.json`) |
| `ingest/`          | `suites.yaml` (suite → layer), `schedules.yaml` (central cadence) |
| `data/incoming/`   | producers commit `<source>.<suite>.json` here; the push triggers regeneration |
| `generator/`       | TypeScript: load → validate → JOIN → derive drift → emit `data/state.json` + `STATUS.md` |
| `app/`             | Next.js static dashboard (Overview / Matrix / Gaps) |
| `test/`            | the hub's own test suite (registry / contract / join / drift / snapshots) |

## Develop

```bash
npm install
npm run generate     # join registry + data/incoming → data/state.json + STATUS.md
npm test             # registry / contract / join / drift / snapshot tests
npm run dev          # dashboard at http://localhost:3000
npm run build        # static export → out/
```

## How a feature becomes "green"

1. It exists in `registry/features/*.yaml` with an immutable `id`
   (`area.group.name`, e.g. `emulator.syscall.openat`).
2. A real test in some repo is tagged with that id (`@feat:<id>`).
3. That repo's CI emits `userland-results.json` and the `publish-results` action
   commits it to `data/incoming/`.
4. The generator joins it in; the cell turns green/red on the next build.

IDs are **immutable** — rename via `superseded_by:`, never by editing an id
(tests in other repos reference them).

## License

Dual-licensed `AGPL-3.0-only OR LicenseRef-UEL`. See [LICENSE.md](./LICENSE.md).
