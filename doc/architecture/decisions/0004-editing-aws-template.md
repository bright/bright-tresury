# 3. editing aws template

Date: 2021-04-19

## Status

Accepted

## Context

We use aws-template.ts file to configure AWS stack. This file should allow us to create a whole AWS stack from scratch.
Sometimes we just want to update our stack by modifying some parts of `aws-template.ts`. There are some cases where
updating stack is working correctly, but creating the stack from scratch using the same file is causing errors.

## Decision

Whenever you change `aws-template.ts` please make sure that this file allows us to create an AWS stack from scratch
without any errors.

## Consequences

Each time we update `aws-template.ts` we should create a separate stack to test if everything works correctly.
