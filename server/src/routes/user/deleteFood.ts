import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export const deleteFood = async (app: FastifyInstance) => {
  app.delete(
    "/food/:id",
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      console.log("Request received");

      const paramsSchema = z.object({
        id: z.string(),
      });

      const { id } = paramsSchema.parse(request.params);

      console.log("Deleting food with id", id);

      const food = await prisma.food.findUnique({
        where: {
          id,
        },
      });

      if (!food) {
        return reply.status(404).send({
          message: "Food not found",
        });
      }

      console.log("Food found", food);

      const a = prisma.food.deleteMany({
        where: {
          name: food.name,
          userId: request.user.id,
        },
      });

      console.log(a);

      console.log("Food deleted");
    }
  );
};
