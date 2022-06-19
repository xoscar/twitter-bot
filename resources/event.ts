import {LambdaFunction} from 'aws-cdk-lib/aws-events-targets';
import {Rule, Schedule} from 'aws-cdk-lib/aws-events';
import {Construct} from 'constructs';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';

interface EventProps {
  twitterCronJobFunction: NodejsFunction;
}

class EventRule extends Construct {
  public readonly twitterCronJobEventRule: Rule;

  constructor(scope: Construct, id: string, {twitterCronJobFunction}: EventProps) {
    super(scope, id);

    this.twitterCronJobEventRule = this.createTwitterBotEventRule(twitterCronJobFunction);
  }

  private createTwitterBotEventRule(twitterCronJobFunction: NodejsFunction): Rule {
    const eventRule = new Rule(this, 'scheduleRule', {
      schedule: Schedule.cron({minute: '0', hour: '1'}),
    });

    eventRule.addTarget(new LambdaFunction(twitterCronJobFunction));

    return eventRule;
  }
}

export default EventRule;
