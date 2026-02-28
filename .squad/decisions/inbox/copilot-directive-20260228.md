### 2026-02-28T17:54:44Z: User directives — Gandalf review clarifications
**By:** Justin James (via Copilot)

**What:**
1. `UpgradeV2ToV3` registered twice is intentional — it runs (not registers) and must run twice. Not a bug.
2. `require()` in osc.ts and feedback-state-machine.ts is intentional — the OSC library does not support ESM. Do not convert to ESM imports.
3. `src/v2CommandsToUpgradeTov3.ts` orphan file at root is intentional — leave it alone.
4. `no-explicit-any` disabled globally — acknowledged as legacy, defer typing improvements to later.

**Why:** User clarification — captured for team memory so agents do not re-flag these as issues.
