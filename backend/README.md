## Local development

Run once:
 `../deploy/database/init-user-db.sh`.

Run:
* `nvm use`
* `npm install`
* `npm run compile`
* `DEPLOY_ENV=development-local npm run database:migrate`
* `DEPLOY_ENV=development-local npm run main`

Access [api documentation](http://localhost:3001/api/documentation/)

Run tests
* `npm run compile`
* `DEPLOY_ENV=test-local npm run database:migrate`
* to run all tests `DEPLOY_ENV=test-local npm run test`
* to run a single test suit `DEPLOY_ENV=test-local npm run test -- testSuitName`

## Configuration

The pack uses [node-convict](https://github.com/mozilla/node-convict) for configuration.
A config schema for particular module should reside close to that module e.g. database.config.ts is inside database.


The configuration is loaded from multiple sources: defaults given in code, `/config/default.json`, files matching environment in `/config` e.g. `/config/development.json`, AWS SSM when not in test or development.

### AWS

Any secrets e.g. database password, should be configured through AWS SSM.
As an example a dot path to database password in `AppConfig` is:
```
database.password
```
To set this parameter **on stage** through AWS SSM we need to create a (secure) parameter named
```
/stage/database/password
```

As you can see the parameter name is prefixed with environment name.
Note that it's possible to pass a more complex prefix to `tryLoadParamsFromSSM`.

#### AWS credentials

Please do not add `AWS_SECRET_ACCESS_KEY` and `AWS_ACCESS_KEY_ID` to `AWSConfig`. 
All AWS SDK pick credentials automatically using environment variables and instance profiles/roles. 
You should prefer using the instance profiles/roles.
In local development you can use `AWS_PROFILE` environment variable to instruct `aws-sdk` which **locally** configured credentials it should use.   

## Logging

I cannot stress enough how important it is to have log messages printed whenever something meaningful happens inside the application. 
As a rule of thumb:
- try {} catch {}` should have the `error` printed in the `catch` clause
- any business logic operation should print an `info` depicting what happened.
- whenever there is some logic in code (e.g. `if`) one should **consider** adding `debug` describing why a branch was selected

Since most of our deployments happen on AWS and [CloudWatch](https://aws.amazon.com/about-aws/whats-new/2015/01/20/amazon-cloudwatch-logs-json-log-format-support/) supports JSON parsing the pack uses [structured logging](https://www.google.com/search?q=structured+logging).
The pack uses [node-bunyan](https://github.com/trentm/node-bunyan) as logging implementation.
Here are some examples of log statements:

```typescript

const logger = getLogger()

async function someBusinessLogic(userId){
    try {
        logger.info({message: `About to run logic`, userId})
        // run some logic
    } catch(e){
        logger.error({
            message: "Failed to to perform some logic",
            userId,
            err: e
        })
    }
}
``` 

**Note that the `e` variable is passed to the `error` function under `err` key.** 

