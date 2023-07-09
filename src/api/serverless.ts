import * as dotenv from "dotenv";
import startServer from "../index";
// Require the framework
import Fastify from "fastify";

dotenv.config();

// Instantiate Fastify with some config
const app = Fastify({
  logger: false,
});

// Register your application as a normal plugin.
app.register(import("../index"), {
    prefix: '/'
});

export default async (req, res) => {
    await app.ready();
    app.server.emit('request', req, res);
}