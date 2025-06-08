/**
 * 送金処理の具象クラス(処理の実態)
 */

// 独自モジュール
import { Account } from "../model/Account";
import { Activity } from "../model/Activity";
import { AccountPersistenceAdapter } from "@/adaptor/out/persistence/AccountPersistenceAdapter";
import { SendMoneyUseCase } from "../../port/in/SendMoneyUseCase";
import { SendMoneyCommand } from "../../port/in/SendMoneyCommand";


export class SendMoneyService implements SendMoneyUseCase {
    private readonly loadAccountPort: AccountPersistenceAdapter
    private readonly updateAccountStatePort: AccountPersistenceAdapter

    constructor(){
        this.loadAccountPort = new AccountPersistenceAdapter()
        this.updateAccountStatePort = new AccountPersistenceAdapter()
    };

    async sendMoney(sendMoneyCommand: SendMoneyCommand) {
        // 口座情報の取得
        const sourceAccount: Account = await this.loadAccountPort.loadAccount(sendMoneyCommand.sourceAccountId);
        const targetAccount: Account = await this.loadAccountPort.loadAccount(sendMoneyCommand.targetAccountId);

        // モデルの更新
        // Note: 口座金額が足りない場合はその場でエラーとする
        if (!sourceAccount.withdraw(sourceAccount, sendMoneyCommand.money)) return false;
        targetAccount.deposit(sourceAccount, sendMoneyCommand.money);

        // DBへの保存
        await this.updateAccountStatePort.updateAccountState(sourceAccount, sourceAccount.getBalance());
        await this.updateAccountStatePort.updateAccountState(targetAccount, targetAccount.getBalance());

        // 口座間取引履歴のモデルの作成
        const activity = new Activity(
            crypto.randomUUID(),
            sourceAccount.getAccountId(),
            targetAccount.getAccountId(),
            sendMoneyCommand.money,
            new Date(Date.now())
        );
        // 口座間取引履歴のモデルの保存
        await this.updateAccountStatePort.updateActivity(activity);
        
        return true;
    }
}