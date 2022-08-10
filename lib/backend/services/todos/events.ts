import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as eventsTargets from 'aws-cdk-lib/aws-events-targets';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

import { DockerPrismaFunction } from '../../constructs/function/prisma';

import type { Database } from '../../../database';
import type { Construct } from 'constructs';

export interface EventsProps extends cdk.NestedStackProps {
  readonly backendPath: string;
  readonly database: Database;
  readonly eventBus: events.IEventBus;
}

export class Events extends cdk.NestedStack {
  constructor(scope: Construct, id: string, props: EventsProps) {
    super(scope, id, props);

    const todosRule = new events.Rule(this, 'TodosRule', {
      eventBus: props.eventBus,
      eventPattern: {
        source: ['playground.todos'],
        detailType: ['TodoCreated', 'TodoNameUpdated']
      }
    });

    const handler = new DockerPrismaFunction(this, 'Handler', {
      code: lambda.DockerImageCode.fromImageAsset(props.backendPath, {
        cmd: ['events.handler']
      }),
      databaseUrl: props.database.url,
      environment: {
        EVENT_BUS_NAME: props.eventBus.eventBusName
      }
    });

    props.eventBus.grantPutEventsTo(handler);

    todosRule.addTarget(
      new eventsTargets.LambdaFunction(handler, {
        deadLetterQueue: new sqs.Queue(this, 'TodosRuleTargetDLQueue')
      })
    );
  }
}
