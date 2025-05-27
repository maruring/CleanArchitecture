/**
 * 口座ドメイン関係の永続化アダプタ
 */

import { GetCommand, GetCommandInput} from "@aws-sdk/lib-dynamodb";

// 独自モジュール
import { Account, AccountId } from "@/application/domain/model/Account";
import { Money } from "@/application/domain/model/Money";
import { LoadAccountPort } from "@/application/port/out/LoadAccountPort";
import { getDynamodbClient } from "./client";
import { getAccountTableName } from "@/common/Utilities";

export class AccountPersistenceAdapter implements LoadAccountPort {
    public async loadAccount(accountId: AccountId): Promise<Account> {
        const client = getDynamodbClient();
        // key=accountIdで存在チェック
        const param: GetCommandInput = {
            TableName: getAccountTableName(),
            Key: {
                'id': accountId.id
            }
        };
        console.debug('GetAccountParam', JSON.stringify(param));

        const response = await client.get(param);
        if(response.Item === undefined) {
            throw new Error('Account Not Fount Error');
        }

        const account = response.Item;

        return new Account(account.id, new Money(account.balance));
    }
}