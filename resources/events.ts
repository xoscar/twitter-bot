import {LambdaFunction} from 'aws-cdk-lib/aws-events-targets';
import {Rule, RuleTargetInput, Schedule} from 'aws-cdk-lib/aws-events';
import {Construct} from 'constructs';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {TPost} from '../src/types/common.types';

interface AppEventsProps {
  twitterCronJobFunction: NodejsFunction;
  postList: TPost[];
}

class AppEvents extends Construct {
  public readonly ruleList: Rule[];

  constructor(scope: Construct, id: string, {twitterCronJobFunction, postList}: AppEventsProps) {
    super(scope, id);

    this.ruleList = this.createPostEventList(twitterCronJobFunction, postList);
  }

  private createPostEventList(twitterCronJobFunction: NodejsFunction, postList: TPost[]): Rule[] {
    return postList.map(({text, cron}, index) => {
      const eventRule = new Rule(this, `ScheduleRule-${index + 1}`, {
        schedule: Schedule.expression(cron),
      });

      eventRule.addTarget(
        new LambdaFunction(twitterCronJobFunction, {
          event: RuleTargetInput.fromObject({
            text,
          }),
        })
      );

      return eventRule;
    });
  }
}

export default AppEvents;
