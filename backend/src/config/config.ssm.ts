import { SSM } from "aws-sdk";
import { GetParametersByPathResult, ParameterList } from "aws-sdk/clients/ssm";
import { AWSConfig } from "../aws.config";
import { getLogger } from "../logging.module";
import { set } from "lodash"

const logger = getLogger();

export async function tryLoadParamsFromSSM(awsConfig: AWSConfig, deployEnv: string, prefix = `/treasury-${deployEnv}/`) {
    if (/(test|test-local|development-local)/.test(deployEnv)) {
        logger.debug("Skipping loading parameters from ssm");
        return null
    }

    const ssm = new SSM({ region: awsConfig.region })
    let nextToken: string | undefined = undefined
    let result: ParameterList = []
    logger.debug("Fetch parameters from SSM")
    do {
        const byPath: GetParametersByPathResult = await ssm.getParametersByPath({
            Path: prefix,
            Recursive: true,
            MaxResults: 10, // 1-10,
            WithDecryption: true,
            NextToken: nextToken
        }).promise();
        nextToken = byPath.NextToken
        result = result.concat(byPath.Parameters || [])
    } while (nextToken)

    const config = result.reduce((acc, parameter) => {
        const parameterNoPrefix = parameter.Name && parameter.Name.substr(prefix.length)
        if (!parameterNoPrefix) {
            return acc;
        }
        const dotPath = parameterNoPrefix
            .replace(/^\//, '')
            .replace(/\/$/, '')
            .replace(/\//g, '.')

        set(acc, dotPath, parameter.Value)

        return acc;
    }, {})

    return config;
}
