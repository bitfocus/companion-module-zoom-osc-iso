### 2026-02-28T17:54:44Z: User directives from project review feedback

**By:** Justin James (via Copilot)

**What:**
1. `UpgradeV2ToV3` registered twice in `runEntrypoint()` is **intentional** — it is not registering but running the upgrade, and it needs to run twice. Do NOT flag as a bug.
2. The `require()` call for the `osc` library in `osc.ts` is **intentional** — the osc npm package does not support ESM imports. Do NOT flag as a concern.
3. The orphan file `src/v2CommandsToUpgradeTov3.ts` at the repo root is **intentional** — leave it in place. Do NOT suggest removing it.
4. The widespread use of `any` types (especially in `osc.ts` and `utils.ts`) is **known legacy debt** — leave for later, do not prioritize.

**Why:** User review of Gandalf's project structure analysis — correcting false positives.
