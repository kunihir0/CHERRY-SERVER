import * as dotenv from "dotenv";
import Fastify from "fastify";
import startServer from "../index";

dotenv.config();

const server = Fastify({
  logger: true,
});

server.register(startServer);

export default async (req, res) => {
  await server.ready();
  server.server.emit("request", req, res);
};
