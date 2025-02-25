/**
 * アカウント操作系のハンドラー
 */

import { SendMoneyController } from "../in/web/sendMoneyController";

export const sendMoney = (event: any) => {
    // 引数を抜き出す
    const sendMoneyController = new SendMoneyController(event)
    sendMoneyController.sendMoney()
}