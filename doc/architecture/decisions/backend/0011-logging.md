# 11. Logging

Date: 2021-03-10

## Status

Accepted

## Context

I cannot stress enough how important it is to have log messages printed whenever something meaningful happens inside the application.

## Decision

As a rule of thumb:

-   try {} catch {}`should have the`error`printed in the`catch` clause
-   any business logic operation should print an `info` depicting what happened.
-   whenever there is some logic in code (e.g. `if`) one should **consider** adding `debug` describing why a branch was selected

Since most of our deployments happen on AWS and [CloudWatch](https://aws.amazon.com/about-aws/whats-new/2015/01/20/amazon-cloudwatch-logs-json-log-format-support/) supports JSON parsing the pack uses [structured logging](https://www.google.com/search?q=structured+logging).
The pack uses [node-bunyan](https://github.com/trentm/node-bunyan) as logging implementation.
Here are some examples of log statements:

```typescript
const logger = getLogger()

async function someBusinessLogic(userId) {
    try {
        logger.info({ message: `About to run logic`, userId })
        // run some logic
    } catch (e) {
        logger.error({
            message: 'Failed to to perform some logic',
            userId,
            err: e,
        })
    }
}
```

**Note that the `e` variable is passed to the `error` function under `err` key.**

## Consequences

We will be able to "debug" the production application.
We will be able to have a clear view on logs in CloudWatch.
