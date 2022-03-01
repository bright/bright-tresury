#!/usr/bin/env bash

source $( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/_shared.sh

set -x

compose=${PROJECT_DIR}/deploy/docker-compose.test.yml

if [[ ${LATEST_POLKADOT} = true ]]; then
  compose="${PROJECT_DIR}/deploy/docker-compose.test-latest-polkadot.yml"
fi

docker-compose \
    --file ${compose} \
    build --no-cache

docker-compose \
    --file ${compose} \
    run backend-test-ci

docker-compose \
    --file ${compose} \
    down --rmi 'all' --volumes  --remove-orphans
