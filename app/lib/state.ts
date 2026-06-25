// SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-UEL
// Copyright (C) 2026 And The Next GmbH - https://userland.run
//
// Build-time access to the generated state. `npm run generate` must run first.

import stateJson from "../../data/state.json";
import type { StateJson } from "../../generator/src/types";

export const state = stateJson as unknown as StateJson;

export type { StateJson };
