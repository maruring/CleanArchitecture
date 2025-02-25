/**
 * お金に関するドメインモデル
 */

export class Money {
    readonly amount: number;

    constructor(amount: number) {
        this.amount = amount
    }

    public isPositive(): boolean {
        return this.amount >= 0
    }

    public isNegative(): boolean {
        return this.amount < 0
    }

    public static add(moneyA: Money, moneyB: Money): Money {
        return new Money(moneyA.amount + moneyB.amount);
    }

    public static subtract(moneyA: Money, moneyB: Money): Money {
        return new Money(moneyA.amount - moneyB.amount);
    }
}