# userland.run — status

> Generated 2026-06-25T16:28:09.339Z · live at https://status.userland.run

**50 / 51 tested features green** (98%) · 91 shipped (88%) · 0 failing now · 42 shipped-but-untested · 0 drift

## Red now
Nothing failing. 🟢

## Shipped but untested (42)
- `busybox.ls` — ls
- `catalog.pipeline.publish` — package + sign + publish (CDN)
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
- `emulator.syscall.writev` — writev(2)
- `emulator.syscall.pread64` — pread64(2)
- `emulator.syscall.lseek` — lseek(2)
- …and 27 more

## Drift (0)
No drift. 🟢

## Areas
| Area | Features | Shipped | Green (of tested) |
| ---- | -------- | ------- | ----------------- |
| RISC-V emulator & Linux syscalls | 57 | 88% | 100% (11/11) |
| BusyBox applets | 19 | 100% | 100% (18/18) |
| Dev toolchain | 5 | 100% | 100% (5/5) |
| TypeScript SDK | 9 | 78% | 89% (8/9) |
| WebGPU console | 9 | 56% | 100% (4/4) |
| App conformance & distribution | 5 | 100% | 100% (4/4) |

## Suites
| Suite | Layer | Health | Pass rate | Age (min) |
| ----- | ----- | ------ | --------- | --------- |
| nano/cargo-unit | Core | ok | 100% | 628 |
| nano/node-harness | Runtime | ok | 100% | 623 |
| sdk/sdk-unit | SDK | ok | 89% | 648 |
| terminal/playwright-e2e | Terminal | ok | 100% | 668 |
| catalog/catalog-conformance | Catalog | ok | 100% | 748 |

_Regenerated on every result push. Edit features in `registry/`, never this file._
