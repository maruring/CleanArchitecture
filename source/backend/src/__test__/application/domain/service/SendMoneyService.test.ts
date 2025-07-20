import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
// テスト対象
import { SendMoneyService } from "@/application/domain/service/SendMoneyService";
import { Account, AccountId } from "@/application/domain/model/Account";
import { Activity } from "@/application/domain/model/Activity";
import { SendMoneyCommand } from "@/application/port/in/SendMoneyCommand";
import { AccountPersistenceAdapter } from "@/adaptor/out/persistence/AccountPersistenceAdapter";
import { Money } from "@/application/domain/model/Money";

// 各種mock
vi.mock('@/adaptor/out/persistence/AccountPersistenceAdapter');
vi.mock('@/application/domain/model/Account');
vi.mock('@/application/domain/model/Activity');

const SOURCE_ACCOUNT_ID = '0000000';
const TARGET_ACCOUNT_ID = '9999999';

describe('SendMoneyService', () => {
    let sendMoneyService: SendMoneyService;
    const mockLoadAccount = vi.fn();
    const mockUpdateAccountState = vi.fn();
    const mockUpdateActivity = vi.fn();

    const fixedDate = new Date('2025-07-21T10:00:00Z');
    const fixedUUID = 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8';

    beforeEach(() => {
        // 各テストの前にモックの状態をリセット
        vi.clearAllMocks();

        vi.mocked(AccountPersistenceAdapter).mockImplementation(() => {
            return {
                loadAccount: mockLoadAccount,
                updateAccountState: mockUpdateAccountState,
                updateActivity: mockUpdateActivity,
            } as any; // 型エラーを回避するためにanyを使用
        });

        sendMoneyService = new SendMoneyService();
        
        vi.useFakeTimers();
        vi.setSystemTime(fixedDate);

        vi.spyOn(crypto, 'randomUUID').mockReturnValue(fixedUUID);
    });

    afterEach(() => {
        // テスト後にタイマーを元の状態に戻す
        vi.useRealTimers();
    });

    test('正常系: 口座金額が足りている', async() => {
        const sourceAccount = new Account(new AccountId(SOURCE_ACCOUNT_ID), new Money(10000));
        const targetAccount = new Account(new AccountId(TARGET_ACCOUNT_ID), new Money(5000));
        const command = new SendMoneyCommand(new AccountId(SOURCE_ACCOUNT_ID), new AccountId(TARGET_ACCOUNT_ID), new Money(10000));
        const sourceAccountMock = vi.mocked(sourceAccount);
        const targetAccountMock = vi.mocked(targetAccount);

        // Accountの各メソッドをmock
        vi.mocked(sourceAccountMock).getAccountId.mockReturnValue(new AccountId(SOURCE_ACCOUNT_ID));
        vi.mocked(sourceAccountMock).getBalance.mockReturnValue(new Money(5000));
        vi.mocked(sourceAccountMock).withdraw.mockReturnValue(true); // 引き出し成功

        vi.mocked(targetAccountMock).getAccountId.mockReturnValue(new AccountId(TARGET_ACCOUNT_ID));
        vi.mocked(targetAccountMock).getBalance.mockReturnValue(new Money(10000));

        mockLoadAccount.mockResolvedValueOnce(sourceAccountMock).mockResolvedValueOnce(targetAccountMock);
        const result = await sendMoneyService.sendMoney(command);

        // 返り値が確認
        expect(result).toBe(true);

    });

    test('以上系: 口座金額が足りない', () => {

    })
})