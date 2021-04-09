import {Schema, SchemaObj} from "convict";
import {stringFormat} from "../config/formats/string.format";

export interface EmailsConfig {
    emailAddress: string,
}

export const EmailsConfigToken = 'EmailsConfig'

export const emailsConfigSchema: Schema<EmailsConfig> = {
    emailAddress: {
        doc: "Email address used to send no-reply messages",
        default: "agnieszka.olszewska@brightinventions.pl",
        env: "EMAIL_ADDRESS",
        format: stringFormat
    } as SchemaObj<string>,
}
