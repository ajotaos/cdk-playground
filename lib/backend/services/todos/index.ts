import * as cdk from 'aws-cdk-lib';

import { Events } from './events';
import { Http } from './http';

import { backendPathOf } from '../../utils/paths';

import type * as events from 'aws-cdk-lib/aws-events';

import type { Database } from '../../../database';
import type { Construct } from 'constructs';

const backendPath = backendPathOf('todos')();

export interface TodosProps extends cdk.StackProps {
  readonly database: Database;
  readonly eventBus: events.IEventBus;
}

export class Todos extends cdk.Stack {
  public readonly httpApiEndpoint: string;

  constructor(scope: Construct, id: string, props: TodosProps) {
    super(scope, id, props);

    // eslint-disable-next-line no-new
    new Events(this, 'Events', {
      backendPath,
      database: props.database,
      eventBus: props.eventBus
    });

    const http = new Http(this, 'Http', {
      backendPath,
      database: props.database,
      eventBus: props.eventBus
    });

    // eslint-disable-next-line no-new
    new cdk.CfnOutput(this, 'TodosHttpApiEndpointOutput', {
      value: http.api.apiEndpoint
    });

    this.httpApiEndpoint = http.api.apiEndpoint;
  }
}
