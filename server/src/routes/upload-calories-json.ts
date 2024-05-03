import { FastifyInstance } from "fastify";
import { z } from "zod";
// import { prisma } from "../lib/prisma";

export const postAndGetImageInformation = async (app: FastifyInstance) => {
  app.post("/calories", async (request, reply) => {
    // const userId = request.userID;
    // if (!userId) {
    //   throw new Error("Not authenticated");
    // }

    const bodySchema = z.object({
      // startLocationITACode: z.string(),
      // endLocationITACode: z.string(),
      // JSON: z.string(),
      // photoURL: z.string().optional(),
    });

    return reply.send({});
  });
};
