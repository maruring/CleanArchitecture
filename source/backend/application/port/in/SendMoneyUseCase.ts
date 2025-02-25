/**
 * 送金関係のユースケース
 */

import { SendMoneyCommand } from "./SendMoneyCommand"

export interface SendMoneyUseCase {
    sendMoney(sendMoneyCommand: SendMoneyCommand): boolean
}