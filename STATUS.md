# userland.run — status

> Generated 2026-06-27T04:32:34.340Z · live at https://status.userland.run

**41 / 42 tested features green** (98%) · 93 shipped (87%) · 0 failing now · 53 shipped-but-untested · 0 drift

## Red now
Nothing failing. 🟢

## Shipped but untested (53)
- `busybox.shell.ash` — ash shell (/bin/sh)
- `busybox.ls` — ls
- `catalog.recipe.ripgrep` — ripgrep
- `catalog.recipe.busybox` — busybox
- `catalog.recipe.node` — node v25.4.0
- `catalog.pipeline.publish` — package + sign + publish (CDN)
- `devenv.node` — Node.js v25.4.0
- `devenv.npm` — npm 11.7.0
- `devenv.tsc` — TypeScript 5.9.3 (tsc)
- `devenv.eslint` — ESLint 10.0.0
- `devenv.prettier` — Prettier 3.8.1
- `emulator.tty.termios` — TTY line discipline (termios)
- `emulator.term.vte` — VTE terminal grid
- `emulator.process.fork` — clone/fork
- `emulator.process.execve` — execve (tty/termios preserved)
- …and 38 more

## Drift (0)
No drift. 🟢

## Areas
| Area | Features | Shipped | Green (of tested) |
| ---- | -------- | ------- | ----------------- |
| RISC-V emulator & Linux syscalls | 57 | 88% | 100% (9/9) |
| BusyBox applets | 19 | 100% | 100% (17/17) |
| Dev toolchain | 5 | 100% | 0% (0/0) |
| TypeScript SDK | 9 | 78% | 89% (8/9) |
| WebGPU console | 9 | 56% | 100% (4/4) |
| App conformance & distribution | 8 | 88% | 100% (3/3) |

## Suites
| Suite | Layer | Health | Pass rate | Age (min) |
| ----- | ----- | ------ | --------- | --------- |
| nano/cargo-unit | Core | ok | 100% | 1 |
| nano/node-harness | Runtime | ok | 100% | 31 |
| sdk/sdk-unit | SDK | ok | 87% | 1 |
| terminal/playwright-e2e | Terminal | ok | 100% | 44 |
| catalog/catalog-conformance | Catalog | ok | 100% | 163 |

_Regenerated on every result push. Edit features in `registry/`, never this file._
