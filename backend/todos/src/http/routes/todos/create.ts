import { createJsonSchema } from '../utils/json-schema';

import type { FastifyPluginAsync, RouteGenericInterface } from 'fastify';

export interface CreateTodoRoute extends RouteGenericInterface {
  readonly Body: {
    readonly name: string;
  };
}

export const createTodo: FastifyPluginAsync = async (fastify) => {
  fastify.route<CreateTodoRoute>({
    method: 'POST',
    url: '/',
    schema: {
      body: createJsonSchema<CreateTodoRoute['Body']>({
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 }
        },
        required: ['name'],
        additionalProperties: false
      })
    },
    handler: async (request, reply) => {
      const todo = await request.todosController.create({
        name: request.body.name
      });

      reply.status(200);

      return { todo };
    }
  });
};

export default createTodo;
