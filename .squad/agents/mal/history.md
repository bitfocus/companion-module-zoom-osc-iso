# Project Context

- **Owner:** Justin James
- **Project:** BitFocus Companion module for Zoom OSC and Zoom ISO applications communicating via OSC protocol
- **Stack:** TypeScript, Node.js, BitFocus Companion SDK
- **Created:** 2026-03-13

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-04-25: Session coordination — merge origin/main into feature/preset-architecture

**Session lead:** Scribe orchestration for Mal (Lead) merge and Zoe (Tester) review

**Merge outcomes:**

- 6 upstream commits integrated including v4.10.0 (ZoomISO v3) and v4.11.0 (polling config options)
- Single yarn.lock conflict resolved via standard regeneration workflow
- All automated checks passing: build ✅, lint ✅, tests ✅ (323/323)
- Low regression risk — all changes backward compatible

**Pattern reinforced:** Config changes require 3 components:

1. Config field additions (config.ts)
2. Upgrade script for migration (upgrades/)
3. Runtime control actions (actions/)

**Documentation:** Detailed decision record merged into decisions.md with full context for team reference.

### 2026-04-25: Merged origin/main into feature/preset-architecture

**Commits merged:** 6 commits from origin/main (b3ec30b back to 4bc88f9)

- v4.11.0: ISO polling config options (#257) - adds configurable polling intervals and enable/disable toggles
- v4.10.0: Updates for ZoomISO v3 (#256)
- Dependency updates: picomatch, flatted, tar

**Conflict resolution:**

- Single conflict in `yarn.lock` resolved by regenerating lockfile with `yarn install`
- Yarn's automatic merge conflict resolution handled dependency tree correctly
- Build verified successful post-merge

**Key changes merged:**

- `src/config.ts`: Added ISO polling configuration options (interval, enable/disable)
- `src/osc.ts`: Refactored polling logic to use new config options
- `src/actions/action-zoomiso-*.ts`: Added actions to control ISO polling at runtime
- `src/upgrades/addPollingConfigOptions.ts`: New upgrade script for config migration
- `src/index.ts`: Registered new upgrade script
- `package.json`: Version bump to v4.11.0

**Pattern learned:** For `yarn.lock` conflicts, the standard workflow is:

1. Accept one side's version (`git checkout --theirs yarn.lock`)
2. Run `yarn install` to regenerate based on merged `package.json`
3. Stage the regenerated lockfile
4. Complete merge commit

This ensures the lockfile accurately reflects the actual merged dependency tree rather than attempting manual conflict resolution.
