## Substrate node

To run a local Polkadot node go to [Polkadot GitHub page](https://github.com/paritytech/polkadot). You can download it and run locally or in a docker container. In both scenarios run the node in development mode (with `--dev` flag).

### Genesis config

If you have downloaded the source code, you can change some of the config values.

Go to `/runtime/polkadot/src/lib.rs`.

* TermDuration
```rust
pub const TermDuration: BlockNumber = 7 * DAYS;
```
Change it to some smaller value like `3 * MINUTES`.

* SpendPeriod
```rust
pub const SpendPeriod: BlockNumber = 24 * DAYS;
```
Change it to some smaller value like `7 * MINUTES`.

### Tips & tricks

* Council memebrs

To be able to approve or reject the tresury proposals, you need to add some council members. Use [Polkadot JS Apps](https://polkadot.js.org/apps).

Go to *Governance* -> *Council* tab. *Submit candidacy* of three accounts. *Vote* for all three accounts. Wait until the term period ends and the accounts become council members.

* Fill the tresury pot

If you want to add some tokens to the tresury, one easy way would be to submit a proposal for some large amount of tokens and reject it. The bond gets slashed and the tokens go to the tresury.