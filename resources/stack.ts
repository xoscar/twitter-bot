import {Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import Microservice from './microservice';

export class AwsMicroservicesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const microservices = new Microservice(this, 'Microservices');
  }
}
