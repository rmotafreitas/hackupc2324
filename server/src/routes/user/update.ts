import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyJWT } from "@fastify/jwt";

export const updateUser = async (app: FastifyInstance) => {
  app.post("/me", async (request, reply) => {
    const tokenjwt =
      request.cookies.access_token ||
      request?.headers?.authorization?.split(" ")[1];

    const bodySchema = z.object({
      name: z.string().optional(),
      email: z.string().email(),
      password: z.string().optional(),
      nutrionValue: z.number().optional(),
      energyValue: z.number().optional(),
      carbonValue: z.number().optional(),
      sugarValue: z.number().optional(),
      proteinValue: z.number().optional(),
      saltValue: z.number().optional(),
    });

    const {
      name,
      email,
      password,
      nutrionValue,
      energyValue,
      carbonValue,
      sugarValue,
      proteinValue,
      saltValue,
    } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      if (!email || !password || !name) {
        throw new Error("Invalid input");
      }
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password,
          nutrionValue: nutrionValue ?? 0,
          energyValue: energyValue ?? 0,
          carbonValue: carbonValue ?? 0,
          sugarValue: sugarValue ?? 0,
          proteinValue: proteinValue ?? 0,
          saltValue: saltValue ?? 0,
        },
      });
      return newUser;
    }

    if (email && password) {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        throw new Error("Invalid input");
      }
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
      const token = request.jwt.sign(payload);

      reply.setCookie("access_token", token, {
        path: "/",
        httpOnly: true,
        secure: true,
      });

      return {
        ...user,
        password: undefined,
        access_token: token,
      };
    }

    if (!tokenjwt) return { message: "No token" };
    const decode = request.jwt.verify<FastifyJWT["user"]>(tokenjwt);
    if (decode.email !== email) {
      return { message: "Invalid token" };
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: decode.email,
      },
      data: {
        password: password ?? user.password,
        name: name ?? user.name,
        nutrionValue: nutrionValue ?? user.nutrionValue,
        energyValue: energyValue ?? user.energyValue,
        carbonValue: carbonValue ?? user.carbonValue,
        sugarValue: sugarValue ?? user.sugarValue,
        proteinValue: proteinValue ?? user.proteinValue,
        saltValue: saltValue ?? user.saltValue,
      },
    });

    return {
      ...updatedUser,
      password: undefined,
    };
  });
};
