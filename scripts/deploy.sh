#!/usr/bin/env bash

source $( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/_shared.sh

if [[ -z "${DEPLOY_ENV}" ]]; then
    echo "DEPLOY_ENV is empty"
    exit 1
fi

set -eux

pushd ${PROJECT_DIR}

aws_bucket_name="${PROJECT_NAME}-deployments-265126396833"

npm i --prefix deploy
npm run --prefix deploy generate-aws-template

stack_name="${PROJECT_NAME}-app-${DEPLOY_ENV}"

# run once
# in shell that has AWS access keys for target environment and AWS_REGION variable set
npm run cdk bootstrap
npm run cdk -- deploy --require-approval=never

popd
