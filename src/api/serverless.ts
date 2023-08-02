import * as dotenv from "dotenv";
import { Server } from "../index";
import Fastify, { FastifyInstance } from "fastify";

dotenv.config();

class Serverless {
  private app: FastifyInstance;
  private server: Server;

  constructor() {
    // Instantiate Fastify with some config
    this.app = Fastify({
      logger: false,
    });

    // Create a new instance of the Server class
    this.server = new Server();

    // Register your application as a normal plugin.
    this.app.register(this.server.start, {
      prefix: '/'
    });
  }

  public async handleRequest(req, res) {
    await this.app.ready();
    this.app.server.emit('request', req, res);
  }
}

const serverless = new Serverless();

export default async (req, res) => {
  await serverless.handleRequest(req, res);
}
