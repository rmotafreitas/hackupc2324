import { FastifyInstance } from "fastify";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export const eat = async (app: FastifyInstance) => {
  app.post(
    "/eat",
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      console.log("Request received");

      const bodySchema = z.object({
        type: z.enum(["BREAKFAST", "LUNCH", "DINNER", "OTHER"]),
        name: z.string(),
        photo: z.string(),
        nutrionValue: z.number(),
        energyValue: z.number(),
        carbonValue: z.number(),
        sugarValue: z.number(),
        proteinValue: z.number(),
        saltValue: z.number(),
      });

      const {
        type,
        name,
        photo,
        nutrionValue,
        energyValue,
        carbonValue,
        sugarValue,
        proteinValue,
        saltValue,
      } = bodySchema.parse(request.body);

      const user = request.user;

      const newFood = await prisma.food.create({
        data: {
          type,
          name,
          photo,
          nutrionValue,
          energyValue,
          carbonValue,
          sugarValue,
          proteinValue,
          saltValue,
          User: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      const userObject = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
        include: {
          foods: {
            where: {
              time: new Date().toISOString(),
            },
          },
        },
      });

      const stats = await getUserStats(user);

      return reply.send({
        newFood,
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

export const getUserStats = async (user: { email: string }) => {
  const userObject = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    include: {
      foods: {
        where: {},
      },
      Weight: {
        orderBy: {
          time: "desc",
        },
      },
    },
  });
  console.log("User", userObject);

  const newStats = {
    nutrionValue: 0,
    carbonValue: 0,
    sugarValue: 0,
    proteinValue: 0,
    saltValue: 0,
    ...userObject,
  };

  userObject?.foods.forEach((food) => {
    console.log("Food", food);
    // check if food is from today
    const date = new Date(food.time);
    const today = new Date();
    if (
      date.getDate() === today.getDate() ||
      date.getMonth() === today.getMonth() ||
      date.getFullYear() === today.getFullYear()
    ) {
      newStats.nutrionValue += food.nutrionValue;
      newStats.carbonValue += food.carbonValue;
      newStats.sugarValue += food.sugarValue;
      newStats.proteinValue += food.proteinValue;
      newStats.saltValue += food.saltValue;
    }
  });

  if (!userObject) {
    return newStats;
  }

  return newStats;
};
