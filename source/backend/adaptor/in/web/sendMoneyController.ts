/**
 * 送金処理の受け入れ
 * 返却値の生成
 */

// 独自モジュール
import { SendMoneyUseCase } from "../../../application/port/in/SendMoneyUseCase";
import { SendMoneyCommand } from "../../../application/port/in/SendMoneyCommand";

// 外部モジュール
export class SendMoneyController {
    private inputArgs: SendMoneyCommand;
    private sendMoneyUseCase: SendMoneyUseCase;

    constructor (inputArgs: SendMoneyCommand) {
        this.inputArgs = inputArgs;
    }

    sendMoney(): boolean {
        const command = new SendMoneyCommand(this.inputArgs.sourceAccount, this.inputArgs.targetAccount, this.inputArgs.money);
        return this.sendMoneyUseCase.sendMoney(command);
    }
}