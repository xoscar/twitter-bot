import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import AppStack from './stack';
import config from '../config.json';

const app = new cdk.App();
new AppStack(app, 'AppStack', config);
