import {Schema} from "convict"
import {stringFormat} from "./formats/string.format";
import {booleanFormat} from "./formats/boolean.format";

export interface AuthConfig {
    cookieSecure: boolean
    coreUrl: string
}

export const authConfigSchema: Schema<AuthConfig> = {
    coreUrl: {
        doc: "Auth core url",
        format: stringFormat,
        default: 'http://localhost:3567',
        env: "coreUrl"
    },
    cookieSecure: {
        doc: "Cookie secure",
        format: booleanFormat,
        default: true,
        env: "cookieSecure"
    }
}
