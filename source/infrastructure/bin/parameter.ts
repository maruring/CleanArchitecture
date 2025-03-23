import { Environment } from "aws-cdk-lib";

export interface AppParameter {
    projectName: string;
    envName: 'dev' | 'stg' | 'prd';
    env: Environment;
    commonResourcesProjectName: string // 共通リソース管理用のプロジェクト名
}

const commonParameter = {
    projectName: 'study-clean-architecture-api',
    commonResourcesProjectName: 'study-clean-architecture-common-resource'
};

export const devParameter: AppParameter = {
    ...commonParameter,
    envName: 'dev',
    env: {
        region: 'ap-northeast-1',
    },
};

export const stgParameter: AppParameter = {
    ...commonParameter,
    envName: 'stg',
    env: {
        region: 'ap-northeast-1',
    },
};

export const prdParameter: AppParameter = {
    ...commonParameter,
    envName: 'prd',
    env: {
        region: 'ap-northeast-1',
    },
};

export const getAppParameter = (envKey: 'dev' | 'stg' | 'prd'): AppParameter => {
    const parameters = [devParameter, stgParameter, prdParameter];
    const appParameters = parameters.filter((obj: AppParameter) => obj.envName === envKey);
    if (appParameters.length === 0) {
        throw new Error(`Not found environment key: ${envKey}`);
    }

    const appParameter = appParameters[0];

    appParameter.env = {
        region: appParameter.env.region
    }

    return appParameter;
}