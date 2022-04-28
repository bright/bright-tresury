#!/usr/bin/env bash

set -e

export SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export PROJECT_DIR="$( cd "${SCRIPT_DIR}/.."  && pwd )"

export VCS_VERSION=${VCS_VERSION:-${BUILD_VCS_NUMBER:-$(git rev-parse HEAD)}}

export VCS_SHORT_VERSION=$(git rev-parse --short HEAD)

export PROJECT_NAME=treasury

export DOCKER_REGISTRY=${DOCKER_REGISTRY:-''}

export AWS_REGION=${AWS_REGION:-eu-central-1}

function docker-compose {
    TAG=${VCS_VERSION}_${DEPLOY_ENV} command docker-compose --project-name treasury "${@}"
}

if [[ ! -z "${DOCKER_REGISTRY}" ]]; then
    if [[ ! "${DOCKER_REGISTRY}" == */ ]]; then
        echo "Append / to DOCKER_REGISTRY=${DOCKER_REGISTRY}"
        DOCKER_REGISTRY="${DOCKER_REGISTRY}/"
    fi
fi

function aws(){
    command aws "$@" --region ${AWS_REGION}
}
