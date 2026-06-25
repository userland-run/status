# userland.run — status

> Generated 2026-06-25T17:19:20.821Z · live at https://status.userland.run

**47 / 48 tested features green** (98%) · 91 shipped (88%) · 0 failing now · 45 shipped-but-untested · 0 drift

## Red now
Nothing failing. 🟢

## Shipped but untested (45)
- `busybox.ls` — ls
- `catalog.pipeline.publish` — package + sign + publish (CDN)
- `emulator.cpu.decode-rv64` — RV64I instruction decode
- `emulator.tty.termios` — TTY line discipline (termios)
- `emulator.term.vte` — VTE terminal grid
- `emulator.process.fork` — clone/fork
- `emulator.process.execve` — execve (tty/termios preserved)
- `emulator.thread.futex` — futex (WAIT/WAKE)
- `emulator.thread.sched-yield` — sched_yield
- `emulator.ipc.pipe` — pipe2
- `emulator.syscall.openat` — openat(2)
- `emulator.syscall.close` — close(2)
- `emulator.syscall.read` — read(2)
- `emulator.syscall.write` — write(2)
- `emulator.syscall.readv` — readv(2)
- …and 30 more

## Drift (0)
No drift. 🟢

## Areas
| Area | Features | Shipped | Green (of tested) |
| ---- | -------- | ------- | ----------------- |
| RISC-V emulator & Linux syscalls | 57 | 88% | 100% (8/8) |
| BusyBox applets | 19 | 100% | 100% (18/18) |
| Dev toolchain | 5 | 100% | 100% (5/5) |
| TypeScript SDK | 9 | 78% | 89% (8/9) |
| WebGPU console | 9 | 56% | 100% (4/4) |
| App conformance & distribution | 5 | 100% | 100% (4/4) |

## Suites
| Suite | Layer | Health | Pass rate | Age (min) |
| ----- | ----- | ------ | --------- | --------- |
| nano/cargo-unit | Core | ok | 100% | 679 |
| nano/node-harness | Runtime | ok | 100% | 674 |
| sdk/sdk-unit | SDK | ok | 89% | 699 |
| terminal/playwright-e2e | Terminal | ok | 100% | 719 |
| catalog/catalog-conformance | Catalog | ok | 100% | 799 |

_Regenerated on every result push. Edit features in `registry/`, never this file._
