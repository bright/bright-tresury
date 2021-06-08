# 9. Frontend file naming conventions

Date: 2021-03-10

## Status

Accepted

## Context

We were using different files naming conventions.

## Decision

Files with components we will name after the component name with `CapitalCamelCase`. Example: `IdeaForm.tsx`.
Files with custom hooks we will name after the hook name starting with `use` in `camelCase`. Example: `useIdeaForm.ts`.
Files with other functions/interfaces (for example: api calls, DTOs, utils) we will name with `camelCase` and add the type after a dot. Example: `ideaMilestones.api.ts`.
Folders we will name with `camelCase`.
Test files we will name after the tested component with `.spec` suffix. Example: `useIdeaForm.spec.ts`.

## Consequences

The file names are consistent.
We still may have some pieces of code not following the decision. Please use the boy-scout rule and apply the decision to any file you touch.
