import { Construct } from "constructs";
import { aws_lambda, aws_lambda_nodejs, aws_apigateway, aws_dynamodb, Duration } from "aws-cdk-lib";
import { HttpMethod } from "aws-cdk-lib/aws-lambda";
// 独自モジュール
import { AppParameter } from "../../bin/parameter";

interface ApiConstructProps {
    projectName: string;
    envName: 'dev' | 'stg' | 'prd';
    accountTable: aws_dynamodb.Table;
    activityTable: aws_dynamodb.Table;
}

export class ApiConstruct extends Construct {
    constructor(scope: Construct, id: string, props: ApiConstructProps) {
        super(scope, id);

        const {
            projectName,
            envName,
            accountTable,
            activityTable
        } = props;

        const sendMoneyLambda = new aws_lambda_nodejs.NodejsFunction(
            this,
            `${envName}-${projectName}-sendMoneyLambda`,
            {
                runtime: aws_lambda.Runtime.NODEJS_22_X,
                functionName: `${envName}-${projectName}-sendMoneyLambda`,
                entry: '../../source/backend/src/handler.ts',
                handler: 'sendMoneyHandler',
                timeout: Duration.seconds(29),
                projectRoot: "../../../",
                environment: {
                    'ACCOUNT_TABLE_NAME': accountTable.tableName,
                    'ACTIVITY_TABLE_NAME': activityTable.tableName
                }
            }
        )
        accountTable.grantFullAccess(sendMoneyLambda);
        activityTable.grantFullAccess(sendMoneyLambda);

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

        const sendMoneyInputModel = restApi.addModel(
            'sendMoneyInputModel',
            {
                contentType: 'application/json',
                modelName: 'sendMoneyInputModel',
                schema: {
                    schema: aws_apigateway.JsonSchemaVersion.DRAFT4,
                    title: 'sendMoneyInputModel',
                    type: aws_apigateway.JsonSchemaType.OBJECT,
                    properties: {
                        targetAccount: {type: aws_apigateway.JsonSchemaType.STRING},
                        money: {type: aws_apigateway.JsonSchemaType.NUMBER}
                    },
                    required: ['targetAccount', 'money']
                }
            }
        )

        const restApiAccountResource = restApi.root.addResource('account');
        const restApiAccountIdResource = restApiAccountResource.addResource('{accountId}');
        restApiAccountIdResource.addMethod(
            HttpMethod.POST,
            new aws_apigateway.LambdaIntegration(sendMoneyLambda),
            {
                requestModels: {
                    'application/json': sendMoneyInputModel
                }
            }
        )
    }
}