# Treasury app

This is an application to interact with a treasury module of Substrate based networks.

This repo contains:

-   backend
    -   database which keeps contextual data
    -   event listener to track on-chain updates
    -   REST API with documentation
    -   React frontend application available on

## Testing env

We have a testing environment set up. You can register and play with the app:

-   the front end app: [https://testing.treasury.brightinventions.pl/](https://testing.treasury.brightinventions.pl/)
-   the backend api: [https://testing.treasury.brightinventions.pl/api/health](https://testing.treasury.brightinventions.pl/api/health)
-   the backend api documentation: [https://testing.treasury.brightinventions.pl/api/documentation/](https://testing.treasury.brightinventions.pl/api/documentation/)
-   the Polkadot node (in development mode): wss://testing.treasury.brightinventions.pl:9944. You can access it with Polkadot JS Apps [https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ftesting.treasury.brightinventions.pl%3A9944#/council](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ftesting.treasury.brightinventions.pl%3A9944#/council).

## Running

In order to run a standalone treasury app, open terminal and do:

-   `cd deploy`
-   `docker-compose --file docker-compose.development-docker.yml up`

This will run the frontend and the backend together with PostgreSQL database, authentication core and a local Polkadot node (in development mode) in docker containers.
After the booting process is finished, open your web browser and go to [http://localhost:3001/](http://localhost:3001/).

## Development

In order to start development you will have to start backend server and frontend locally. To run backend and frontend in development mode (without running them inside docker containers) check the corresponding readme files.
