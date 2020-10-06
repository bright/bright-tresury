#!/usr/bin/env bash

source $( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/_shared.sh

set -x

docker-compose \
    --file "${PROJECT_DIR}"/deploy/docker-compose.yml \
    build

docker-compose \
    --file "${PROJECT_DIR}"/deploy/docker-compose.yml \
    run backend-test-ci

if [[ -n "${DOCKER_REGISTRY}" ]]; then
    echo "Push containers to registry"
    aws ecr get-login --registry-ids "${DOCKER_REGISTRY%%.*}" --no-include-email | bash
    docker-compose \
    --file "${PROJECT_DIR}"/deploy/docker-compose.yml \
    push backend
fi

docker-compose \
    --file "${PROJECT_DIR}"/deploy/docker-compose.yml \
    down \
    --rmi all \
    --remove-orphans
