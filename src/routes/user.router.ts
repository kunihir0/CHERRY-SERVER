import { FastifyInstance } from 'fastify';
import { loginSchema, signupSchema } from '../schema';
import * as controllers from '../controllers';
import { prisma } from '../helpers/utils';

interface RouteParams {
  email: string;
}

async function userRouter(fastify: FastifyInstance) {
  fastify.decorateRequest('authUser', '');

  fastify.route({
    method: 'POST',
    url: '/login',
    schema: loginSchema,
    handler: controllers.login,
  });

  fastify.route({
    method: 'POST',
    url: '/signup',
    schema: signupSchema,
    handler: controllers.signUp,
  });

  fastify.route({
    method: 'GET',
    url: '/all',
    handler: controllers.getAllUsers,
  });

  fastify.route<{ Params: RouteParams }>({
    method: 'GET',
    url: '/:email',
    handler: async (request, reply) => {
      const { email } = request.params;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        reply.code(404).send({ message: 'User not found' });
        return;
      }
      reply.send(user);
    },
  });
}

export default userRouter;
