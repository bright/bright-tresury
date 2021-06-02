# 7. Services and controllers responsibilities

Date: 2021-03-10

## Status

Accepted

## Context

There are many approaches of what controllers and services may be responsible for.
 
## Decision

Controllers are responsible for:
* incoming data validation (through `class-validator` annotations)
* calling service function
* mapping data returned from the service to DTOs

Services are responsible for performing any database or other services operations. Services can throw HTTP exceptions.

## Consequences

The responsibilities of services and controllers are clearly defined. 
