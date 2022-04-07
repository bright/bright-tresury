import { Tags } from 'aws-cdk-lib'
import * as cdk from 'aws-cdk-lib'
import { BastionHostLinux, InstanceClass, InstanceSize, InstanceType, Vpc } from 'aws-cdk-lib/aws-ec2'
import { CfnInclude } from 'aws-cdk-lib/cloudformation-include'
import { Construct } from 'constructs'
import * as path from 'path'
import { deployEnv, dockerRegistry, PROJECT_NAME, vcsVersion } from './deploy-env'

export class TreasuryAppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const legacyTemplate = new CfnInclude(this, 'legacy-template', {
            parameters: {
                DeployEnv: deployEnv(),
                // AppImage: `${dockerRegistry()}treasury:${vcsVersion()}`,
                AppImage: `265126396833.dkr.ecr.eu-central-1.amazonaws.com/treasury:14b68377952c31cc8cb1cf9491655ef09f2b8189`,
                PolkadotImage: `public.ecr.aws/x2h8r1m3/treasury/polkadot-dev:v0.9.18`,
            },
            templateFile: path.join(__dirname, '..', 'aws.template'),
        })

        const vpc = Vpc.fromLookup(this, 'vpc', {
            vpcName: `treasury-app-${deployEnv()}-VPC`,
        })

        const bastionHostLinux = new BastionHostLinux(this, 'bastion host', {
            vpc: vpc,
            instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.NANO),
        })

        Tags.of(bastionHostLinux).add('Application', `${PROJECT_NAME}-app-${deployEnv()}`)
    }
}
