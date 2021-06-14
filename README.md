# Treasury app

This is an application to interact with a treasury module of Substrate based networks.

This repo contains:

-   backend
    -   database which keeps contextual data
    -   event listener to track on-chain updates
    -   REST API with [documentation](http://localhost:3001/api/documentation/)
-   frontend
    -   React frontend application available on [http://localhost:3000/](http://localhost:3000/)

## Testing env

We have a testing environment set up. You can register and play with the app:

-   the front end app: www.testing.treasury.brightinventions.pl
-   the backend api: www.testing.treasury.brightinventions.pl:3000
-   the backend api documentation: www.testing.treasury.brightinventions.pl:3000/api/documentation
-   the Polkadot node (in development mode): ws://52.57.233.92:9944 (only via ws, no wss available). To access it with Polkadot JS Apps, you need to run an instance by yourself. [Here](https://github.com/polkadot-js/apps#docker) is an instruction how to run it in Docker.

## Development

To run backend and frontend in development mode see the corresponding readme files.

### Local Substrate node

You can connect to any of the live Substrate based network (_currently configured in code_). To run a local Polkadot node go to [Polkadot GitHub page](https://github.com/paritytech/polkadot). You can download it and run locally or in a docker container. In both scenarios run the node in development mode (with `--dev` flag).

TLDR: run docker command:

`docker run -p 9944:9944 -p 9933:9933 parity/polkadot:v0.8.30 --rpc-external --ws-external --dev`

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

`polkadot purge-chain --dev`
