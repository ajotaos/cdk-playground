import { createJsonSchema } from '../utils/json-schema';

import type { FastifyPluginAsync, RouteGenericInterface } from 'fastify';

export interface FindOneByIdRoute extends RouteGenericInterface {
  readonly Params: {
    readonly todoId: string;
  };
}

export const findOneTodoById: FastifyPluginAsync = async (fastify) => {
  fastify.route<FindOneByIdRoute>({
    method: 'GET',
    url: '/:todoId',
    schema: {
      params: createJsonSchema<FindOneByIdRoute['Params']>({
        type: 'object',
        properties: {
          todoId: { type: 'string', minLength: 1 }
        },
        required: ['todoId'],
        additionalProperties: false
      })
    },
    handler: async (request, reply) => {
      const todo = await request.todosController.findOneById({
        id: request.params.todoId
      });

      reply.status(200);

      return { todo };
    }
  });
};

export default findOneTodoById;
