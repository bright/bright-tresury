import { Schema, SchemaObj } from 'convict'
import { stringFormat } from '../config/formats/string.format'

export interface EmailsConfig {
    emailAddress: string
    senderName: string
}

export const EmailsConfigToken = 'EmailsConfig'

export const emailsConfigSchema: Schema<EmailsConfig> = {
    emailAddress: {
        doc: 'Email address used to send no-reply messages',
        default: 'treasury@brightinventions.pl',
        env: 'EMAIL_ADDRESS',
        format: stringFormat,
    } as SchemaObj<string>,
    senderName: {
        doc: 'Sender name used to send no-reply messages',
        default: 'BrightTreasury',
        env: 'SENDER_NAME',
        format: stringFormat,
    } as SchemaObj<string>,
}
