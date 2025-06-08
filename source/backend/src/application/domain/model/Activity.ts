/**
 * 口座間取引履歴に関するドメインモデル
 */

import { AccountId } from "./Account";
import { Money } from "./Money";

export class Activity {
    private readonly id: string
    private readonly sourceAccountId: AccountId
    private readonly targetAccountId: AccountId
    private readonly money: Money
    private readonly timeStamp: Date

    constructor(id: string, sourceAccountId: AccountId, targetAccountId: AccountId, money: Money, timeStamp: Date) {
        this.id = id
        this.sourceAccountId = sourceAccountId
        this.targetAccountId = targetAccountId
        this.money = money
        this.timeStamp = timeStamp
    }

    // getter
    public getId(): string {
        return this.id
    }

    public getSourceAccountId(): AccountId {
        return this.sourceAccountId
    }

    public getTargetAccountId(): AccountId {
        return this.targetAccountId
    }

    public getMoney(): number {
        return this.money.amount
    }

    public getTimeStamp(): Date {
        return this.timeStamp
    }
}
