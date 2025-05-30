#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MainStack } from '../lib/main-stack';
import { getAppParameter } from './parameter';


const app = new cdk.App();
const argContext = 'environment';
const envKey = app.node.tryGetContext(argContext);
const appParameter = getAppParameter(envKey);

new MainStack(app, 
  `${appParameter.envName}-${appParameter.projectName}-mainStack`,
  {
    ...appParameter,
  }
);