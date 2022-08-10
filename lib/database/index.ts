import * as cdk from 'aws-cdk-lib';

import type { Construct } from 'constructs';

export class Database extends cdk.Stack {
  public readonly url: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.url = cdk.Token.asString('');
  }
}
