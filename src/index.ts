import fastify, { FastifyInstance } from 'fastify';
import pino from 'pino';
import loadConfig from './config';
import userRouter from './routes/user.router'

const config = loadConfig();

export class Server {
  private server: FastifyInstance;

  constructor() {
    this.server = fastify({
      logger: pino({ level: 'info' }),
    });
  }

  public async start() {
    try {
      this.server.setErrorHandler((error, request, reply) => {
        this.server.log.error(error);
      });
      this.server.get('/', (request, reply) => {
        reply.send({ name: 'CHERRY SERVER' });
      });

      this.server.register(userRouter, { prefix: '/api/user' })

      if (config.NODE_ENV === 'production') {
        for (const signal of ['SIGINT', 'SIGTERM']) {
          process.on(signal, () =>
            this.server.close().then((err) => {
              console.log(`close application on ${signal}`);
              process.exit(err ? 1 : 0);
            }),
          );
        }
      }

      await this.server.listen({ port: config.API_PORT });

    } catch (e) {
      console.error(e);
    }
  }
}

const server = new Server();
server.start();

export default server.start;
