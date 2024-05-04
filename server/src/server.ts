import { fastifyCors } from "@fastify/cors";
import fastifystatic from "@fastify/static";
import "dotenv/config";
import { FastifyReply, FastifyRequest, fastify } from "fastify";
import * as jose from "jose";
import path from "path";
// import { prisma } from "./lib/prisma";
const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;
import { postAndGetImageInformation } from "./routes/upload-calories-json.ts";

const app = fastify();

const authJWTCHeaderHanko = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const token = request.headers.authorization?.split(" ")[1] ?? null;

  // Check if the token is valid and not expired
  try {
    const payload = jose.decodeJwt(token ?? "");
    const userID = payload.sub;

    if (!userID || token === undefined) {
      throw new Error("Invalid token");
    }

    // @ts-expect-error
    request.userID = userID;
  } catch (error) {
    // @ts-expect-error
    request.userID = null;
  }
};

app.register(fastifyCors, {
  origin: "*",
});

// app.addHook("preHandler", authJWTCHeaderHanko);

app.get("/ping", async (request, reply) => {
  return { ping: "pong 🏓" };
});

app.register(postAndGetImageInformation);

app.register(fastifystatic, {
  root: path.join(__dirname, "..", "tmp"),
  prefix: "/tmp/",
});

// @ts-ignore
app
  .listen({
    host,
    port: Number(process.env.PORT) || 8080,
  })
  .then((address) => {
    console.log(`Server is listening on ${address}`);
  });
