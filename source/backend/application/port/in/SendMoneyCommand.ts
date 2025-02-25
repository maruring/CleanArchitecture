/**
 * SendMoneyServiceの入力モデル
 * 入力値の妥当性確認が責務
 */

import { Account } from "../../domain/model/Account";
import { Money } from "../../domain/model/Money"
import { Validation } from "../../../common/Validation";

export class SendMoneyCommand{
    public readonly sourceAccount: Account;
    public readonly targetAccount: Account;
    public readonly money: Money;

    constructor(sourceAccount: Account, targetAccount: Account, money: Money){
        this.sourceAccount = sourceAccount;
        this.targetAccount = targetAccount;
        this.money = money;
        Validation.sendMoneyCommand(this);
    }
}