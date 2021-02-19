import cloudform from 'cloudform'
import {
    ApplicationAutoScaling,
    AutoScaling,
    CloudWatch,
    DeletionPolicy,
    EC2,
    ECS,
    ElasticLoadBalancingV2,
    IAM,
    RDS,
    Fn,
    Logs,
    Refs,
    ResourceTag,
    S3,
    StringParameter,
    KMS,
    SSM
} from 'cloudform'

const ProjectName = 'treasury'

const Resources = {
    // networking
    HttpHttpsServerSecurityGroup: 'HttpHttpsServerSecurityGroup',
    AccessInternetSecurityGroup: 'AccessInternetSecurityGroup',
    VPC: 'VPC',
    PublicASubnet: 'PublicASubnet',
    PublicBSubnet: 'PublicBSubnet',
    InternetGateway: 'InternetGateway',
    PublicRouteTable: 'PublicRouteTable',
    PublicRoute: 'PublicRoute',
    PublicASubnetRouteTableAssociation: 'PublicASubnetRouteTableAssociation',
    PublicBSubnetRouteTableAssociation: 'PublicBSubnetRouteTableAssociation',
    VPCGatewayToInternetAttachment: 'VPCGatewayToInternetAttachment',
    PrivateARouteTable: 'PrivateARouteTable',
    PrivateBRouteTable: 'PrivateBRouteTable',
    PrivateASubnetRouteTableAssociation: 'PrivateASubnetRouteTableAssociation',
    PrivateBSubnetRouteTableAssociation: 'PrivateBSubnetRouteTableAssociation',
    PrivateASubnet: 'PrivateASubnet',
    PrivateBSubnet: 'PrivateBSubnet',
    NatGatewayEIP: 'NatGatewayEIP',
    NatGateway: 'NatGateway',
    PrivateARouteNat: 'PrivateARouteNat',
    PrivateBRouteNat: 'PrivateBRouteNat',

    // database
    BackendDBSubnetGroup: 'BackendDBSubnetGroup',
    BackendDBInstanceParameters: 'BackendDBInstanceParameters',
    BackendDBInstance: 'BackendDBInstance',
    BackendDBEC2SecurityGroup: 'BackendDBEC2SecurityGroup',

    // bastion host
    BastionIPAddress: 'BastionIPAddress',
    BastionHost: 'BastionHost',
    BastionSecurityGroup: 'BastionSecurityGroup',

    // storage
    UploadsBucket: 'UploadsBucket',

    // services access
    AppApiS3AccessPolicy: 'AppApiS3AccessPolicy',
    AppApiSESAccessPolicy: 'AppApiSESAccessPolicy',
    AppApiAccessUser: 'AppApiAccessUser',
    AppApiAccessCredentials: 'AppApiAccessCredentials',

    // logs
    CloudwatchLogsGroup: 'CloudwatchLogsGroup',
    SubstrateCloudwatchLogsGroup: 'SubstrateCloudwatchLogsGroup',

    // ECS
    ECSCluster: 'ECSCluster',
    ECSSecurityGroup: 'ECSSecurityGroup',
    ECSSecurityGroupALBports: 'ECSSecurityGroupALBports',
    TaskDefinition: 'TaskDefinition',
    SubstrateTaskDefinition: 'SubstrateTaskDefinition',
    ContainerInstances: 'ContainerInstances',
    ECSService: 'ECSService',
    ECSSubstrateService: 'ECSSubstrateService',

    // load balancer
    ECSALB: 'ECSALB',
    ECSSubALB: 'ECSSubALB',
    //ALBHttpsListener: 'ALBHttpsListener',
    ALBHttpListener: 'ALBHttpListener',
    SubALBHttpListener: 'SubALBHttpListener',
    ECSALBListenerRule: 'ECSALBListenerRule',
    ECSSubALBListenerRule: 'ECSSubALBListenerRule',
    ECSALBRedirectListenerRule: 'ECSALBRedirectListenerRule',
    ECSTargetGroup: 'ECSTargetGroup',
    ECSSubTargetGroup: 'ECSSubTargetGroup',
    ECSAutoScalingGroup: 'ECSAutoScalingGroup',
    ECSServiceRole: 'ECSServiceRole',

    // auto scaling
    ServiceScalingTarget: 'ServiceScalingTarget',
    ServiceScalingPolicy: 'ServiceScalingPolicy',
    CPUUsageAlarmScaleUp: 'CPUUsageAlarmScaleUp',
    EC2Role: 'EC2Role',
    AutoscalingRole: 'AutoscalingRole',
    EC2InstanceProfile: 'EC2InstanceProfile',
    ParametersKmsKey: 'ParametersKmsKey',
    AppApiParametersAccessPolicy: "AppApiParametersAccessPolicy",

    RootAwsAccountId: "339594496974",

    AppTaskRole: "AppTaskRole",
    BackendDBInstanceHostParameter: "BackendDBInstanceHostParameter"
}

const DeployEnv = Fn.Ref('DeployEnv')

const InternetAccessSecurity = [
    {
        IpProtocol: "tcp",
        FromPort: 80,
        ToPort: 80,
        CidrIp: "0.0.0.0/0"
    },
    {
        IpProtocol: "tcp",
        FromPort: 443,
        ToPort: 443,
        CidrIp: "0.0.0.0/0"
    },
    {
        IpProtocol: "tcp",
        FromPort: 9933,
        ToPort: 9933,
        CidrIp: "0.0.0.0/0"
    },
    {
        IpProtocol: "tcp",
        FromPort: 9944,
        ToPort: 9944,
        CidrIp: "0.0.0.0/0"
    }
]

