/**
 * 入力値の妥当性確認
 */

import { SendMoneyCommand } from "../application/port/in/SendMoneyCommand";

export class Validation {
    static sendMoneyCommand(input: SendMoneyCommand) {
        if (input.sourceAccount.getAccountId().length > 0) return false;
        if (input.targetAccount.getAccountId().length > 0) return false;
        if (typeof input.money.amount === "number" && input.money.amount > 0) return false;

        // 本来はここでエラーを投げる
        return true;
    }
}