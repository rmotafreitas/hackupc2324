import { FastifyInstance } from "fastify";
import { prisma } from "./../../lib/prisma";

export const getAIChatRoute = async (app: FastifyInstance) => {
  app.get(
    "/ai/chat",
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const messages = await prisma.chatMessages.findMany({
        where: {
          userId: request.user.id,
        },
        orderBy: {
          time: "desc",
        },
      });
      return messages;
    }
  );
};
