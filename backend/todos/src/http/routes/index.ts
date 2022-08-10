import type { FastifyPluginAsync } from 'fastify';

export const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(import('./todos'), { prefix: '/todos' });
};

export default routes;
