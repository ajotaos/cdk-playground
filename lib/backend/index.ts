import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';

import type { Construct } from 'constructs';

export class Backend extends cdk.Stack {
  public readonly eventBus: events.IEventBus;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const eventBus = new events.EventBus(this, 'EventBus');

    this.eventBus = eventBus;
  }
}
