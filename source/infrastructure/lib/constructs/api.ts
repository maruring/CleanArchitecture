import { Construct } from "constructs";
import { aws_lambda, aws_lambda_nodejs, aws_apigateway, aws_dynamodb, Duration } from "aws-cdk-lib";
import { HttpMethod } from "aws-cdk-lib/aws-lambda";
// 独自モジュール
import { AppParameter } from "../../bin/parameter";

interface ApiConstructProps {
    projectName: string;
    envName: 'dev' | 'stg' | 'prd';
    accountTable: aws_dynamodb.Table;
}

export class ApiConstruct extends Construct {
    constructor(scope: Construct, id: string, props: ApiConstructProps) {
        super(scope, id);

        const {
            projectName,
            envName,
            accountTable
        } = props;

        const sendMoneyFunc = new aws_lambda_nodejs.NodejsFunction(
            this,
            `${envName}-${projectName}-SendMoneyFunc`,
            {
                architecture: aws_lambda.Architecture.X86_64,
                runtime: aws_lambda.Runtime.NODEJS_20_X,
                functionName: `${envName}-${projectName}-SendMoneyFunc`,
                handler: 'sendMoneyHandler',
                entry: '../backend/account.ts',
                timeout: Duration.seconds(29),
            }
        )
        accountTable.grantFullAccess(sendMoneyFunc);

        const restApi = new aws_apigateway.RestApi(
            this,
            `${envName}-${projectName}`,
            {
                restApiName: `${envName}-${projectName}`,
                deployOptions: {
                    stageName: 'v1'
                }
            }
        )

        const restApiAccountResource = restApi.root.addResource('account');
        restApiAccountResource.addMethod(
            HttpMethod.POST,
            new aws_apigateway.LambdaIntegration(sendMoneyFunc)
        )
    }
}