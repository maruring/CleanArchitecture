import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_dynamodb, RemovalPolicy } from 'aws-cdk-lib';

// 独自モジュール
import { AppParameter } from '../../bin/parameter';

interface DynamodbConstructProps {
    projectName: string;
    envName: "dev" | "stg" | "prd";
};

export class DynamodbConstruct extends Construct {
    public readonly accountTable: aws_dynamodb.Table

    constructor(scope: Construct, id: string, props: DynamodbConstructProps) {
        super(scope, id);

        const {
            projectName,
            envName
        } = props;

        const accountTable = new aws_dynamodb.Table(this, `${envName}-AccountTable`, {
            tableName: `${envName}-${projectName}-account`,
            partitionKey: {
                name: 'id',
                type: aws_dynamodb.AttributeType.STRING
            },
            billingMode: aws_dynamodb.BillingMode.PROVISIONED,
            removalPolicy: RemovalPolicy.DESTROY
        })

        this.accountTable = accountTable;
    }
}