import { utils } from './helpers/utils';
import fastify from 'fastify';
import pino from 'pino';
import loadConfig from './config';
import userRouter from './routes/user.router'

const config = loadConfig();

const startServer = async () => {
  try {
    const server = fastify({
      logger: pino({ level: 'info' }),
    });
    server.setErrorHandler((error, request, reply) => {
      server.log.error(error);
    });
    server.get('/', (request, reply) => {
      reply.send({ name: 'CHERRY SERVER' });
    });
      
    server.register(userRouter, { prefix: '/api/user' })

    if (config.NODE_ENV === 'production') {
      for (const signal of ['SIGINT', 'SIGTERM']) {
        process.on(signal, () =>
          server.close().then((err) => {
            console.log(`close application on ${signal}`);
            process.exit(err ? 1 : 0);
          }),
        );
      }
    }
    await server.listen(config.API_PORT);
  } catch (e) {
    console.error(e);
  }
};

process.on('unhandledRejection', (e) => {
  console.error(e);
  process.exit(1);
});

startServer();

export default startServer;
