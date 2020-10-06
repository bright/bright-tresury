#!/usr/bin/env bash

source $( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/_shared.sh

docker-compose \
    --file ${PROJECT_DIR}/deploy/docker-compose.yml \
    up database backend-development
