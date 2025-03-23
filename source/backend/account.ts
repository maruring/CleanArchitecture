/**
 * アカウント操作系のハンドラー
 */

import { SendMoneyController } from "./adaptor/in/web/sendMoneyController";

export const sendMoneyHandler = (event: any) => {
    // 引数を抜き出す
    const sendMoneyController = new SendMoneyController(event)
    sendMoneyController.sendMoney()
}