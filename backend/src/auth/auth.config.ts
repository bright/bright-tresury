import { Schema, SchemaObj } from "convict";

export interface AuthConfig {
    encryptionKey: string
}

export const authConfigSchema: Schema<AuthConfig> = {
    encryptionKey: {
        doc: 'Encryption key used for authentication token signing',
        default: '',
        sensitive: true,
        format(value: any) {
            if (typeof value !== 'string') {
                throw new Error('must be a string');
            }

            if (value.length < 40) {
                throw new Error('must be at least 40 characters long')
            }
        }
    } as SchemaObj<string>
}
