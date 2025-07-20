// TODO: テストコードの修正必須

import { expect, test, describe } from "vitest";
import { SendMoneyService } from "@/application/domain/service/SendMoneyService";
import { Account } from "@/application/domain/model/Account";
import { Activity } from "@/application/domain/model/Activity";
import { AccountPersistenceAdapter } from "@/adaptor/out/persistence/AccountPersistenceAdapter";
import { Money } from "@/application/domain/model/Money";
import { AccountId } from "@/application/domain/model/Account";
import { SendMoneyCommand } from "@/application/port/in/SendMoneyCommand";

// mockするライブラリ
import { DynamoDBClient, GetItemCommand, UpdateItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
// mock用ライブラリ
import { mockClient } from "aws-sdk-client-mock";

// 定数関係
const SOURCE_ACCOUNT = {
    id: '123456',
    balance: 10000,
};
const TARGET_ACCOUNT = {
    id: '987654',
    balance: 0,
};
const SEND_MONEY_AMOUNT = 1000;
const LOG_LEVEL = 'INFO';
const DB_REGION = 'ap-northeast-1';
const ACCOUNT_TABLE_NAME = 'user_test';
const ACTIVITY_TABLE_NAME = 'activity_test';
// 環境変数の固定
process.env.LOG_LEVEL = LOG_LEVEL;
process.env.DB_REGION = DB_REGION;
process.env.ACCOUNT_TABLE_NAME = ACCOUNT_TABLE_NAME;
process.env.ACTIVITY_TABLE_NAME = ACTIVITY_TABLE_NAME;

// Mock
const dynamoDBClient = mockClient(DynamoDBClient);

describe('SendMoneyService', () => {
    test('正常系: 送金が成功する', async () => {
        const sendMoneyService = new SendMoneyService();
        const sourceAccountId = new AccountId(SOURCE_ACCOUNT.id);
        const targetAccountId = new AccountId(TARGET_ACCOUNT.id);
        const sendMoneyAmount = new Money(SEND_MONEY_AMOUNT);
        const sendMoneyCommand = new SendMoneyCommand(sourceAccountId, targetAccountId, sendMoneyAmount);

        // GetItemCommandのモックの設定
        dynamoDBClient.on(GetItemCommand).resolvesOnce({
            Item: {
                id: { S: sourceAccountId.id },
                balance: { N: SEND_MONEY_AMOUNT.toString() }
            }
        }).resolvesOnce({
            Item: {
                id: { S: targetAccountId.id },
                balance: { N: SEND_MONEY_AMOUNT.toString() }
            }
        });
        // UpdateItemCommandのモックの設定
        dynamoDBClient.on(UpdateItemCommand).resolves({});
        // PutItemCommandのモックの設定
        dynamoDBClient.on(PutItemCommand).resolves({});
        // 送金処理
        expect(await sendMoneyService.sendMoney(sendMoneyCommand)).toBe(true);
        
    });
});