export default cloudform({
    Parameters: {
        DeployEnv: new StringParameter({
            Description: "Deploy environment name",
            AllowedValues: ["stage", "prod"]
        }),
        AppImage: new StringParameter({
            Description: "Repository, image and tag of the app to deploy"
        }),
        // EtherumNodeUrl: new StringParameter({
        //     Description: 'Etherum node url',
        //     NoEcho: true,
        // }),
        SSHFrom: new StringParameter({
            Description: "Lockdown SSH access to the bastion host (default can be accessed from anywhere)",
            MinLength: 9,
            MaxLength: 18,
            Default: "0.0.0.0/0",
            AllowedPattern: "(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})/(\\d{1,2})",
            ConstraintDescription: "must be a valid CIDR range of the form x.x.x.x/x."
        })
    },
    Mappings: {
        SubnetConfig: {
            VPC: {
                CIDR: "10.0.0.0/16"
            },
            PrivateA: {
                CIDR: "10.0.0.0/24"
            },
            PrivateB: {
                CIDR: "10.0.1.0/24"
            },
            PublicA: {
                CIDR: "10.0.100.0/24"
            },
            PublicB: {
                CIDR: "10.0.101.0/24"
            }
        },
        DatabaseMapping: {
            prod: {
                BackendDBInstanceIdentifier: `${ProjectName}-prod`,
                BackendInstanceType: "db.t2.micro",
                BackendStorageType: "gp2",
                BackendAllocatedStorage: 10,
                DbName: ProjectName,
                DbUserName: ProjectName,
                MultiAZ: "true"
            },
            stage: {
                BackendDBInstanceIdentifier: `${ProjectName}-stage`,
                BackendInstanceType: "db.t2.micro",
                BackendStorageType: "gp2",
                BackendAllocatedStorage: 10,
                DbName: ProjectName,
                DbUserName: ProjectName,
                MultiAZ: "false",
            }
        },
        ECS: {
            stage: {
                InstanceType: "t2.small",
                ContainerName: `${ProjectName}-www-stage`,
                ContainerPort: "3000",
                Memory: "700",
                SubstrateContainerName: `${ProjectName}-substrate-stage`,
                SubstrateContainerPort: "9933",
                DesiredTasksCount: 1
            },
            prod: {
                InstanceType: "t2.small",
                ContainerName: `${ProjectName}-www-prod`,
                ContainerPort: "3000",
                Memory: "900",
                DesiredTasksCount: 1
            }
        },
        Certificates: {
            stage: {
                ARN: "arn:aws:acm:eu-central-1:339594496974:certificate/5b31829b-fec3-4324-87e9-6660a57008cc"
            },
            prod: {
                ARN: ""
            }
        }
    },
    Resources: {
        [Resources.HttpHttpsServerSecurityGroup]: new EC2.SecurityGroup({
            GroupDescription: "Enables inbound HTTP and HTTPS access via port 80 and 443",
            VpcId: Fn.Ref(Resources.VPC),
            SecurityGroupIngress: InternetAccessSecurity
        }),

        [Resources.AccessInternetSecurityGroup]: new EC2.SecurityGroup({
            GroupDescription: "Enables outbound Internet access via ports 80,443",
            VpcId: Fn.Ref(Resources.VPC),
            SecurityGroupEgress: InternetAccessSecurity
        }),

        [Resources.VPC]: new EC2.VPC({
            CidrBlock: Fn.FindInMap('SubnetConfig', Resources.VPC, 'CIDR'),
            EnableDnsHostnames: true,
            Tags: [
                new ResourceTag("Application", Refs.StackName),
                new ResourceTag("Network", "Public"),
                new ResourceTag("Name", Fn.Join('-', [Refs.StackName, Resources.VPC]))
            ]
        }),

        [Resources.PublicASubnet]: new EC2.Subnet({
            VpcId: Fn.Ref(Resources.VPC),
            AvailabilityZone: Fn.Select(0, Fn.GetAZs()),
            CidrBlock: Fn.FindInMap('SubnetConfig', 'PublicA', 'CIDR'),
            Tags: [
                new ResourceTag("Application", Refs.StackName),
                new ResourceTag("Network", "Public"),
                new ResourceTag("Name", Fn.Join('-', [Refs.StackName, Resources.PublicASubnet]))
            ]
        }).dependsOn(Resources.VPC),

        [Resources.PublicBSubnet]: new EC2.Subnet({
            VpcId: Fn.Ref(Resources.VPC),
            AvailabilityZone: Fn.Select(1, Fn.GetAZs()),
            CidrBlock: Fn.FindInMap('SubnetConfig', 'PublicB', 'CIDR'),
            Tags: [
                new ResourceTag("Application", Refs.StackName),
                new ResourceTag("Network", "Public"),
                new ResourceTag("Name", Fn.Join('-', [Refs.StackName, Resources.PublicBSubnet]))
            ]
        }).dependsOn(Resources.VPC),

        [Resources.InternetGateway]: new EC2.InternetGateway({
            Tags: [
                new ResourceTag('Application', Refs.StackName),
                new ResourceTag('Network', 'Public'),
                new ResourceTag('Name', Fn.Join('-', [Refs.StackName, Resources.InternetGateway]))
            ]
        }),

        [Resources.PublicRouteTable]: new EC2.RouteTable({
            VpcId: Fn.Ref(Resources.VPC),
            Tags: [
                new ResourceTag('Application', Refs.StackName),
                new ResourceTag('Network', 'Public'),
                new ResourceTag('Name', Fn.Join('-', [Refs.StackName, Resources.PublicRouteTable]))
            ]
        }).dependsOn(Resources.VPC),

        [Resources.PublicRoute]: new EC2.Route({
            RouteTableId: Fn.Ref(Resources.PublicRouteTable),
            DestinationCidrBlock: "0.0.0.0/0",
            GatewayId: Fn.Ref(Resources.InternetGateway)
        }).dependsOn([
            Resources.PublicRouteTable,
            Resources.InternetGateway
        ]),

        [Resources.PublicASubnetRouteTableAssociation]: new EC2.SubnetRouteTableAssociation({
            SubnetId: Fn.Ref(Resources.PublicASubnet),
            RouteTableId: Fn.Ref(Resources.PublicRouteTable)
        }).dependsOn([
            Resources.PublicASubnet,
            Resources.PublicRouteTable
        ]),

        [Resources.PublicBSubnetRouteTableAssociation]: new EC2.SubnetRouteTableAssociation({
            SubnetId: Fn.Ref(Resources.PublicBSubnet),
            RouteTableId: Fn.Ref(Resources.PublicRouteTable)
        }).dependsOn([
            Resources.PublicBSubnet,
            Resources.PublicRouteTable
        ]),

        [Resources.VPCGatewayToInternetAttachment]: new EC2.VPCGatewayAttachment({
            VpcId: Fn.Ref(Resources.VPC),
            InternetGatewayId: Fn.Ref(Resources.InternetGateway)
        }).dependsOn([
            Resources.VPC,
            Resources.InternetGateway
        ]),

        [Resources.PrivateARouteTable]: new EC2.RouteTable({
            VpcId: Fn.Ref(Resources.VPC),
            Tags: [
                new ResourceTag('Application', Refs.StackName),
                new ResourceTag('Network', 'Private'),
                new ResourceTag('Name', Fn.Join('-', [Refs.StackName, Resources.PrivateARouteTable]))
            ]
        }),

        [Resources.PrivateBRouteTable]: new EC2.RouteTable({
            VpcId: Fn.Ref(Resources.VPC),
            Tags: [
                new ResourceTag('Application', Refs.StackName),
                new ResourceTag('Network', 'Private'),
                new ResourceTag('Name', Fn.Join('-', [Refs.StackName, Resources.PrivateBRouteTable]))
            ]
        }),

        [Resources.PrivateASubnetRouteTableAssociation]: new EC2.SubnetRouteTableAssociation({
            SubnetId: Fn.Ref(Resources.PrivateASubnet),
            RouteTableId: Fn.Ref(Resources.PrivateARouteTable)
        }).dependsOn([
            Resources.PrivateASubnet,
            Resources.PrivateARouteTable
        ]),

        [Resources.PrivateBSubnetRouteTableAssociation]: new EC2.SubnetRouteTableAssociation({
            SubnetId: Fn.Ref(Resources.PrivateBSubnet),
            RouteTableId: Fn.Ref(Resources.PrivateBRouteTable)
        }).dependsOn([
            Resources.PrivateBSubnet,
            Resources.PrivateBRouteTable
        ]),

        [Resources.PrivateASubnet]: new EC2.Subnet({
            VpcId: Fn.Ref(Resources.VPC),
            AvailabilityZone: Fn.Select(0, Fn.GetAZs()),
            CidrBlock: Fn.FindInMap('SubnetConfig', 'PrivateA', 'CIDR'),
            Tags: [
                new ResourceTag('Application', Refs.StackName),
                new ResourceTag('Network', 'Private'),
                new ResourceTag('Name', Fn.Join('-', [Refs.StackName, Resources.PrivateASubnet]))
            ]
        }).dependsOn(Resources.VPC),

        [Resources.PrivateBSubnet]: new EC2.Subnet({
            VpcId: Fn.Ref(Resources.VPC),
            AvailabilityZone: Fn.Select(1, Fn.GetAZs()),
            CidrBlock: Fn.FindInMap('SubnetConfig', 'PrivateB', 'CIDR'),
            Tags: [
                new ResourceTag('Application', Refs.StackName),
                new ResourceTag('Network', 'Private'),
                new ResourceTag('Name', Fn.Join('-', [Refs.StackName, Resources.PrivateBSubnet]))
            ]
        }).dependsOn(Resources.VPC),

        [Resources.NatGatewayEIP]: new EC2.EIP({
            Domain: "vpc"
        }).dependsOn(Resources.VPCGatewayToInternetAttachment),

        [Resources.NatGateway]: new EC2.NatGateway({
            AllocationId: Fn.GetAtt(Resources.NatGatewayEIP, 'AllocationId'),
            SubnetId: Fn.Ref(Resources.PublicASubnet)
        }),

        [Resources.PrivateARouteNat]: new EC2.Route({
            RouteTableId: Fn.Ref(Resources.PrivateARouteTable),
            DestinationCidrBlock: "0.0.0.0/0",
            NatGatewayId: Fn.Ref(Resources.NatGateway)
        }),

        [Resources.PrivateBRouteNat]: new EC2.Route({
            RouteTableId: Fn.Ref(Resources.PrivateBRouteTable),
            DestinationCidrBlock: "0.0.0.0/0",
            NatGatewayId: Fn.Ref(Resources.NatGateway)
        }),

        [Resources.BackendDBSubnetGroup]: new RDS.DBSubnetGroup({
            DBSubnetGroupDescription: "Backend db subnet group that allows for multi-az",
            SubnetIds: [
                Fn.Ref(Resources.PrivateASubnet),
                Fn.Ref(Resources.PrivateBSubnet)
            ]
        }),

        [Resources.BackendDBInstanceParameters]: new RDS.DBParameterGroup({
            Description: "Backend DB Instance Parameter Group",
            Family: "postgres11",
            Parameters: {
                "track_activity_query_size": "2048",
                "shared_preload_libraries": "pg_stat_statements"
            },
            Tags: [
                new ResourceTag('Application', Refs.StackName),
                new ResourceTag('Name', Fn.Join('-', [Refs.StackName, Resources.BackendDBInstance]))
            ]
        }),

        [Resources.BackendDBInstance]: new RDS.DBInstance({
            DBName: Fn.FindInMap('DatabaseMapping', DeployEnv, 'DbName'),
            MasterUsername: Fn.FindInMap('DatabaseMapping', DeployEnv, 'DbUserName'),
            DBInstanceIdentifier: Fn.FindInMap('DatabaseMapping', DeployEnv, 'BackendDBInstanceIdentifier'),
            DBParameterGroupName: Fn.Ref(Resources.BackendDBInstanceParameters),
            DBSubnetGroupName: Fn.Ref(Resources.BackendDBSubnetGroup),
            MasterUserPassword: Fn.Join("", ["{{resolve:ssm-secure:/", ProjectName, "-", DeployEnv, "/database/password:1}}"]),
            EnablePerformanceInsights: true,
            Engine: "postgres",
            EngineVersion: "11.2",
            AllowMajorVersionUpgrade: true,
            DBInstanceClass: Fn.FindInMap('DatabaseMapping', DeployEnv, 'BackendInstanceType'),
            VPCSecurityGroups: [
                Fn.GetAtt(Resources.BackendDBEC2SecurityGroup, 'GroupId')
            ],
            AllocatedStorage: Fn.FindInMap('DatabaseMapping', DeployEnv, 'BackendAllocatedStorage'),
            StorageType: Fn.FindInMap('DatabaseMapping', DeployEnv, 'BackendStorageType'),
            MultiAZ: Fn.FindInMap('DatabaseMapping', DeployEnv, 'MultiAZ'),
            Tags: [
                new ResourceTag('Application', Refs.StackName),
                new ResourceTag('Name', Fn.Join('-', [Refs.StackName, Resources.BackendDBInstance]))
            ]
        }).deletionPolicy(DeletionPolicy.Snapshot),

        [Resources.BackendDBInstanceHostParameter]: new SSM.Parameter({
            Name: Fn.Join("", ["/", ProjectName, "-", DeployEnv, "/database/host"]),
            Type: "String",
            Value: Fn.GetAtt("BackendDBInstance", "Endpoint.Address"),
            Description: "Backend db instance host address"
        }),

        [Resources.BackendDBEC2SecurityGroup]: new EC2.SecurityGroup({
            GroupDescription: "Open database for access",
            VpcId: Fn.Ref(Resources.VPC),
            SecurityGroupIngress: [
                {
                    IpProtocol: "tcp",
                    FromPort: 5432,
                    ToPort: 5432,
                    CidrIp: Fn.FindInMap('SubnetConfig', 'PublicA', 'CIDR')
                },
                {
                    IpProtocol: "tcp",
                    FromPort: 5432,
                    ToPort: 5432,
                    CidrIp: Fn.FindInMap('SubnetConfig', 'PublicB', 'CIDR')
                },
                {
                    IpProtocol: "tcp",
                    FromPort: 5432,
                    ToPort: 5432,
                    CidrIp: Fn.FindInMap('SubnetConfig', 'PrivateA', 'CIDR')
                },
                {
                    IpProtocol: "tcp",
                    FromPort: 5432,
                    ToPort: 5432,
                    CidrIp: Fn.FindInMap('SubnetConfig', 'PrivateB', 'CIDR')
                }
            ]
        }),

        [Resources.BastionIPAddress]: new EC2.EIP({
            Domain: "vpc",
            InstanceId: Fn.Ref(Resources.BastionHost)
        }),

        [Resources.BastionHost]: new EC2.Instance({
            InstanceType: "t2.nano",
            KeyName: 'treasury-ssh-key',
            ImageId: "ami-1b316af0",
            NetworkInterfaces: [
                {
                    AssociatePublicIpAddress: true,
                    DeviceIndex: "0",
                    SubnetId: Fn.Ref(Resources.PublicASubnet),
                    DeleteOnTermination: true,
                    GroupSet: [
                        Fn.Ref(Resources.BastionSecurityGroup)
                    ]
                }
            ],
            Tags: [
                new ResourceTag('Application', Refs.StackName),
                new ResourceTag('Name', Resources.BastionHost)
            ]
        }).dependsOn([
            Resources.PublicASubnet,
            Resources.BastionSecurityGroup
        ]),

        [Resources.BastionSecurityGroup]: new EC2.SecurityGroup({
            GroupDescription: "Enable access to the Bastion host",
            VpcId: Fn.Ref(Resources.VPC),
            SecurityGroupIngress: [
                {
                    IpProtocol: "tcp",
                    FromPort: 22,
                    ToPort: 22,
                    CidrIp: Fn.Ref('SSHFrom')
                }
            ]
        }).dependsOn(Resources.VPC),

        [Resources.UploadsBucket]: new S3.Bucket({
            BucketName: Fn.Join('-', [ProjectName, 'uploads', DeployEnv])
        }),

        [Resources.AppApiS3AccessPolicy]: new IAM.ManagedPolicy({
            PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Action: "s3:ListAllMyBuckets",
                        Resource: "arn:aws:s3:::*"
                    },
                    {
                        Effect: "Allow",
                        Action: "s3:*",
                        Resource: [
                            Fn.Join('', ["arn:aws:s3:::", ProjectName, "-uploads-", DeployEnv]),
                            Fn.Join('', ["arn:aws:s3:::", ProjectName, "-uploads-", DeployEnv, '/*'])
                        ]
                    }
                ]
            }
        }),

        [Resources.AppApiSESAccessPolicy]: new IAM.ManagedPolicy({
            PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Action: [
                            "ses:SendEmail",
                            "ses:SendRawEmail"
                        ],
                        Resource: Fn.Join('', ['arn:aws:ses:eu-west-1:', Refs.AccountId, ':*'])
                    }
                ]
            }
        }),

        [Resources.AppApiParametersAccessPolicy]: new IAM.ManagedPolicy({
            PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        "Effect": "Allow",
                        "Action": [
                            "ssm:DescribeParameters"
                        ],
                        "Resource": "*"
                    },
                    {
                        "Effect": "Allow",
                        "Action": [
                            "ssm:GetParameter",
                            "ssm:GetParameters",
                            "ssm:GetParametersByPath"
                        ],
                        "Resource": [
                            Fn.Join("", [`arn:aws:ssm:*:${Resources.RootAwsAccountId}:parameter/${ProjectName}-`, DeployEnv, "/*"])
                        ]
                    },
                    {
                        "Effect": "Allow",
                        "Action": [
                            "kms:Decrypt"
                        ],
                        "Resource": [Fn.GetAtt(Resources.ParametersKmsKey, "Arn")]
                    }
                ]
            }
        }).dependsOn([Resources.ParametersKmsKey]),

        [Resources.ParametersKmsKey]: new KMS.Key({
            Description: Fn.Join(" ", [DeployEnv, "encryption key for secure parameters"]),
            KeyPolicy: {
                Version: "2012-10-17",
                Statement: [{
                    Sid: "Enable full access to users",
                    Effect: "Allow",
                    Principal: {
                        AWS: [
                            Fn.Join(":", ['arn:aws:iam:', Resources.RootAwsAccountId, 'root']),
                            Fn.Join(":", ['arn:aws:iam:', Resources.RootAwsAccountId, 'user/treasury'])

                        ]
                    },
                    Action: "kms:*",
                    Resource: "*"
                }]
            }
        }),

        [Resources.AppApiAccessUser]: new IAM.User({
            ManagedPolicyArns: [
                Fn.Ref(Resources.AppApiS3AccessPolicy),
                Fn.Ref(Resources.AppApiSESAccessPolicy),
                Fn.Ref(Resources.AppApiParametersAccessPolicy)
            ]
        }),

        [Resources.AppTaskRole]: new IAM.Role({
            AssumeRolePolicyDocument: {
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {
                            "Service": [
                                "ecs-tasks.amazonaws.com"
                            ]
                        },
                        "Action": [
                            "sts:AssumeRole"
                        ]
                    }
                ]
            },
            Path: "/",
            ManagedPolicyArns: [
                Fn.Ref(Resources.AppApiS3AccessPolicy),
                Fn.Ref(Resources.AppApiSESAccessPolicy),
                Fn.Ref(Resources.AppApiParametersAccessPolicy)
            ]
        }),

        [Resources.AppApiAccessCredentials]: new IAM.AccessKey({
            UserName: Fn.Ref(Resources.AppApiAccessUser)
        }),

        [Resources.ECSCluster]: new ECS.Cluster(),

        [Resources.ECSSecurityGroup]: new EC2.SecurityGroup({
            GroupDescription: "ECS Security Group",
            VpcId: Fn.Ref(Resources.VPC)
        }),

        [Resources.ECSSecurityGroupALBports]: new EC2.SecurityGroupIngress({
            GroupId: Fn.Ref('ECSSecurityGroup'),
            IpProtocol: "tcp",
            FromPort: 0,
            ToPort: 61000,
            CidrIp: Fn.FindInMap('SubnetConfig', Resources.VPC, 'CIDR')
        }),

        [Resources.CloudwatchLogsGroup]: new Logs.LogGroup({
            LogGroupName: Fn.Join('-', ['ECSLogGroup', Refs.StackName]),
            RetentionInDays: 14
        }),
        [Resources.SubstrateCloudwatchLogsGroup]: new Logs.LogGroup({
            LogGroupName: Fn.Join('-', ['SubstrateECSLogGroup', Refs.StackName]),
            RetentionInDays: 14
        }),

        [Resources.TaskDefinition]: new ECS.TaskDefinition({
            Family: Fn.Join('', [Refs.StackName, '-app']),
            ContainerDefinitions: [
                {
                    Name: Fn.FindInMap('ECS', DeployEnv, 'ContainerName'),
                    Environment: [
                        {
                            Name: "DEPLOY_ENV",
                            Value: DeployEnv
                        },
                        {
                            Name: "NODE_OPTIONS",
                            Value: "--max-old-space-size=600"
                        },
                    ],
                    Cpu: 100,
                    Essential: true,
                    Image: Fn.Ref('AppImage'),
                    Command: ['npm', 'run', 'database-migrate-and-main'],
                    MemoryReservation: Fn.FindInMap('ECS', DeployEnv, 'Memory'),
                    LogConfiguration: {
                        LogDriver: "awslogs",
                        Options: {
                            "awslogs-group": Fn.Ref('CloudwatchLogsGroup'),
                            "awslogs-region": Refs.Region,
                            "awslogs-stream-prefix": Fn.Select(1, Fn.Split(':', Fn.Ref('AppImage'))),
                            "awslogs-multiline-pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z"
                        }
                    },
                    PortMappings: [
                        {
                            ContainerPort: Fn.FindInMap('ECS', DeployEnv, 'ContainerPort')
                        }
                    ]
                }
            ],
            TaskRoleArn: Fn.GetAtt(Resources.AppTaskRole, "Arn")
        }),

        [Resources.SubstrateTaskDefinition]: new ECS.TaskDefinition({
            Family: Fn.Join('', [Refs.StackName, '-app']),
            ContainerDefinitions: [
                {
                    Name: Fn.FindInMap('ECS', DeployEnv, 'SubstrateContainerName'),
                    Cpu: 100,
                    Essential: true,
                    Image: "parity/polkadot:v0.8.24",
                    Command: ['--rpc-external', '--ws-external', '--dev'],
                    MemoryReservation: Fn.FindInMap('ECS', DeployEnv, 'Memory'),
                    LogConfiguration: {
                        LogDriver: "awslogs",
                        Options: {
                            "awslogs-group": Fn.Ref('SubstrateCloudwatchLogsGroup'),
                            "awslogs-region": Refs.Region,
                            "awslogs-stream-prefix": "substrate",
                            "awslogs-multiline-pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z"
                        }
                    },
                    PortMappings: [
                        {
                            ContainerPort: 9933,
                            HostPort: 9933,
                        }
                    ]
                }
            ],
            TaskRoleArn: Fn.GetAtt(Resources.AppTaskRole, "Arn")
        }),

        [Resources.ECSALB]: new ElasticLoadBalancingV2.LoadBalancer({
            Name: Refs.StackName, // to long name
            Scheme: "internet-facing",
            LoadBalancerAttributes: [
                {
                    Key: "idle_timeout.timeout_seconds",
                    Value: "30"
                }
            ],
            Subnets: [
                Fn.Ref(Resources.PublicASubnet),
                Fn.Ref(Resources.PublicBSubnet)
            ],
            SecurityGroups: [
                Fn.Ref(Resources.HttpHttpsServerSecurityGroup)
            ]
        }).dependsOn(Resources.HttpHttpsServerSecurityGroup),

        [Resources.ECSSubALB]: new ElasticLoadBalancingV2.LoadBalancer({
            Name: Fn.Join('', [Refs.StackName, '-sub']), // to long name
            Scheme: "internet-facing",
            LoadBalancerAttributes: [
                {
                    Key: "idle_timeout.timeout_seconds",
                    Value: "30"
                }
            ],
            Subnets: [
                Fn.Ref(Resources.PublicASubnet),
                Fn.Ref(Resources.PublicBSubnet)
            ],
            SecurityGroups: [
                Fn.Ref(Resources.HttpHttpsServerSecurityGroup)
            ]
        }).dependsOn(Resources.HttpHttpsServerSecurityGroup),

        // [Resources.ALBHttpsListener]: new ElasticLoadBalancingV2.Listener({
        //     Certificates: [
        //         {
        //             CertificateArn: Fn.FindInMap('Certificates', DeployEnv, 'ARN')
        //         }
        //     ],
        //     DefaultActions: [
        //         {
        //             Type: "forward",
        //             TargetGroupArn: Fn.Ref(Resources.ECSTargetGroup)
        //         }
        //     ],
        //     LoadBalancerArn: Fn.Ref(Resources.ECSALB),
        //     Port: 443,
        //     Protocol: "HTTPS"
        // }).dependsOn(Resources.ECSServiceRole),

        [Resources.ALBHttpListener]: new ElasticLoadBalancingV2.Listener({
            DefaultActions: [
                {
                    Type: "forward",
                    TargetGroupArn: Fn.Ref(Resources.ECSTargetGroup)
                }
            ],
            LoadBalancerArn: Fn.Ref(Resources.ECSALB),
            Port: 80,
            Protocol: "HTTP"
        }).dependsOn(Resources.ECSServiceRole),

        [Resources.SubALBHttpListener]: new ElasticLoadBalancingV2.Listener({
            DefaultActions: [
                {
                    Type: "forward",
                    TargetGroupArn: Fn.Ref(Resources.ECSSubTargetGroup)
                }
            ],
            LoadBalancerArn: Fn.Ref(Resources.ECSSubALB),
            Port: 9933,
            Protocol: "HTTP"
        }).dependsOn(Resources.ECSServiceRole),

        // [Resources.ECSALBRedirectListenerRule]: new ElasticLoadBalancingV2.ListenerRule({
        //     Actions: [
        //         {
        //             Type: "redirect",
        //             RedirectConfig: {
        //                 "Host" : "#{host}",
        //                 "Path" : "/#{path}",
        //                 "Port" : "443",
        //                 "Protocol" : "HTTPS",
        //                 "Query" : "#{query}",
        //                 "StatusCode" : "HTTP_302"
        //             }
        //         }
        //     ],
        //     Conditions: [
        //         {
        //             Field: "path-pattern",
        //             Values: ["/"]
        //         }
        //     ],
        //     ListenerArn: Fn.Ref(Resources.ALBHttpListener),
        //     Priority: 2
        // }).dependsOn(Resources.ALBHttpListener),

        [Resources.ECSALBListenerRule]: new ElasticLoadBalancingV2.ListenerRule({
            Actions: [
                {
                    Type: "forward",
                    TargetGroupArn: Fn.Ref(Resources.ECSTargetGroup)
                }
            ],
            Conditions: [
                {
                    Field: "path-pattern",
                    Values: ["/"]
                }
            ],
            ListenerArn: Fn.Ref(Resources.ALBHttpListener),
            Priority: 1
        }).dependsOn(Resources.ALBHttpListener),

        [Resources.ECSSubALBListenerRule]: new ElasticLoadBalancingV2.ListenerRule({
            Actions: [
                {
                    Type: "forward",
                    TargetGroupArn: Fn.Ref(Resources.ECSSubTargetGroup)
                }
            ],
            Conditions: [
                {
                    Field: "path-pattern",
                    Values: ["/"]
                }
            ],
            ListenerArn: Fn.Ref(Resources.SubALBHttpListener),
            Priority: 1
        }).dependsOn(Resources.SubALBHttpListener),

        [Resources.ECSTargetGroup]: new ElasticLoadBalancingV2.TargetGroup({
            HealthCheckIntervalSeconds: 20,
            HealthCheckPath: "/api/health",
            HealthCheckProtocol: "HTTP",
            HealthCheckTimeoutSeconds: 10,
            HealthyThresholdCount: 2,
            Name: Fn.Join('-', [Resources.ECSTargetGroup, 'treasury', DeployEnv]), // added refs.stackname
            Port: Fn.FindInMap('ECS', DeployEnv, 'ContainerPort'),
            Protocol: "HTTP",
            TargetGroupAttributes: [
                {
                    Key: "deregistration_delay.timeout_seconds",
                    Value: "30"
                },
                {
                    Key: "stickiness.enabled",
                    Value: "true"
                },
                {
                    Key: "stickiness.type",
                    Value: "lb_cookie"
                },
                {
                    Value: "86400",
                    Key: "stickiness.lb_cookie.duration_seconds"
                }
            ],
            UnhealthyThresholdCount: 5,
            VpcId: Fn.Ref(Resources.VPC)
        }).dependsOn(Resources.ECSALB),

        [Resources.ECSSubTargetGroup]: new ElasticLoadBalancingV2.TargetGroup({
            HealthCheckIntervalSeconds: 20,
            HealthCheckPath: "/health",
            HealthCheckProtocol: "HTTP",
            HealthCheckPort: "9933",
            HealthCheckTimeoutSeconds: 10,
            HealthyThresholdCount: 2,
            Name: Fn.Join('-', [Resources.ECSSubTargetGroup, 'treasury', DeployEnv]), // added refs.stackname
            Port: Fn.FindInMap('ECS', DeployEnv, 'SubstrateContainerPort'),
            Protocol: "HTTP",
            TargetGroupAttributes: [
                {
                    Key: "deregistration_delay.timeout_seconds",
                    Value: "30"
                },
                {
                    Key: "stickiness.enabled",
                    Value: "true"
                },
                {
                    Key: "stickiness.type",
                    Value: "lb_cookie"
                },
                {
                    Value: "86400",
                    Key: "stickiness.lb_cookie.duration_seconds"
                }
            ],
            UnhealthyThresholdCount: 5,
            VpcId: Fn.Ref(Resources.VPC)
        }).dependsOn(Resources.ECSALB),

        [Resources.ECSAutoScalingGroup]: new AutoScaling.AutoScalingGroup({
            VPCZoneIdentifier: [
                Fn.Ref(Resources.PrivateASubnet),
                Fn.Ref(Resources.PrivateBSubnet)
            ],
            LaunchConfigurationName: Fn.Ref(Resources.ContainerInstances),
            MinSize: "2",
            MaxSize: "6",
            DesiredCapacity: "2"
        }).creationPolicy({
            ResourceSignal: {
                Timeout: "PT5M"
            }
        }).updatePolicy({
            AutoScalingReplacingUpdate: {
                WillReplace: true
            }
        }),

        [Resources.ContainerInstances]: new AutoScaling.LaunchConfiguration({
            ImageId: "ami-9fc39c74",
            SecurityGroups: [
                Fn.Ref(Resources.ECSSecurityGroup)
            ],
            InstanceType: Fn.FindInMap('ECS', DeployEnv, 'InstanceType'),
            IamInstanceProfile: Fn.Ref(Resources.EC2InstanceProfile),
            KeyName: 'treasury-ssh-key',
            UserData: Fn.Base64(Fn.Join('', [
                "#!/bin/bash -xe\n",
                "echo ECS_CLUSTER=",
                Fn.Ref(Resources.ECSCluster),
                " >> /etc/ecs/ecs.config\n",
                "yum install -y aws-cfn-bootstrap\n",
                "/opt/aws/bin/cfn-signal -e $? ",
                "         --stack ",
                Refs.StackName,
                "         --resource ECSAutoScalingGroup ",
                "         --region ",
                Refs.Region,
                "\n"
            ]))
        }).dependsOn([
            Resources.ECSSecurityGroup,
            Resources.PublicRoute
        ]),

        [Resources.ECSService]: new ECS.Service({
            Cluster: Fn.Ref(Resources.ECSCluster),
            DesiredCount: Fn.FindInMap('ECS', DeployEnv, 'DesiredTasksCount'),
            LoadBalancers: [
                {
                    ContainerName: Fn.FindInMap('ECS', DeployEnv, 'ContainerName'),
                    ContainerPort: Fn.FindInMap('ECS', DeployEnv, 'ContainerPort'),
                    TargetGroupArn: Fn.Ref(Resources.ECSTargetGroup)
                }
            ],
            DeploymentConfiguration: {
                MinimumHealthyPercent: 50
            },
            Role: Fn.Ref(Resources.ECSServiceRole),
            TaskDefinition: Fn.Ref(Resources.TaskDefinition)
        }).dependsOn(Resources.ALBHttpListener),

        [Resources.ECSSubstrateService]: new ECS.Service({
            Cluster: Fn.Ref(Resources.ECSCluster),
            DesiredCount: Fn.FindInMap('ECS', DeployEnv, 'DesiredTasksCount'),
            LoadBalancers: [
                {
                    ContainerName: Fn.FindInMap('ECS', DeployEnv, 'SubstrateContainerName'),
                    ContainerPort: Fn.FindInMap('ECS', DeployEnv, 'SubstrateContainerPort'),
                    TargetGroupArn: Fn.Ref(Resources.ECSSubTargetGroup)
                }
            ],
            DeploymentConfiguration: {
                MinimumHealthyPercent: 50
            },
            Role: Fn.Ref(Resources.ECSServiceRole),
            TaskDefinition: Fn.Ref(Resources.SubstrateTaskDefinition)
        }).dependsOn(Resources.SubALBHttpListener),

        [Resources.ECSServiceRole]: new IAM.Role({
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: {
                            Service: ["ecs.amazonaws.com"]
                        },
                        Action: ["sts:AssumeRole"]
                    }
                ]
            },
            Path: "/",
            Policies: [
                {
                    PolicyName: "ecs-service",
                    PolicyDocument: {
                        Statement: [
                            {
                                Effect: "Allow",
                                Action: [
                                    "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
                                    "elasticloadbalancing:DeregisterTargets",
                                    "elasticloadbalancing:Describe*",
                                    "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
                                    "elasticloadbalancing:RegisterTargets",
                                    "ec2:Describe*",
                                    "ec2:AuthorizeSecurityGroupIngress"
                                ],
                                Resource: "*"
                            }
                        ]
                    }
                }
            ]
        }),

        [Resources.ServiceScalingTarget]: new ApplicationAutoScaling.ScalableTarget({
            MaxCapacity: 2,
            MinCapacity: 1,
            ResourceId: Fn.Join('', [
                "service/",
                Fn.Ref(Resources.ECSCluster),
                "/",
                Fn.GetAtt(Resources.ECSService, 'Name')
            ]),
            RoleARN: Fn.GetAtt(Resources.AutoscalingRole, 'Arn'),
            ScalableDimension: "ecs:service:DesiredCount",
            ServiceNamespace: "ecs"
        }).dependsOn(Resources.ECSService),

        [Resources.ServiceScalingPolicy]: new ApplicationAutoScaling.ScalingPolicy({
            PolicyName: "AStepPolicy",
            PolicyType: "StepScaling",
            ScalingTargetId: Fn.Ref(Resources.ServiceScalingTarget),
            StepScalingPolicyConfiguration: {
                AdjustmentType: "PercentChangeInCapacity",
                Cooldown: 60,
                MetricAggregationType: "Average",
                StepAdjustments: [
                    {
                        MetricIntervalLowerBound: 0,
                        ScalingAdjustment: 200
                    }
                ]
            }
        }),

        [Resources.CPUUsageAlarmScaleUp]: new CloudWatch.Alarm({
            AlarmDescription: "Alarm if instance CPU usage is >75%.",
            AlarmActions: [Fn.Ref(Resources.ServiceScalingPolicy)],
            MetricName: "CPUUtilization",
            Namespace: "AWS/EC2",
            Statistic: "Average",
            Period: 60,
            EvaluationPeriods: 3,
            Threshold: 75,
            ComparisonOperator: "GreaterThanThreshold",
            Dimensions: [
                {
                    Name: "AutoScalingGroupName",
                    Value: Fn.Ref(Resources.ECSAutoScalingGroup)
                }
            ]
        }),

        [Resources.EC2Role]: new IAM.Role({
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: {
                            Service: ["ec2.amazonaws.com"]
                        },
                        Action: ["sts:AssumeRole"]
                    }
                ]
            },
            Path: "/",
            Policies: [
                {
                    PolicyName: "ecs-service",
                    PolicyDocument: {
                        Statement: [
                            {
                                Effect: "Allow",
                                Action: [
                                    "ecs:CreateCluster",
                                    "ecs:DeregisterContainerInstance",
                                    "ecs:DiscoverPollEndpoint",
                                    "ecs:Poll",
                                    "ecs:RegisterContainerInstance",
                                    "ecs:StartTelemetrySession",
                                    "ecs:Submit*",
                                    "ecr:GetAuthorizationToken",
                                    "ecr:BatchCheckLayerAvailability",
                                    "ecr:GetDownloadUrlForLayer",
                                    "ecr:BatchGetImage",
                                    "logs:CreateLogStream",
                                    "logs:PutLogEvents"
                                ],
                                Resource: "*"
                            }
                        ]
                    }
                }
            ]
        }),

        [Resources.AutoscalingRole]: new IAM.Role({
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: {
                            Service: ["application-autoscaling.amazonaws.com"]
                        },
                        Action: ["sts:AssumeRole"]
                    }
                ]
            },
            Path: "/",
            Policies: [
                {
                    PolicyName: "service-autoscaling",
                    PolicyDocument: {
                        Statement: [
                            {
                                Effect: "Allow",
                                Action: [
                                    "application-autoscaling:*",
                                    "cloudwatch:DescribeAlarms",
                                    "cloudwatch:PutMetricAlarm",
                                    "ecs:DescribeServices",
                                    "ecs:UpdateService"
                                ],
                                Resource: "*"
                            }
                        ]
                    }
                }
            ]
        }),

        [Resources.EC2InstanceProfile]: new IAM.InstanceProfile({
            Path: "/",
            Roles: [Fn.Ref(Resources.EC2Role)]
        })
    }
})
