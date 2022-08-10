/* eslint-disable @typescript-eslint/no-unused-vars */
import { createServer } from '@graphql-yoga/node';
import { configure } from '@vendia/serverless-express';

import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import type { Controller } from '#lib/controller';

export const handlerOf = ({
  controller
}: {
  controller: Controller;
}): APIGatewayProxyHandlerV2 => {
  const app = createServer({
    context: async () => ({ controller })
  });

  return configure({
    app,
    log: app.logger
  });
};
