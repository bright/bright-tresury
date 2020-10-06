import { CfnTag } from "@aws-cdk/cdk";

export const DEPLOY_ENV = process.env.DEPLOY_ENV || 'stage';

export function envSpecificName(name: string) {
    const prefix = DEPLOY_ENV + "-";
    if (name.startsWith(prefix)) {
        return name
    } else {
        return `${prefix}${name}`
    }
}

export const PROJECT_NAME = "project_name";

export function projectEnvSpecificName(name: string) {
    const prefix = PROJECT_NAME.replace('_', '-') + "-" + DEPLOY_ENV + "-";
    if (name.startsWith(prefix)) {
        return name
    } else {
        return `${prefix}${name}`
    }
}

export function resolveSecureParameter(parameterPath: string, version: number = 1) {
    return `{{resolve:ssm-secure:/${DEPLOY_ENV}${parameterPath}:${version}}}`;
}

export function resolveParameter(parameterPath: string, version: number = 1) {
    return `{{resolve:ssm:/${DEPLOY_ENV}${parameterPath}:${version}}}`;
}

// eFP9StZ5EK16LKuAdVKL7gVt$6*5hs
export const standardTags: CfnTag[] = [{
    key: "deployEnv",
    value: DEPLOY_ENV
}, {
    key: "projectName",
    value: PROJECT_NAME
}]
