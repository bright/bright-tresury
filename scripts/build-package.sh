#!/usr/bin/env bash

source $( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/_shared.sh

if [[ -z "${DEPLOY_ENV}" ]]; then
    echo "DEPLOY_ENV is empty"
    exit 1
fi

set -x

echo $(ls deploy)

docker-compose --file ${PROJECT_DIR}/deploy/docker-compose.yml config

docker-compose \
    --file ${PROJECT_DIR}/deploy/docker-compose.yml \
    build --no-cache


if [[ ! -z "${DOCKER_REGISTRY}" ]]; then
    echo "Push containers to registry"
    aws ecr get-login --registry-ids "${DOCKER_REGISTRY%%.*}" --region eu-central-1 --no-include-email | bash
    # For AWS use e.g.
    # aws ecr get-login [--registry-ids registryId] --no-include-email | bash
    docker-compose \
    --file ${PROJECT_DIR}/deploy/docker-compose.yml \
    push

    docker-compose \
    --file ${PROJECT_DIR}/deploy/docker-compose.yml \
    down --rmi 'all' --volumes  --remove-orphans
else
   echo "No docker registry specified"
   docker-compose \
    --file ${PROJECT_DIR}/deploy/docker-compose.yml \
    down --rmi 'all' --volumes  --remove-orphans
   exit 1
fi
