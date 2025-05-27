/**
 * 口座情報Loadのポート
 */

import { Account, AccountId } from "@/application/domain/model/Account";

export interface LoadAccountPort {
    loadAccount(accountId: AccountId): Promise<Account>
};
