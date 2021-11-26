#!/usr/bin/env bash

source $( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/_shared.sh

set -x

docker-compose \
    --file ${PROJECT_DIR}/deploy/docker-compose.test.yml \
    build --no-cache

#docker-compose \
#    --file ${PROJECT_DIR}/deploy/docker-compose.test.yml \
#    run backend-test-ci

docker-compose \
    --file ${PROJECT_DIR}/deploy/docker-compose.test.yml \
    down --rmi 'all' --volumes  --remove-orphans
