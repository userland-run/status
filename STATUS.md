# userland.run — status

> Generated 2026-06-27T10:16:54.486Z · live at https://status.userland.run

**45 / 46 tested features green** (98%) · 107 shipped (83%) · 0 failing now · 63 shipped-but-untested · 0 drift

## Red now
Nothing failing. 🟢

## Shipped but untested (63)
- `busybox.shell.ash` — ash shell (/bin/sh)
- `busybox.ls` — ls
- `catalog.recipe.ripgrep` — ripgrep
- `catalog.recipe.fd` — fd (find)
- `catalog.recipe.sd` — sd (sed alt)
- `catalog.recipe.hexyl` — hexyl (hex viewer)
- `catalog.recipe.oxipng` — oxipng (PNG optimizer)
- `catalog.recipe.ast-grep` — ast-grep (structural search)
- `catalog.recipe.delta` — delta (diff pager)
- `catalog.recipe.yq` — yq (YAML/JSON)
- `catalog.recipe.gron` — gron (greppable JSON)
- `catalog.recipe.glow` — glow (markdown render)
- `catalog.recipe.dasel` — dasel (data selector)
- `catalog.recipe.gix` — gix (gitoxide)
- `catalog.recipe.nfetch` — nfetch (HTTP shim)
- …and 48 more

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
| App conformance & distribution | 30 | 87% | 100% (7/7) |

## Suites
| Suite | Layer | Health | Pass rate | Age (min) |
| ----- | ----- | ------ | --------- | --------- |
| nano/cargo-unit | Core | ok | 100% | 66 |
| nano/node-harness | Runtime | ok | 100% | 236 |
| sdk/sdk-unit | SDK | ok | 87% | 89 |
| terminal/playwright-e2e | Terminal | ok | 100% | 388 |
| catalog/catalog-conformance | Catalog | ok | 100% | 62 |

_Regenerated on every result push. Edit features in `registry/`, never this file._
