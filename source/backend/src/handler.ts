/**
 * アカウント操作系のハンドラー
 */

// 独自モジュール
import { SendMoneyController } from "./adaptor/in/web/sendMoneyController";

export const sendMoneyHandler = async(event: any) => {
    // 引数を抜き出す
    console.info('Start SendMoney', event);
    const sourceAccount = event.pathParameters.accountId;
    const body = JSON.parse(event.body);
    // パラメータの組み立て
    const params = {
        'sourceAccountId': sourceAccount,
        'targetAccountId': body.targetAccount,
        'sendMoneyValue': body.money
    };
    const sendMoneyController = new SendMoneyController(params);
    await sendMoneyController.sendMoney();
};