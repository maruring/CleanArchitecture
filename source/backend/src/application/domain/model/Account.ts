/**
 * 口座に関するドメインモデル
 */

import { Money } from "./Money";

export class AccountId {
    public readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}

export class Account {
    private accountId: AccountId // 口座番号
    private balance: Money // 残高額

    constructor(accountId: AccountId, balance: Money) {
        this.accountId = accountId
        this.balance = balance
    }

    //  getter
    public getAccountId(): AccountId {
        return this.accountId;
    }

    public getBalance(): Money {
        return this.balance;
    }

    /**
     * 自身の口座に入金される
     * @param sourceAccountId 
     * @returns 
     */
    public deposit(sourceAccount: Account, money: Money): boolean {
        this.balance = Money.add(this.balance, money)
        return true;
    }

    /**
     * 自身の口座から引き出される
     * @returns 
     */
    public withdraw(targetAccount: Account, money: Money): boolean {
        if (!this.mayWithdraw(money)) return false;

        this.balance = Money.subtract(this.balance, money);
        return true;
    }

    /**
     * 引き出し可能かどうかをチェックする
     * @returns
     */
    private mayWithdraw(money: Money): boolean {
        return Money.subtract(this.balance, money).isPositive();
    }
}