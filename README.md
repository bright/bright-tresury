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

## Running

In order to run standalone treasury app, open terminal and do:

-   `cd deploy`
-   `docker-compose --file docker-compose.development-docker.yml up`

This will run frontend and backend together with postgres database, authentication:core and local dev polkadot node in docker containers.
After the booting process is finished, open your web browser and go to [http://localhost:3001/](http://localhost:3001/)

## Development

In order to start development you will have to start backend server and frontend locally. To run backend and frontend in development mode (without running them inside docker containers) check the corresponding readme files.
