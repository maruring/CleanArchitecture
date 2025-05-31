/**
 * 口座ドメイン関係の永続化アダプタ
 */

import { GetCommandInput, UpdateCommandInput} from "@aws-sdk/lib-dynamodb";

// 独自モジュール
import { Account, AccountId } from "@/application/domain/model/Account";
import { Money } from "@/application/domain/model/Money";
import { LoadAccountPort } from "@/application/port/out/LoadAccountPort";
import { UpdateAccountStatePort } from "@/application/port/out/UpdateAccountStatePort";
import { getDynamodbClient } from "./client";
import { getAccountTableName } from "@/common/Utilities";

const client = getDynamodbClient();
// key=accountIdで存在チェック

export class AccountPersistenceAdapter implements LoadAccountPort, UpdateAccountStatePort {
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
    }
}