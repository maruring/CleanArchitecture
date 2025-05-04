/**
 * SendMoneyServiceの入力モデル
 * 入力値の妥当性確認が責務
 */

import { AccountId } from "../../domain/model/Account";
import { Money } from "../../domain/model/Money"
import { Validation } from "../../../common/Validation";

export class SendMoneyCommand{
    public readonly sourceAccountId: AccountId;
    public readonly targetAccountId: AccountId;
    public readonly money: Money;

    constructor(sourceAccount: AccountId, targetAccount: AccountId, money: Money){
        this.sourceAccountId = sourceAccount;
        this.targetAccountId = targetAccount;
        this.money = money;
        Validation.sendMoneyCommand(this);
    }
}