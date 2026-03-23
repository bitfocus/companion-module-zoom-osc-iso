# Routing Rules

Route work to the best-fit agent based on domain signals.

| Signal                                                       | Agent                     | Why                 |
| ------------------------------------------------------------ | ------------------------- | ------------------- |
| OSC protocol, osc.ts, UDP/TCP messaging                      | Samwise                   | Integration domain  |
| Actions, action definitions, action handlers                 | Samwise                   | Core integration    |
| Feedbacks, feedback state machine, feedback-state-machine.ts | Samwise                   | State/protocol      |
| Variables, variable definitions                              | Merry                     | Companion API layer |
| Presets, preset buttons, presets.ts                          | Merry                     | Companion API layer |
| Companion module API standards, index.ts structure           | Merry                     | Library standards   |
| Upgrade scripts, v2/v3 migration                             | Merry                     | Module definitions  |
| Architecture decisions, multi-file design                    | Gandalf                   | Lead domain         |
| Code review, pull requests                                   | Gandalf                   | Lead domain         |
| Tests, test coverage, edge cases                             | Eowyn                     | Tester domain       |
| Quality checks, regression                                   | Eowyn                     | Tester domain       |
| Session logs, decisions merge                                | Scribe                    | Scribe domain       |
| Work queue, backlog, GitHub issues                           | Ralph                     | Monitor domain      |
| Final approval, sign-off, "ship it", "looks good"            | Justin James              | Human approval gate |
| Multi-domain ("team") requests                               | Gandalf + relevant agents | Fan-out             |
