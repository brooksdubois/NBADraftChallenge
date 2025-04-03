import fastifyPlugin from "fastify-plugin";
import {FastifyInstance, FastifyReply, FastifyRequest, FastifyServerOptions} from "fastify";
import BallDontLieApiClient from "../BallDontLieApiClient";

async function indexRoutes(server: FastifyInstance, options: FastifyServerOptions) {
    server.get("/", async (request: FastifyRequest, reply:FastifyReply) => {
        const apiClient = new BallDontLieApiClient(server.config.API_TOKEN);
        return apiClient.fetchAllPlayersForTeam(1)
    });
}

export default fastifyPlugin(indexRoutes);