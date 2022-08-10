import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as eventsTargets from 'aws-cdk-lib/aws-events-targets';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

import { DockerPrismaFunction } from '../../constructs/function/prisma';

import type { Construct } from 'constructs';

import type { Database } from '../../../database';

export interface EventsProps extends cdk.NestedStackProps {
  readonly backendPath: string;
  readonly eventBus: events.IEventBus;
  readonly database: Database;
}

export class Events extends cdk.NestedStack {
  constructor(scope: Construct, id: string, props: EventsProps) {
    super(scope, id, props);

    const todosRule = new events.Rule(this, 'TodosRule', {
      eventBus: props.eventBus,
      eventPattern: {
        source: ['Todos.Playground'],
        detailType: ['TodoCreated', 'TodoDeleted']
      }
    });

    const handler = new DockerPrismaFunction(this, 'Handler', {
      code: lambda.DockerImageCode.fromImageAsset(props.backendPath, {
        cmd: ['handler.events']
      }),
      databaseUrl: props.database.url,
      environment: {
        EVENT_BUS_ARN: props.eventBus.eventBusArn
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
