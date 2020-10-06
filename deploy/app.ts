import * as ec2 from "@aws-cdk/aws-ec2";
import { CfnSecurityGroup, ISubnet } from "@aws-cdk/aws-ec2";
import * as rds from "@aws-cdk/aws-rds";
import { CfnDBInstance, CfnDBSubnetGroup } from "@aws-cdk/aws-rds";
import { StringParameter } from "@aws-cdk/aws-ssm";
import * as cdk from "@aws-cdk/cdk";
import { Construct, Stack } from "@aws-cdk/cdk";
import { NetworkStack } from "./src/network";
import { DEPLOY_ENV, projectEnvSpecificName, resolveSecureParameter } from "./src/utils";

if (!DEPLOY_ENV) {
    throw new Error('Cannot deploy without process.env.DEPLOY_ENV')
}

class DatabaseStack extends Stack {
    private database: CfnDBInstance;
    private assigneeAccessDatabaseSecurityGroup: CfnSecurityGroup;
    private databaseSecurityGroup: CfnSecurityGroup;
    private databaseSubnetGroup: CfnDBSubnetGroup;
    private databasePasswordParameter: StringParameter;

    constructor(scope: Construct, network: NetworkStack) {
        super(scope, projectEnvSpecificName("database"));
        this.assigneeAccessDatabaseSecurityGroup = new ec2.CfnSecurityGroup(this, "AssigneeAccessDatabase", {
            groupDescription: `Allow assignee to access database`,
            groupName: "Allow assignee to access database",
            vpcId: network.vpc.vpcId
        });

        this.databaseSecurityGroup = new ec2.CfnSecurityGroup(this, "DatabaseSecurityGroup", {
            groupDescription: `Allow database access from ${this.assigneeAccessDatabaseSecurityGroup.securityGroupId}`,
            groupName: "Allow database access",
            securityGroupIngress: [{
                ipProtocol: "tcp",
                fromPort: 5432, toPort: 5432,
                sourceSecurityGroupId: this.assigneeAccessDatabaseSecurityGroup.securityGroupId
            }],
            vpcId: network.vpc.vpcId
        });

        this.databaseSubnetGroup = new rds.CfnDBSubnetGroup(this, "DatabaseSubnetGroup", {
            dbSubnetGroupDescription: "Private subnets for database",
            subnetIds: network.vpc.privateSubnets.map((subnet: ISubnet) => subnet.subnetId)
        })

        this.database = new rds.CfnDBInstance(this, "Database", {
            dbName: "PROJECT_NAME",
            dbInstanceClass: "db.t3.micro",
            allowMajorVersionUpgrade: true,
            autoMinorVersionUpgrade: true,
            engine: "postgres",
            engineVersion: "11.2",
            dbInstanceIdentifier: projectEnvSpecificName("main"),
            masterUsername: "PROJECT_NAME",
            masterUserPassword: resolveSecureParameter("/database/password"),
            vpcSecurityGroups: [this.databaseSecurityGroup.securityGroupId],
            multiAz: false,
            dbSubnetGroupName: this.databaseSubnetGroup.dbSubnetGroupName,
            allocatedStorage: "50" // GB
        })
    }

}

const app = new cdk.App();

const network = new NetworkStack(app);
const database = new DatabaseStack(app, network);

app.synth()
