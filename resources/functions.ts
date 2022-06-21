import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction, NodejsFunctionProps} from 'aws-cdk-lib/aws-lambda-nodejs';
import {Construct} from 'constructs';
import {join} from 'path';
import {TApi} from '../src/types/common.types';

type TProps = {
  api: TApi;
};

class AppFunctions extends Construct {
  public readonly twitterCronJob: NodejsFunction;

  constructor(scope: Construct, id: string, {api}: TProps) {
    super(scope, id);

    this.twitterCronJob = this.creteTwitterCronJob(api);
  }

  private creteTwitterCronJob({twitter}: TApi): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      runtime: Runtime.NODEJS_16_X,
      environment: {
        TWITTER_BEARER_TOKEN: twitter.credentials.bearerToken,
        TWITTER_API_URL: twitter.url,
        TWITTER_API_KEY: twitter.credentials.apiKey,
        TWITTER_API_SECRET: twitter.credentials.apiSecret,
        TWITTER_OAUTH_TOKEN: twitter.credentials.oauthToken,
        TWITTER_OAUTH_TOKEN_SECRET: twitter.credentials.oauthTokenSecret,
      },
    };

    const twitterCronJob = new NodejsFunction(this, 'TwitterCronjobLambdaFunction', {
      entry: join(__dirname, `/../.build/bot/index.js`),
      ...nodeJsFunctionProps,
    });

    return twitterCronJob;
  }
}

export default AppFunctions;
