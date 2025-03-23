import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

// 独自モジュール
import { AppParameter } from '../bin/parameter';
import { DynamodbConstruct } from './constructs/dynamodb';
import { ApiConstruct } from './constructs/api';

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppParameter & cdk.StackProps) {
    super(scope, id, props);

    const {
      projectName,
      envName,
      env,
      commonResourcesProjectName
    } = props;

    const dynamodbConstruct = new DynamodbConstruct(this, "Dynamodb", {
      projectName: projectName,
      envName: envName,
    });

    const apiConstruct = new ApiConstruct(this, "Api", {
      projectName: projectName,
      envName: envName,
      accountTable: dynamodbConstruct.accountTable
    })
  }
}
