/**
 * 口座情報更新のポート
 */

import { Account } from "@/application/domain/model/Account";
import { Money } from "@/application/domain/model/Money";

export interface UpdateAccountStatePort {
    updateAccountState(account: Account, money: Money): Promise<void>
}