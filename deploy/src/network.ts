import { CfnInstance, CfnSecurityGroup, Vpc } from "@aws-cdk/aws-ec2";
import { CfnOutput, Construct, Stack } from "@aws-cdk/cdk";
import { projectEnvSpecificName, standardTags } from "./utils";

export class NetworkStack extends Stack {
    readonly vpcId: CfnOutput;
    readonly bastionHostHostname: CfnOutput;
    readonly sshAccessSecurityGroup: CfnSecurityGroup;
    readonly bastionHost: CfnInstance;
    readonly vpc: Vpc;

    constructor(scope: Construct) {
        super(scope, projectEnvSpecificName("network"));

        this.vpc = new Vpc(this, "VPC", {
            cidr: "10.0.0.0/16",
            enableDnsHostnames: true,
            enableDnsSupport: true,
            natGateways: 1,
        })

        this.vpcId = new CfnOutput(this, "vpcId", {
            value: this.vpc.vpcId
        })

        this.sshAccessSecurityGroup = new CfnSecurityGroup(this, "SSH Access", {
            groupName: "SSH Access",
            groupDescription: "Allows SSH access",
            securityGroupIngress: [{
                fromPort: 22, toPort: 22,
                cidrIp: "0.0.0.0/0",
                ipProtocol: "tcp"
            }],
            vpcId: this.vpc.vpcId,
            tags: standardTags
        })

        this.bastionHost = new CfnInstance(this, "BastionHost", {
            keyName: "project_name-ssh-key",
            instanceType: "t2.micro",
            imageId: "ami-03a71cec707bfc3d7",
            securityGroupIds: [this.sshAccessSecurityGroup.securityGroupId],
            tags: standardTags.concat([{
                key: "Name",
                value: "BastionHost"
            }]),
            // TODO: shoud this be private or public?
            subnetId: this.vpc.publicSubnets[0].subnetId
        })

        this.bastionHostHostname = new CfnOutput(this, 'bastionHostHostname', {
            value: this.bastionHost.instancePublicDnsName
        })
    }
}
