/**
 * 全ての層で使用する便利関数
 */

/**
 * DBのリージョン取得
 * @returns string
 */
export const getDbRegion = () => {
    const DB_REGION = process.env['DB_REGION']
    if (!DB_REGION) return 'ap-northeast-1';

    return DB_REGION;
};

export const getAccountTableName = () => {
    return process.env['ACCOUNT_TABLE_NAME'];
}

export const getActivityTableName = () => {
    return process.env['ACTIVITY_TABLE_NAME'];
}