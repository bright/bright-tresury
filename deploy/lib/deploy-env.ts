function requireEnv(envName: string) {
    const value = process.env[envName]
    if (!value) {
        throw new Error('No env value provided for ' + envName)
    }
    return value
}

export function deployEnv() {
    return requireEnv('DEPLOY_ENV')
}

export function dockerRegistry() {
    return requireEnv('DOCKER_REGISTRY')
}

export function vcsVersion() {
    return requireEnv('VCS_VERSION')
}

export const PROJECT_NAME = 'treasury'
