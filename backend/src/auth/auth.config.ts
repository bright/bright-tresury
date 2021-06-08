import { Schema } from 'convict'
import { stringFormat } from '../config/formats/string.format'
import { booleanFormat } from '../config/formats/boolean.format'

export interface AuthConfig {
    cookieSecure: boolean
    coreUrl: string
}

export const AuthConfigToken = 'AuthConfig'

export const authConfigSchema: Schema<AuthConfig> = {
    coreUrl: {
        doc: 'Auth core url',
        format: stringFormat,
        default: 'http://localhost:3567',
        env: 'coreUrl',
    },
    cookieSecure: {
        doc: 'Cookie secure',
        format: booleanFormat,
        default: true,
        env: 'cookieSecure',
    },
}
