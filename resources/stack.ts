import {Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import AppFunctions from './functions';
import AppEvents from './events';
import {TConfig} from '../src/types/common.types';

class AppStack extends Stack {
  constructor(scope: Construct, id: string, {postList, api}: TConfig, props?: StackProps) {
    super(scope, id, props);

    const appFunctions = new AppFunctions(this, 'AppFunctions', {api});
    new AppEvents(this, 'AppEvents', {twitterCronJobFunction: appFunctions.twitterCronJob, postList});
  }
}

export default AppStack;
