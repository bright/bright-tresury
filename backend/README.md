# Local development

## Dependencies:

-   Install [nvm](https://github.com/nvm-sh/nvm#install--update-script)
-   Install and use current npm and node: `nvm install v14.16.1; nvm use`  
    (please check [.nvmrc](../.nvmrc) for the currently used node version and if need update this README)
-   Install NestJS CLI: `npm install -g @nestjs/cli`
-   Install Docker: https://docs.docker.com/docker-for-mac/install/
-   Install Polkadot node: see below to learn more
-   Install PostgreSQL: see below to learn more

In order to work correctly Treasury module needs to connect to the Substrate Node, PostgreSQL and SuperTokens Server. All of them can be easily run using `deploy/docker-compose.development-local.yml` file.
To start those processes run the following commands:

-   `cd ../deploy`
-   `docker-compose -p development-local --file docker-compose.development-local.yml up`

This will start all mentioned containers.

#### Running Backend

Make sure that PostgreSQL, Polkadot node and SuperTokens(`authorization`) containers are up and do:

-   `nvm use`
-   `npm install`
-   `npm run compile`
-   `DEPLOY_ENV=development-local DATABASE_USERNAME=deployer npm run database:migrate`
-   `DEPLOY_ENV=development-local npm run main`

Access [api documentation](http://localhost:3001/api/documentation/)

#### Running tests

Make sure that PostgreSQL, Polkadot node and SuperTokens(`authorization-test`) containers are up. In addition, Polkadot node needs to be purge (see notes below)

-   `npm run compile`
-   `DEPLOY_ENV=test-local DATABASE_USERNAME=deployer npm run database:migrate`
-   to run all tests `DEPLOY_ENV=test-local npm run test`
-   to run a single test suit `DEPLOY_ENV=test-local npm run test -- testSuitName`

If you do not want to run those in docker container read instructions below.

## PostgreSQL

Running PostgreSQL using docker container:

-   `cd ../deploy`
-   `docker-compose -p development-local --file docker-compose.development-local.yml up database`

If you don't want to use docker do:

1. Install PostgreSQL from https://postgresapp.com/
2. Make sure that your PostgreSQL does not restrict providing a password for roles. It can be done by editing pg_hba.conf postgres configuration file and changing `METHOD` value to `trust`.
3. Run once: `../deploy/database/init-user-db.sh`
4. make sure that `web` role has required privileges for `treasury` and `treasury_test` database. The required privileges are: `select, insert, update, delete, truncate`.

## Polkadot Node

You can connect to any of the live Substrate based network (_currently configured in code_).
To run a local Polkadot node go to [Polkadot GitHub page](https://github.com/paritytech/polkadot). You can download it and run locally or in a docker container.
In both scenarios run the node in development mode (with `--dev` flag).

Running Polkadot node using docker container

-   `cd ../deploy`
-   `docker-compose -p development-local --file docker-compose.development-local.yml up substrate`

If you don't want to use docker do:

1. Clone polkadot node code from [here](https://github.com/paritytech/polkadot) and run it locally.  
   (follow polkadot [README.md](https://github.com/paritytech/polkadot/blob/master/README.md) for installation details)

### purge-chain

Sometimes you may want to purge your polkadot chain (for example when you encounter "Unexpected epoch change" error, or before running tests)
You can do it by issuing following command:

-   if running polkadot inside docker container: `docker exec substrate polkadot purge-chain -d /polkadot/.local/share/polkadot --dev -y`
-   if running polkadot without docker container: `polkadot purge-chain --dev`

### Genesis config

If you have downloaded the source code, you can change some of the config values.

Go to `/runtime/polkadot/src/lib.rs`.

-   TermDuration

```rust
pub const TermDuration: BlockNumber = 7 * DAYS;
```

Change it to some smaller value like `3 * MINUTES`.

-   SpendPeriod

```rust
pub const SpendPeriod: BlockNumber = 24 * DAYS;
```

Change it to some smaller value like `7 * MINUTES`.

### Tips & tricks

-   Council memebrs

To be able to approve or reject the tresury proposals, you need to add some council members. Use [Polkadot JS Apps](https://polkadot.js.org/apps).

Go to _Governance_ -> _Council_ tab. _Submit candidacy_ of three accounts. _Vote_ for all three accounts. Wait until the term period ends and the accounts become council members.

-   Fill the tresury pot

If you want to add some tokens to the tresury, one easy way would be to submit a proposal for some large amount of tokens and reject it. The bond gets slashed and the tokens go to the tresury.

-   Unexpeced epoch change

If you run your local node you may encounter "Unexpected epoch change" error. The only way to fix it is to purge the chain:

-   if started without docker-compose: `polkadot purge-chain --dev`
-   if started using docker-compose: `docker exec substrate polkadot purge-chain -d /polkadot/.local/share/polkadot --dev -y`

## Authorization

We are using SuperTokens as authorization core.

The core is running on a docker container. The auth core uses its own database, but needs to connect to the database server
instance. If you don't run PostgreSQL server in docker container you need to modify the configuration, so SuperTokens server connects to your PostgreSQL instance.

1. Edit your PostgreSQL config file named `pg_hba.conf` by adding the following line:

```
host all all 0.0.0.0/0 trust
```

2. Edit your PostgreSQL config file named `postgresql.conf` by adding the following line:

```
listen_addresses = '*'
```

For development please run the following command:

```
DEPLOY_ENV=development-local npm run auth:core:dev
```

For tests please run the following command:

```
DEPLOY_ENV=test-local npm run auth:core:test
```

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
