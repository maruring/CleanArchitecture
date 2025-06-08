/**
 * 口座間取引履歴更新に関するポート
 */

import { Activity } from "@/application/domain/model/Activity";

export interface UpdateActivityPort {
    updateActivity(activity: Activity): Promise<void>
};
