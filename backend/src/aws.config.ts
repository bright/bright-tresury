import { Schema, SchemaObj } from "convict";

// add more as you like
type AWS_REGION = 'eu-central-1' | 'eu-west-1'

export interface AWSConfig {
    region: AWS_REGION
}

export const awsConfigSchema: Schema<AWSConfig> = {
    // DO NOT ADD secret keys here
    // use either AWS_PROFILE or AWS_* credentials env variables in development and test
    // on deployed environments use instance profiles/roles which are picked automatically by aws-sdk
    region: {
        doc: "AWS_REGION to use",
        env: "AWS_REGION",
        default: "eu-central-1",
        format(value: any) {
            if (typeof value !== "string") {
                throw new Error("must be a string")
            }
        }
    } as SchemaObj<AWS_REGION>
}
