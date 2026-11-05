---
name: issue-and-pr-authoring
description: Draft clear GitHub bug, feature, and enhancement issues, plus pull-request descriptions. Use when creating or refining repository-tracking work items or PR copy.
---

# Issue and PR Authoring

Write concise, actionable GitHub copy using only details the requester has supplied or that are verified in the repository. Do not invent reproduction steps, expected behavior, acceptance criteria, metrics, links, or test results. Mark unknown but useful information as `TBD` or ask a focused question when it prevents a usable draft.

Match the repository's existing issue and pull-request templates when they exist. If none apply, use the relevant template below. Preserve exact issue forms, required labels, and contribution guidance.

## Bug issue

```md
## Summary

<!-- What is broken, for whom, and its impact? -->

## Environment

- Version/commit:
- Platform/runtime:
- Configuration:

## Steps to reproduce

1.
2.
3.

## Actual behavior

## Expected behavior

## Evidence

<!-- Logs, screenshots, stack traces, or a minimal reproduction. Remove sensitive data. -->

## Proposed direction (optional)

## Acceptance criteria

- [ ]

## Additional context
```

## Feature issue

```md
## Problem

<!-- Describe the user need or workflow, not just the requested solution. -->

## Proposed outcome

## Users and use cases

- As a ..., I want ..., so that ...

## Scope

### In scope

-

### Out of scope

-

## Acceptance criteria

- [ ]

## Open questions / dependencies

-

## Additional context
```

## Enhancement issue

```md
## Current experience

## Improvement requested

## Why this matters

<!-- User value, reliability, maintainability, performance, or operational benefit. -->

## Proposed approach (optional)

## Acceptance criteria

- [ ]

## Trade-offs, dependencies, or risks

## Additional context
```

## Pull-request description

```md
## Summary

<!-- What changed and why? -->

## Changes

-

## Validation

- [ ] Tests: <!-- command and result -->
- [ ] Manual verification: <!-- steps and result -->

## Risks and rollout

<!-- Compatibility, migrations, feature flags, monitoring, or rollback. State "None identified" only when verified. -->

## Related work

<!-- Closes #123; related issue, design, or discussion. -->

## Screenshots / recordings

<!-- Required for user-facing changes when useful. -->
```

## Writing checks

- Lead with the outcome and impact; use concrete, observable language.
- Make acceptance criteria testable and independent where possible.
- Separate facts, proposals, and unanswered questions.
- Keep issue scope narrow. Split unrelated work into separate issues.
- For PRs, report only validation actually performed; state omitted checks and their reason.
- Remove template comments and empty sections before publishing unless they convey a meaningful unknown.
