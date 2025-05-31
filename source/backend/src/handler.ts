/**
 * アカウント操作系のハンドラー
 */

// 独自モジュール
import { SendMoneyController } from "./adaptor/in/web/sendMoneyController";
import { makeSucessResponse, mekeErrorResponse, BackendApiError } from "./common/make-response";

export const sendMoneyHandler = async(event: any) => {
    // 引数を抜き出す
    console.info('Start SendMoney', event);
    const requestId = event.requestContext.requestId;
    const sourceAccount = event.pathParameters.accountId;
    const body = JSON.parse(event.body);
    // パラメータの組み立て
    const params = {
        'sourceAccountId': sourceAccount,
        'targetAccountId': body.targetAccount,
        'sendMoneyValue': body.money
    };
    const sendMoneyController = new SendMoneyController(params);
    
    try {
        const result: boolean = await sendMoneyController.sendMoney();
        if (!result) throw new BackendApiError('口座金額が足りません', '500');
        return makeSucessResponse(
            '200',
            {'message': '振込を完了しました'},
            requestId
        );
    } catch (e) {
        console.error(e);
        return 
    } finally {
        console.info('End SendMoney', event);
    }
};