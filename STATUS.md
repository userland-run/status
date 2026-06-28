# userland.run — status

> Generated 2026-06-28T04:17:19.307Z · live at https://status.userland.run

**58 / 62 tested features green** (94%) · 129 shipped (83%) · 3 failing now · 69 shipped-but-untested · 0 drift

## Red now
- `catalog.recipe.prettier` — Prettier 3.8.1 (Catalog) · https://github.com/userland-run/catalog/actions/runs/28287378339
- `catalog.pipeline.conformance` — conformance harness (Catalog) · https://github.com/userland-run/catalog/actions/runs/28287378339
- `catalog.pipeline.gate` — syscall gate (pinned manifest) (Catalog) · https://github.com/userland-run/catalog/actions/runs/28287378339

## Shipped but untested (69)
- `busybox.shell.ash` — ash shell (/bin/sh)
- `busybox.ls` — ls
- `catalog.recipe.htmlq` — htmlq (HTML select)
- `catalog.recipe.ambr` — ambr (search & replace)
- `catalog.recipe.b3sum` — b3sum (BLAKE3 hash)
- `catalog.recipe.bat` — bat (cat + syntax highlight)
- `catalog.recipe.choose` — choose (cut/awk alt)
- `catalog.recipe.difftastic` — difftastic (structural diff)
- `catalog.recipe.dua` — dua (disk usage analyzer)
- `catalog.recipe.dust` — dust (du alt)
- `catalog.recipe.grex` — grex (regex builder)
- `catalog.recipe.hck` — hck (cut alt)
- `catalog.recipe.jaq` — jaq (jq clone)
- `catalog.recipe.jql` — jql (JSON query)
- `catalog.recipe.just` — just (command runner)
- …and 54 more

## Drift (0)
No drift. 🟢

## Areas
| Area | Features | Shipped | Green (of tested) |
| ---- | -------- | ------- | ----------------- |
| RISC-V emulator & Linux syscalls | 57 | 88% | 100% (9/9) |
| BusyBox applets | 19 | 100% | 100% (17/17) |
| Dev toolchain | 5 | 0% | 0% (0/0) |
| TypeScript SDK | 9 | 78% | 89% (8/9) |
| WebGPU console | 9 | 56% | 100% (4/4) |
| App conformance & distribution | 57 | 84% | 87% (20/23) |

## Suites
| Suite | Layer | Health | Pass rate | Age (min) |
| ----- | ----- | ------ | --------- | --------- |
| nano/cargo-unit | Core | ok | 100% | 26 |
| nano/node-harness | Runtime | ok | 100% | 1316 |
| sdk/sdk-unit | SDK | ok | 87% | 1169 |
| terminal/playwright-e2e | Terminal | ok | 100% | 1469 |
| catalog/catalog-conformance | Catalog | ok | 95% | 1023 |

_Regenerated on every result push. Edit features in `registry/`, never this file._
