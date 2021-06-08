# 8. Testing services and controllers

Date: 2021-03-10

## Status

Accepted

## Context

Following the 0007 decision we needed to decide how to organize the service and controller tests.

## Decision

In `controller.spec.ts` suffixed files we will test:

-   incoming data validation
-   required authentication
-   outgoing data structure
-   HTTP status on success.

In `controller.e2e.spec.ts` suffixed files we will test the whole happy path.
An example flow for a typical CRUD controller:

-   post request to create an object
-   get request to read the created object
-   patch request to change the object
-   get all to read again.

In `service.spec.ts` suffixed files we test the features against the real database and blockchain. In details we test:

-   happy path
-   edge cases
-   HTTP exceptions thrown.

## Consequences

We have consistent tests all over the project.
We still may have some pieces of code not following the decision. Please use the boy-scout rule and apply the decision to any file you touch.
