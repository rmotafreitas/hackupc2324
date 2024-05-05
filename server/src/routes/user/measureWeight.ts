import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { getUserStats } from "./eat";

export const postWeight = async (app: FastifyInstance) => {
  app.post(
    "/weight",
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const bodySchema = z.object({
        weight: z.number(),
      });

      const { weight } = bodySchema.parse(request.body);

      const user = request.user;

      const userObject = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          foods: true,
        },
      });

      if (!userObject) {
        return reply.status(404).send({ message: "User not found" });
      }
      const stats = await getUserStats(user);

      const newWeight = await prisma.weight.create({
        data: {
          weight,
          User: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return reply.send({
        newWeight,
        user: {
          email: user.email,
          password: undefined,
          name: user.name,
          foods: userObject?.foods,
          stats,
        },
      });
    }
  );
};
