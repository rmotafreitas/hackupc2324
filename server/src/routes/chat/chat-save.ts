import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export const getAIChatSaveRoute = async (app: FastifyInstance) => {
  app.post(
    "/ai/chat/save",
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const bodySchema = z.object({
        promptText: z.string(),
        resultText: z.string(),
      });
      const { promptText, resultText } = bodySchema.parse(request.body);

      await prisma.chatMessages.create({
        data: {
          userId: request.user.id,
          message: promptText,
          chatGPT: resultText,
        },
      });
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
