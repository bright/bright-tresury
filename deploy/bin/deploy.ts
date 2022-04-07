#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import 'source-map-support/register'
import { deployEnv } from '../lib/deploy-env'
import { TreasuryAppStack } from '../lib/treasury-app-stack'

const app = new cdk.App()

new TreasuryAppStack(app, `treasury-app-${deployEnv()}`, {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
})
