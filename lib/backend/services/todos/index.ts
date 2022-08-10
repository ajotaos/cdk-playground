import * as cdk from 'aws-cdk-lib';

import { Events } from './events';
import { Http } from './http';

import { backendPathOf } from '../../utils/paths';

import type * as events from 'aws-cdk-lib/aws-events';

import type { Construct } from 'constructs';

import type { Database } from '../../../database';

const backendPath = backendPathOf('todos')();

export interface TodosProps extends cdk.StackProps {
  readonly eventBus: events.IEventBus;
  readonly database: Database;
}

export class Todos extends cdk.Stack {
  public readonly httpApiEndpoint: string;

  constructor(scope: Construct, id: string, props: TodosProps) {
    super(scope, id, props);

    // eslint-disable-next-line no-new
    new Events(this, 'Events', {
      backendPath,
      eventBus: props.eventBus,
      database: props.database
    });

    const http = new Http(this, 'Api', {
      backendPath,
      eventBus: props.eventBus,
      database: props.database
    });

    // eslint-disable-next-line no-new
    new cdk.CfnOutput(this, 'TodosHttpApiEndpointOutput', {
      value: http.api.apiEndpoint
    });

    this.httpApiEndpoint = http.api.apiEndpoint;
  }
}
