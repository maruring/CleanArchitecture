/**
 * DB接続用のClient
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

// 独自モジュール
import { getDbRegion } from "@/common/Utilities";

export const getDynamodbClient = () => {
    const dynamoDbClient = new DynamoDBClient({
        region: getDbRegion()
    });

    const DynamoDocClient = DynamoDBDocument.from(dynamoDbClient);

    return DynamoDocClient;
};