/**
 * 口座ドメイン関係の永続化アダプタ
 */

import { GetCommandInput, PutCommandInput, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";

// 独自モジュール
import { Account, AccountId } from "@/application/domain/model/Account";
import { Money } from "@/application/domain/model/Money";
import { Activity } from "@/application/domain/model/Activity";
import { LoadAccountPort } from "@/application/port/out/LoadAccountPort";
import { UpdateAccountStatePort } from "@/application/port/out/UpdateAccountStatePort";
import { UpdateActivityPort } from "@/application/port/out/UpdateActivity";
import { getAccountTableName, getActivityTableName } from "@/common/Utilities";
import { getDynamodbClient } from "./client";

const client = getDynamodbClient();
// key=accountIdで存在チェック

export class AccountPersistenceAdapter implements LoadAccountPort, UpdateAccountStatePort, UpdateActivityPort {
    public async loadAccount(accountId: AccountId): Promise<Account> {
        const param: GetCommandInput = {
            TableName: getAccountTableName(),
            Key: {
                id: accountId.id
            }
        };
        console.debug('GetAccountParam', JSON.stringify(param));

        const response = await client.get(param);
        if(response.Item === undefined) {
            throw new Error('Account Not Fount Error');
        }

        const account = response.Item;

        return new Account(account.id, new Money(account.balance));
    };

    public async updateAccountState(account: Account, money: Money): Promise<void> {
        const param: UpdateCommandInput = {
            TableName: getAccountTableName(),
            Key: {
                id: account.getAccountId()
            },
            ExpressionAttributeNames: {
                '#balance': 'balance'
            },
            ExpressionAttributeValues: {
                ':balance': money.amount
            },
            UpdateExpression: 'set #balance = :balance',
            ReturnValues: 'ALL_NEW'
        };

        console.debug('UpdateAccountParam', JSON.stringify(param));

        const response = await client.update(param);
        console.log('update res', response);

        return;
    };

    public async updateActivity(activity: Activity): Promise<void> {
        const param: PutCommandInput = {
            TableName: getActivityTableName(),
            Item: {
                id: activity.getId(),
                sourceAccountId: activity.getSourceAccountId(),
                targetAccountId: activity.getTargetAccountId(),
                money: activity.getMoney(),
                timeStamp: activity.getTimeStamp().toISOString()
            }
        };

        console.debug('PutActivityParam', JSON.stringify(param));

        const response = await client.put(param);
        console.log('put res', response);

        return;
    };
}