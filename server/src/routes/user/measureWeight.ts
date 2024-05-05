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
        date: z.string().optional().default(new Date().toISOString()),
      });

      const { weight, date } = bodySchema.parse(request.body);

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

      // It can only create if the user has no weight for the day
      const existingWeight = await prisma.weight.findMany({
        where: {
          userId: user.id,
        },
      });
      for (const w of existingWeight) {
        if (
          w.time.toISOString().split("T")[0] ===
          new Date(date).toISOString().split("T")[0]
        ) {
          const updatedWeight = await prisma.weight.update({
            where: {
              id: w.id,
            },
            data: {
              weight,
            },
          });
          return reply.send({
            updatedWeight,
            user: {
              email: user.email,
              password: undefined,
              name: user.name,
              foods: userObject?.foods,
              stats,
            },
          });
        }
      }

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
