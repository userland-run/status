# userland.run — status

> Generated 2026-07-10T20:46:56.902Z · live at https://status.userland.run

**87 / 91 tested features green** (96%) · 177 shipped (81%) · 3 failing now · 96 shipped-but-untested · 0 drift

## Red now
- `catalog.recipe.difftastic` — difftastic (structural diff) (Catalog) · https://github.com/userland-run/catalog/actions/runs/28559823077
- `catalog.pipeline.conformance` — conformance harness (Catalog) · https://github.com/userland-run/catalog/actions/runs/28559823077
- `catalog.pipeline.gate` — syscall gate (pinned manifest) (Catalog) · https://github.com/userland-run/catalog/actions/runs/28559823077

## Shipped but untested (96)
- `applets.vm.warm` — warm-VM applet spawn (no per-command boot)
- `applets.crosstier` — cross-tier shell — busybox applets + nodert node over one VFS
- `applets.pipeline` — pipelines across tiers (nodert → busybox → nodert)
- `applets.native` — kernel-native applet substitutes (cat/echo/wc/head/tail/ls in JS)
- `applets.difftest` — applet difftest corpus vs BusyBox oracle (byte-identical)
- `applets.fallback` — per-invocation flag fallback to the VM applet
- `busybox.shell.ash` — ash shell (/bin/sh)
- `busybox.ls` — ls
- `catalog.net.bridge` — host-fetch bridge (/dev/__net__)
- `catalog.net.cors-proxy` — Tier-1.5 CORS-proxy Worker
- `catalog.pipeline.bottling` — topic bundles
- `catalog.pipeline.publish` — package + sign + publish (CDN)
- `emulator.tty.termios` — TTY line discipline (termios)
- `emulator.term.vte` — VTE terminal grid
- `emulator.process.fork` — clone/fork
- …and 81 more

## Drift (0)
No drift. 🟢

## Areas
| Area | Features | Shipped | Green (of tested) |
| ---- | -------- | ------- | ----------------- |
| RISC-V emulator & Linux syscalls | 57 | 88% | 100% (9/9) |
| BusyBox applets | 19 | 100% | 100% (17/17) |
| Dev toolchain | 5 | 0% | 0% (0/0) |
| TypeScript SDK | 12 | 75% | 89% (8/9) |
| WebGPU console | 9 | 56% | 100% (4/4) |
| App conformance & distribution | 57 | 84% | 94% (49/52) |
| Kernel (shared OS layer) | 16 | 81% | 0% (0/0) |
| Node host-engine tier | 22 | 68% | 0% (0/0) |
| BusyBox applets for nodert | 7 | 86% | 0% (0/0) |
| WASM tier (WASI apps) | 15 | 80% | 0% (0/0) |

## Suites
| Suite | Layer | Health | Pass rate | Age (min) |
| ----- | ----- | ------ | --------- | --------- |
| nano/cargo-unit | Core | ok | 100% | 855 |
| nano/node-harness | Runtime | ok | 100% | 854 |
| sdk/sdk-unit | SDK | ok | 87% | 2 |
| terminal/playwright-e2e | Terminal | silent | 100% | 19738 |
| catalog/catalog-conformance | Catalog | silent | 98% | 12649 |

_Regenerated on every result push. Edit features in `registry/`, never this file._
