import type { FastifyPluginAsync, RouteGenericInterface } from 'fastify';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FindAllTodosRoute extends RouteGenericInterface {}

export const findAllTodos: FastifyPluginAsync = async (fastify) => {
  fastify.route<FindAllTodosRoute>({
    method: 'GET',
    url: '/',
    handler: async (request, reply) => {
      const todos = await request.todosController.findAll();

      reply.status(200);

      return { todos };
    }
  });
};

export default findAllTodos;
