import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction, NodejsFunctionProps} from 'aws-cdk-lib/aws-lambda-nodejs';
import {Construct} from 'constructs';
import {join} from 'path';

class Microservices extends Construct {
  public readonly twitterCronJob: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // product microservices
    this.twitterCronJob = this.creteTwitterCronJob();
  }

  private creteTwitterCronJob(): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      runtime: Runtime.NODEJS_14_X,
    };

    // Product microservices lambda function
    const twitterCronJob = new NodejsFunction(this, 'TwitterCronjObLambdaFunction', {
      entry: join(__dirname, `/../src/bot/index.js`),
      ...nodeJsFunctionProps,
    });

    return twitterCronJob;
  }
}

export default Microservices;
