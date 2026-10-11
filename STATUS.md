# userland.run — status

> Generated 2026-10-11T12:05:59.705Z · live at https://status.userland.run

**94 / 98 tested features green** (96%) · 189 shipped (80%) · 3 failing now · 103 shipped-but-untested · 1 drift

## Red now
- `catalog.recipe.difftastic` — difftastic (structural diff) (Catalog) · https://github.com/userland-run/catalog/actions/runs/38137156233
- `catalog.pipeline.conformance` — conformance harness (Catalog) · https://github.com/userland-run/catalog/actions/runs/38137156233
- `catalog.pipeline.gate` — syscall gate (pinned manifest) (Catalog) · https://github.com/userland-run/catalog/actions/runs/38137156233

## Shipped but untested (103)
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
- …and 88 more

## Drift (1)
- in-progress > 60d: `terminal.phase.1` — Phase 1 — Vello/WebGPU renderer (since 2026-06)

## Areas
| Area | Features | Shipped | Green (of tested) |
| ---- | -------- | ------- | ----------------- |
| RISC-V emulator & Linux syscalls | 57 | 88% | 100% (9/9) |
| BusyBox applets | 19 | 100% | 100% (17/17) |
| Dev toolchain | 5 | 0% | 0% (0/0) |
| TypeScript SDK | 16 | 81% | 89% (8/9) |
| WebGPU console | 15 | 73% | 100% (9/9) |
| App conformance & distribution | 62 | 77% | 94% (51/54) |
| Kernel (shared OS layer) | 16 | 81% | 0% (0/0) |
| Node host-engine tier | 24 | 67% | 0% (0/0) |
| BusyBox applets for nodert | 7 | 86% | 0% (0/0) |
| WASM tier (WASI apps) | 16 | 81% | 0% (0/0) |

## Suites
| Suite | Layer | Health | Pass rate | Age (min) |
| ----- | ----- | ------ | --------- | --------- |
| nano/cargo-unit | Core | ok | 100% | 161 |
| nano/node-harness | Runtime | ok | 100% | 160 |
| sdk/sdk-unit | SDK | ok | 88% | 287 |
| terminal/playwright-e2e | Terminal | ok | 100% | 8 |
| catalog/catalog-conformance | Catalog | ok | 98% | 2 |

_Regenerated on every result push. Edit features in `registry/`, never this file._
