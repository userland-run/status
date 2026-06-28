# userland.run — status

> Generated 2026-06-28T04:25:38.882Z · live at https://status.userland.run

**87 / 91 tested features green** (96%) · 129 shipped (83%) · 3 failing now · 48 shipped-but-untested · 0 drift

## Red now
- `catalog.recipe.hck` — hck (cut alt) (Catalog) · https://github.com/userland-run/catalog/actions/runs/28311094475
- `catalog.pipeline.conformance` — conformance harness (Catalog) · https://github.com/userland-run/catalog/actions/runs/28311094475
- `catalog.pipeline.gate` — syscall gate (pinned manifest) (Catalog) · https://github.com/userland-run/catalog/actions/runs/28311094475

## Shipped but untested (48)
- `busybox.shell.ash` — ash shell (/bin/sh)
- `busybox.ls` — ls
- `catalog.net.bridge` — host-fetch bridge (/dev/__net__)
- `catalog.net.cors-proxy` — Tier-1.5 CORS-proxy Worker
- `catalog.pipeline.bottling` — topic bundles
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
| App conformance & distribution | 57 | 84% | 94% (49/52) |

## Suites
| Suite | Layer | Health | Pass rate | Age (min) |
| ----- | ----- | ------ | --------- | --------- |
| nano/cargo-unit | Core | ok | 100% | 35 |
| nano/node-harness | Runtime | ok | 100% | 1325 |
| sdk/sdk-unit | SDK | ok | 87% | 1178 |
| terminal/playwright-e2e | Terminal | ok | 100% | 1477 |
| catalog/catalog-conformance | Catalog | ok | 98% | 1 |

_Regenerated on every result push. Edit features in `registry/`, never this file._
