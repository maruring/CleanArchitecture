/**
 * 送金処理の受け入れ
 * 返却値の生成
 */

// 独自モジュール
import { AccountId } from "@/application/domain/model/Account";
import { Money } from "@/application/domain/model/Money";
import { SendMoneyUseCase } from "../../../application/port/in/SendMoneyUseCase";
import { SendMoneyCommand } from "../../../application/port/in/SendMoneyCommand";
import { SendMoneyService } from "@/application/domain/service/SendMoneyService";

interface SendMoneyInput {
    sourceAccountId: string, 
    targetAccountId: string,
    sendMoneyValue: number
}

// 外部モジュール
export class SendMoneyController {
    private inputArgs: SendMoneyCommand;
    private sendMoneyUseCase: SendMoneyUseCase;

    constructor (sendMoneyInput: SendMoneyInput) {
        this.inputArgs = {
            sourceAccountId: new AccountId(sendMoneyInput.sourceAccountId),
            targetAccountId: new AccountId(sendMoneyInput.targetAccountId),
            money: new Money(sendMoneyInput.sendMoneyValue)
        };
        this.sendMoneyUseCase = new SendMoneyService();
    }

    public async sendMoney(): Promise<boolean> {
        const command = new SendMoneyCommand(this.inputArgs.sourceAccountId, this.inputArgs.targetAccountId, this.inputArgs.money);
        console.info('SendMoneyCommand', command);
        const response = await this.sendMoneyUseCase.sendMoney(command);
        return response;
    }
}