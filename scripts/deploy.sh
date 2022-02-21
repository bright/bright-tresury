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
aws s3 cp ./deploy/aws.template s3://${aws_bucket_name}/aws-${DEPLOY_ENV}.template

stack_name="${PROJECT_NAME}-app-${DEPLOY_ENV}"
stack_exists=$(aws cloudformation list-stacks --query "StackSummaries[?StackName == '${stack_name}' && StackStatus != 'DELETE_COMPLETE']")

deploy_params="\
ParameterKey=DeployEnv,ParameterValue=${DEPLOY_ENV} \
ParameterKey=AppImage,ParameterValue=${DOCKER_REGISTRY}treasury:${VCS_VERSION} \
ParameterKey=PolkadotImage,ParameterValue=public.ecr.aws/x2h8r1m3/treasury/polkadot-dev:v0.9.16"


if [[ ${stack_exists} =~ "[]" ]]; then
    echo "Create new app stack: ${stack_name}"
    set +e
    result=$(aws cloudformation create-stack --stack-name ${stack_name} \
      --disable-rollback \
      --capabilities CAPABILITY_IAM \
      --debug \
      --template-url https://treasury-deployments-265126396833.s3.eu-central-1.amazonaws.com/aws-${DEPLOY_ENV}.template \
      --parameters ${deploy_params} 2>&1)

    exit_code=$?
    set -e
    if [[ ${exit_code} != 0 ]]; then
        echo "Error occurred"
        echo ${result}
        exit ${exit_code}
    fi

    aws cloudformation wait stack-create-complete --stack-name ${stack_name}
    echo "Stack ${stack_name} create complete."
else
    echo "Update existing app stack: ${stack_name}"
    set +e
    result=$(aws cloudformation update-stack --stack-name ${stack_name} \
      --capabilities CAPABILITY_IAM \
      --debug \
      --template-url https://treasury-deployments-265126396833.s3.eu-central-1.amazonaws.com/aws-${DEPLOY_ENV}.template \
      --parameters ${deploy_params} 2>&1)

    exit_code=$?
    set -e
    if [[ ${exit_code} != 0 ]]; then
        if [[ ! ${result} =~ "No updates are to be performed" ]]; then
            echo "Error occurred"
            echo ${result}
            exit ${exit_code}
        else
            echo "No updates to be performed, exiting."
            exit 0
        fi
    fi

    aws cloudformation wait stack-update-complete --stack-name ${stack_name}
    echo "Stack ${stack_name} update complete."
fi

popd
