import type { FastifyPluginAsync } from 'fastify';

export const todos: FastifyPluginAsync = async (fastify) => {
  fastify.register(import('./find-all'));
  fastify.register(import('./find-one-by-id'));

  fastify.register(import('./create'));
};

export default todos;
