# 3. config files location

Date: 2021-03-10

## Status

Accepted

## Context

We use many config files for config schemas. We use it to separate abstraction of config values.

## Decision

Config files should contain a config token. This token should be used in the main src/config/config.ts file for
obtaining a provider.
We should always add a provider for new config schemas.

Config files should be placed in the directory they relate to.
E.g.: if config file contains database configuration, please place it next to database module

## Consequences

Config schemas would be spread all over the project, but anytime we want to see all of its components we can see
the list of the providers and a general `AppConfig` schema placed in src/config/config.ts file.
