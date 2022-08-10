import { fastify } from 'fastify';

import awsLambdaWrapper from '@fastify/aws-lambda';

import type { TodosController } from '../todos/controller';

import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

declare module 'fastify' {
  export interface FastifyRequest {
    todosController: TodosController;
  }
}

export interface CreateHandlerParams {
  readonly todosController: TodosController;
}

export const createHandler = (
  params: CreateHandlerParams
): APIGatewayProxyHandlerV2 => {
  const app = fastify();

  app.addHook('onRequest', (request) => {
    request.todosController = params.todosController;
  });

  app.register(import('./routes'));

  return awsLambdaWrapper(app);
};
