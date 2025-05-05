/**
 * 送金処理の具象クラス(処理の実態)
 */

// 独自モジュール
import { Account, AccountId } from "../model/Account";
import { LoadAccountPort } from "@/application/port/out/LoadAccountPort";
import { SendMoneyUseCase } from "../../port/in/SendMoneyUseCase";
import { SendMoneyCommand } from "../../port/in/SendMoneyCommand";


export class SendMoneyService implements SendMoneyUseCase {
    private readonly loadAccountPort: LoadAccountPort;

    constructor(loadAccountPort: LoadAccountPort){
        this.loadAccountPort = loadAccountPort
    };

    async sendMoney(sendMoneyCommand: SendMoneyCommand) {
        // 引数はSendMoneyCommandクラスでヴァリデーションがされている(入力値の妥当性確認済)

        // 口座情報の取得
        const sourceAccount: Account = await this.loadAccountPort.loadAccount(sendMoneyCommand.sourceAccountId);
        const targetAccount: Account = await this.loadAccountPort.loadAccount(sendMoneyCommand.targetAccountId);

        // モデルの更新
        sourceAccount.withdraw(sourceAccount, sendMoneyCommand.money);
        targetAccount.deposit(sourceAccount, sendMoneyCommand.money);

        // DBへの保存
        
        return true;
    }
}