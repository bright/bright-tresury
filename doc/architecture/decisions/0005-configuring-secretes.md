# 12. Configuring and storing secrets

Date: 2021-06-01

## Status

Accepted

## Context

We should not store the secrets in plain text.
 
## Decision

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

Please do not add `AWS_SECRET_ACCESS_KEY` and `AWS_ACCESS_KEY_ID` to `AWSConfig`. 
All AWS SDK pick credentials automatically using environment variables and instance profiles/roles. 
You should prefer using the instance profiles/roles. Consider using `aws-vault`.
In local development you can use `AWS_PROFILE` environment variable to instruct `aws-sdk` which **locally** configured credentials it should use.   
 

## Consequences

We will use the custom `Nil` type for any optional variable.
All of us are used to different approaches, but we find this solution promising and will give it a try.
We still may have some pieces of code not following the decision. Please use the boy-scout rule and apply the decision to any file you touch.
