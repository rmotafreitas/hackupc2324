import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export const deleteAIChatRoute = async (app: FastifyInstance) => {
  app.delete(
    "/ai/chat",
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const messages = await prisma.chatMessages.deleteMany({
        where: {
          userId: request.user.id,
        },
      });
      return messages;
    }
  );
};
