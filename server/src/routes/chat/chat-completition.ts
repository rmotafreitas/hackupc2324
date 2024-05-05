import { openai, streamRes } from "./../../lib/opeanai";
import { OpenAIStream } from "ai";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export const getAIChatCompleteRoute = async (app: FastifyInstance) => {
  app.post(
    "/ai/chat/complete",
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const bodySchema = z.object({
        prompt: z.string(),
        temperature: z.number().min(0).max(1).default(0.5),
      });

      const { prompt } = bodySchema.parse(request.body);

      const messages = await prisma.chatMessages.findMany({
        where: {
          userId: request.user.id,
        },
        orderBy: {
          time: "asc",
        },
      });

      let openaiMessages: ChatCompletionMessageParam[] = [];

      messages.forEach((message) => {
        if (message.chatGPT && message.message) {
          openaiMessages.push({
            role: "user",
            content: message.message,
          });
          openaiMessages.push({
            role: "system",
            content: message.chatGPT,
          });
        }
      });

      openaiMessages.push({
        role: "system",
        content: `
          ${prompt}
          '''
          Reponde to the user's question, behave like a nutritionist and provide a helpful response.
        `,
        name: "Nutritionist",
      });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k-0613",
        temperature: 0.5,
        messages: openaiMessages,
        max_tokens: 400,
        stream: true,
      });

      const stream = OpenAIStream(response);

      return streamRes(stream, reply);
    }
  );
};
