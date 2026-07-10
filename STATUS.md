# userland.run — status

> Generated 2026-07-10T17:39:10.628Z · live at https://status.userland.run

**90 / 91 tested features green** (99%) · 157 shipped (79%) · 0 failing now · 76 shipped-but-untested · 0 drift

## Red now
Nothing failing. 🟢

## Shipped but untested (76)
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
- …and 61 more

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
| App conformance & distribution | 57 | 84% | 100% (52/52) |
| Kernel (shared OS layer) | 16 | 81% | 0% (0/0) |
| Node host-engine tier | 16 | 63% | 0% (0/0) |
| WASM tier (WASI apps) | 10 | 50% | 0% (0/0) |

## Suites
| Suite | Layer | Health | Pass rate | Age (min) |
| ----- | ----- | ------ | --------- | --------- |
| nano/cargo-unit | Core | silent | 100% | 14910 |
| nano/node-harness | Runtime | silent | 100% | 15054 |
| sdk/sdk-unit | SDK | silent | 87% | 15763 |
| terminal/playwright-e2e | Terminal | silent | 100% | 19551 |
| catalog/catalog-conformance | Catalog | silent | 100% | 15728 |

_Regenerated on every result push. Edit features in `registry/`, never this file._
