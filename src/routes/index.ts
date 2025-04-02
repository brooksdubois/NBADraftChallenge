import fastifyPlugin from "fastify-plugin";
import {FastifyInstance, FastifyReply, FastifyRequest, FastifyServerOptions} from "fastify";
import BallDontLieApiClient from "../BallDontLieApiClient";

async function indexRoutes(server: FastifyInstance, options: FastifyServerOptions) {
    server.get("/", async (request: FastifyRequest, reply:FastifyReply) => {
        return "Hello World"
    });
}

export default fastifyPlugin(indexRoutes);