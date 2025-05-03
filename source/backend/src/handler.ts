/**
 * アカウント操作系のハンドラー
 */

import { SendMoneyController } from "./adaptor/in/web/sendMoneyController";

export const sendMoneyHandler = (event: any) => {
    // 引数を抜き出す
    console.log('hello sendMoneyHandler');
    const sendMoneyController = new SendMoneyController(event)
    sendMoneyController.sendMoney()
}