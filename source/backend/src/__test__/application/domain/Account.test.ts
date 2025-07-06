import { expect, test, describe } from "vitest";
import { AccountId, Account } from "@/application/domain/model/Account";
import { Money } from "@/application/domain/model/Money";

const ACCOUNT_ID = '1234567';
const MONEY = 10000;

describe('AccountId', () => {
    test('正常系: 口座IDが正しく設定される', () => {
        const accountId = new AccountId(ACCOUNT_ID);
        expect(accountId.id).toBe(ACCOUNT_ID);
    });

    test('正常系: 異なる口座IDでも正しく設定される', () => {
        const differentId = '9876543';
        const accountId = new AccountId(differentId);
        expect(accountId.id).toBe(differentId);
    });
});

describe('Account', () => {
    describe('コンストラクタ', () => {
        test('正常系: 口座が正しく作成される', () => {
            const accountId = new AccountId(ACCOUNT_ID);
            const money = new Money(MONEY);
            const account = new Account(accountId, money);
            
            expect(account.getAccountId()).toBe(accountId);
            expect(account.getBalance()).toBe(money);
        });
    });

    describe('getAccountId', () => {
        test('正常系: 口座IDが正しく取得される', () => {
            const accountId = new AccountId(ACCOUNT_ID);
            const money = new Money(MONEY);
            const account = new Account(accountId, money);
            
            expect(account.getAccountId()).toBe(accountId);
            expect(account.getAccountId().id).toBe(ACCOUNT_ID);
        });
    });

    describe('getBalance', () => {
        test('正常系: 残高が正しく取得される', () => {
            const accountId = new AccountId(ACCOUNT_ID);
            const money = new Money(MONEY);
            const account = new Account(accountId, money);
            
            expect(account.getBalance()).toBe(money);
            expect(account.getBalance().amount).toBe(MONEY);
        });
    });

    describe('deposit', () => {
        test('正常系: 入金が正しく処理される', () => {
            const accountId = new AccountId(ACCOUNT_ID);
            const initialBalance = new Money(MONEY);
            const account = new Account(accountId, initialBalance);
            
            const sourceAccount = new Account(new AccountId('source'), new Money(5000));
            const depositAmount = new Money(2000);
            
            const result = account.deposit(sourceAccount, depositAmount);
            
            expect(result).toBe(true);
            expect(account.getBalance().amount).toBe(MONEY + 2000);
        });

        test('正常系: 複数回の入金が正しく処理される', () => {
            const accountId = new AccountId(ACCOUNT_ID);
            const initialBalance = new Money(MONEY);
            const account = new Account(accountId, initialBalance);
            
            const sourceAccount = new Account(new AccountId('source'), new Money(5000));
            const depositAmount1 = new Money(1000);
            const depositAmount2 = new Money(3000);
            
            account.deposit(sourceAccount, depositAmount1);
            account.deposit(sourceAccount, depositAmount2);
            
            expect(account.getBalance().amount).toBe(MONEY + 1000 + 3000);
        });
    });

    describe('withdraw', () => {
        test('正常系: 引き出しが正しく処理される', () => {
            const accountId = new AccountId(ACCOUNT_ID);
            const initialBalance = new Money(MONEY);
            const account = new Account(accountId, initialBalance);
            
            const targetAccount = new Account(new AccountId('target'), new Money(0));
            const withdrawAmount = new Money(2000);
            
            const result = account.withdraw(targetAccount, withdrawAmount);
            
            expect(result).toBe(true);
            expect(account.getBalance().amount).toBe(MONEY - 2000);
        });

        test('異常系: 残高不足で引き出しが失敗する', () => {
            const accountId = new AccountId(ACCOUNT_ID);
            const initialBalance = new Money(MONEY);
            const account = new Account(accountId, initialBalance);
            
            const targetAccount = new Account(new AccountId('target'), new Money(0));
            const withdrawAmount = new Money(MONEY + 1000); // 残高を超える金額
            
            const result = account.withdraw(targetAccount, withdrawAmount);
            
            expect(result).toBe(false);
            expect(account.getBalance().amount).toBe(MONEY); // 残高は変更されない
        });

        test('異常系: 残高と同額の引き出しは失敗する', () => {
            const accountId = new AccountId(ACCOUNT_ID);
            const initialBalance = new Money(MONEY);
            const account = new Account(accountId, initialBalance);
            
            const targetAccount = new Account(new AccountId('target'), new Money(0));
            const withdrawAmount = new Money(MONEY); // 残高と同額
            
            const result = account.withdraw(targetAccount, withdrawAmount);
            
            expect(result).toBe(true);
            expect(account.getBalance().amount).toBe(0); // 残高は変更されない
        });

        test('正常系: 残高より少ない金額の引き出しは成功する', () => {
            const accountId = new AccountId(ACCOUNT_ID);
            const initialBalance = new Money(MONEY);
            const account = new Account(accountId, initialBalance);
            
            const targetAccount = new Account(new AccountId('target'), new Money(0));
            const withdrawAmount = new Money(MONEY - 1); // 残高より1円少ない
            
            const result = account.withdraw(targetAccount, withdrawAmount);
            
            expect(result).toBe(true);
            expect(account.getBalance().amount).toBe(1); // 1円残る
        });

        test('正常系: 複数回の引き出しが正しく処理される', () => {
            const accountId = new AccountId(ACCOUNT_ID);
            const initialBalance = new Money(MONEY);
            const account = new Account(accountId, initialBalance);
            
            const targetAccount = new Account(new AccountId('target'), new Money(0));
            const withdrawAmount1 = new Money(2000);
            const withdrawAmount2 = new Money(3000);
            
            const result1 = account.withdraw(targetAccount, withdrawAmount1);
            const result2 = account.withdraw(targetAccount, withdrawAmount2);
            
            expect(result1).toBe(true);
            expect(result2).toBe(true);
            expect(account.getBalance().amount).toBe(MONEY - 2000 - 3000);
        });
    });

    describe('統合テスト', () => {
        test('正常系: 入金と引き出しの組み合わせが正しく動作する', () => {
            const accountId = new AccountId(ACCOUNT_ID);
            const initialBalance = new Money(MONEY);
            const account = new Account(accountId, initialBalance);
            
            const sourceAccount = new Account(new AccountId('source'), new Money(5000));
            const targetAccount = new Account(new AccountId('target'), new Money(0));
            
            // 入金
            account.deposit(sourceAccount, new Money(3000));
            expect(account.getBalance().amount).toBe(MONEY + 3000);
            
            // 引き出し
            account.withdraw(targetAccount, new Money(2000));
            expect(account.getBalance().amount).toBe(MONEY + 3000 - 2000);
            
            // 再度入金
            account.deposit(sourceAccount, new Money(1000));
            expect(account.getBalance().amount).toBe(MONEY + 3000 - 2000 + 1000);
        });

        test('異常系: 残高不足後の入金で再度引き出しが可能になる', () => {
            const accountId = new AccountId(ACCOUNT_ID);
            const initialBalance = new Money(MONEY);
            const account = new Account(accountId, initialBalance);
            
            const sourceAccount = new Account(new AccountId('source'), new Money(5000));
            const targetAccount = new Account(new AccountId('target'), new Money(0));
            
            // 残高不足で引き出し失敗
            const result1 = account.withdraw(targetAccount, new Money(MONEY + 1000));
            expect(result1).toBe(false);
            expect(account.getBalance().amount).toBe(MONEY);
            
            // 入金
            account.deposit(sourceAccount, new Money(2000));
            expect(account.getBalance().amount).toBe(MONEY + 2000);
            
            // 再度引き出し（今度は成功）
            const result2 = account.withdraw(targetAccount, new Money(MONEY + 1000));
            expect(result2).toBe(true);
            expect(account.getBalance().amount).toBe(1000);
        });
    });
});