/**
 * APIの返却値作成
 */
export class BackendApiError extends Error {
    public readonly statusCode: StatusCode

    constructor(message: string, statusCode: StatusCode) {
        super(message);
        this.name = 'BackendApiError',
        this.statusCode = statusCode
    }
};

export type StatusCode = '200' | '201' | '400' | '401' | '402' | '403' | '404' | '500';

export interface Response {
    statusCode: StatusCode
    body: string
    headers: any
};

const headers: any = {
    'Content-Type': 'application/json'
};

/**
 * 成功レスポンス作成
 * @param statusCode 
 * @param body 
 * @param requestId 
 * @returns 
 */
export const makeSucessResponse = (statusCode: StatusCode, body: any, requestId: string): Response => {
    headers['x-requestId'] = requestId;
    return {
        statusCode: statusCode,
        body: JSON.stringify(body),
        headers: headers
    };
};

/**
 * 失敗レスポンスの作成
 * @param {object} error エラーオブジェクト
 * @param {string} requestId 
 * @returns {object}
 */
export const mekeErrorResponse = (error: Error | BackendApiError, requestId: string): Response => {
    headers['x-requestId'] = requestId;
    if (error?.name === 'BackendApiError') {
        const backendError = error as BackendApiError;
        return {
            statusCode: backendError.statusCode,
            body: JSON.stringify({message: error.message}),
            headers: headers
        }
    }
    
    return {
        statusCode: '500',
        body: JSON.stringify({"message": "System Error"}),
        headers: headers
    }
};