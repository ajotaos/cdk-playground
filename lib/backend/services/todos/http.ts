import * as cdk from 'aws-cdk-lib';
import * as apiGatewayV2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as apiGatewayV2Integrations from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';

import { DockerPrismaFunction } from '../../constructs/function/prisma';

import type * as events from 'aws-cdk-lib/aws-events';

import type { Database } from '../../../database';
import type { Construct } from 'constructs';

export interface HttpProps extends cdk.NestedStackProps {
  readonly backendPath: string;
  readonly database: Database;
  readonly eventBus: events.IEventBus;
}

export class Http extends cdk.NestedStack {
  public readonly api: apiGatewayV2.IHttpApi;

  constructor(scope: Construct, id: string, props: HttpProps) {
    super(scope, id, props);

    const api = new apiGatewayV2.HttpApi(this, 'Api', {
      createDefaultStage: false
    });

    const handler = new DockerPrismaFunction(this, 'Handler', {
      code: lambda.DockerImageCode.fromImageAsset(props.backendPath, {
        cmd: ['http.handler']
      }),
      databaseUrl: props.database.url,
      environment: {
        EVENT_BUS_NAME: props.eventBus.eventBusName
      }
    });

    props.eventBus.grantPutEventsTo(handler);

    api.addRoutes({
      methods: [apiGatewayV2.HttpMethod.GET],
      path: '/todos',
      integration: new apiGatewayV2Integrations.HttpLambdaIntegration(
        'FindAllTodosIntegration',
        handler
      )
    });

    api.addRoutes({
      methods: [apiGatewayV2.HttpMethod.GET],
      path: '/todos/{todoId}',
      integration: new apiGatewayV2Integrations.HttpLambdaIntegration(
        'FindOneTodoByIdIntegration',
        handler
      )
    });

    api.addRoutes({
      methods: [apiGatewayV2.HttpMethod.POST],
      path: '/todos',
      integration: new apiGatewayV2Integrations.HttpLambdaIntegration(
        'CreateTodoIntegration',
        handler
      )
    });

    this.api = api;
  }
}
