# 12. Defining optional types

Date: 2021-06-01

## Status

Accepted

## Context

In JS there are two non-value values: `undeifined` and `null`. We couldn't find a consensus on when to use each of them.
 
## Decision

We introduced custom type `Nil<T> = T | null | undefined`. 

## Consequences

We will use the custom `Nil` type for any optional variable.
All of us are used to different approaches, but we find this solution promising and will give it a try.
We still may have some pieces of code not following the decision. Please use the boy-scout rule and apply the decision to any file you touch.
