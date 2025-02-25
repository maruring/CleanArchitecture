/**
 * 送金処理の具象クラス(処理の実態)
 */

import { SendMoneyUseCase } from "../../port/in/SendMoneyUseCase";
import { SendMoneyCommand } from "../../port/in/SendMoneyCommand";

export class SendMoneyService implements SendMoneyUseCase {
    sendMoney(sendMoneyCommand: SendMoneyCommand) {
        // 引数はSendMoneyCommandクラスでヴァリデーションがされている(入力値の妥当性確認済)
        
        // モデルの更新
        sendMoneyCommand.sourceAccount.withdraw(sendMoneyCommand.sourceAccount, sendMoneyCommand.money)
        sendMoneyCommand.targetAccount.deposit(sendMoneyCommand.sourceAccount, sendMoneyCommand.money)

        // DBへの保存
        
        return true;
    }
}