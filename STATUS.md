# userland.run — status

> Generated 2026-06-27T07:23:31.383Z · live at https://status.userland.run

**43 / 44 tested features green** (98%) · 90 shipped (82%) · 0 failing now · 48 shipped-but-untested · 0 drift

## Red now
Nothing failing. 🟢

## Shipped but untested (48)
- `busybox.shell.ash` — ash shell (/bin/sh)
- `busybox.ls` — ls
- `catalog.recipe.ripgrep` — ripgrep
- `catalog.recipe.typescript` — TypeScript 5.9.3 (tsc)
- `catalog.recipe.eslint` — ESLint 10.0.0
- `catalog.pipeline.publish` — package + sign + publish (CDN)
- `emulator.tty.termios` — TTY line discipline (termios)
- `emulator.term.vte` — VTE terminal grid
- `emulator.process.fork` — clone/fork
- `emulator.process.execve` — execve (tty/termios preserved)
- `emulator.thread.futex` — futex (WAIT/WAKE)
- `emulator.thread.sched-yield` — sched_yield
- `emulator.ipc.pipe` — pipe2
- `emulator.syscall.openat` — openat(2)
- `emulator.syscall.close` — close(2)
- …and 33 more

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
| App conformance & distribution | 11 | 82% | 100% (5/5) |

## Suites
| Suite | Layer | Health | Pass rate | Age (min) |
| ----- | ----- | ------ | --------- | --------- |
| nano/cargo-unit | Core | ok | 100% | 172 |
| nano/node-harness | Runtime | ok | 100% | 202 |
| sdk/sdk-unit | SDK | ok | 87% | 154 |
| terminal/playwright-e2e | Terminal | ok | 100% | 215 |
| catalog/catalog-conformance | Catalog | ok | 100% | 111 |

_Regenerated on every result push. Edit features in `registry/`, never this file._
