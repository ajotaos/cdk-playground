import * as cdk from 'aws-cdk-lib';
import * as apiGatewayV2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as apiGatewayV2Integrations from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';

import { DockerPrismaFunction } from '../../constructs/function/prisma';

import type * as events from 'aws-cdk-lib/aws-events';

import type { Construct } from 'constructs';

import type { Database } from '../../../database';

export interface HttpProps extends cdk.NestedStackProps {
  readonly backendPath: string;
  readonly eventBus: events.IEventBus;
  readonly database: Database;
}

export class Http extends cdk.NestedStack {
  public readonly api: apiGatewayV2.IHttpApi;

  constructor(scope: Construct, id: string, props: HttpProps) {
    super(scope, id, props);

    const handler = new DockerPrismaFunction(this, 'Handler', {
      code: lambda.DockerImageCode.fromImageAsset(props.backendPath, {
        cmd: ['handler.api']
      }),
      databaseUrl: props.database.url,
      environment: {
        EVENT_BUS_ARN: props.eventBus.eventBusArn
      }
    });
    props.eventBus.grantPutEventsTo(handler);

    const api = new apiGatewayV2.HttpApi(this, 'Api', {
      createDefaultStage: false,
      defaultIntegration: new apiGatewayV2Integrations.HttpLambdaIntegration(
        'DefaultIntegration',
        handler
      )
    });

    this.api = api;
  }
}
