import { fastifyCors } from "@fastify/cors";
import fastifystatic from "@fastify/static";
import "dotenv/config";
import { fastify, FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import { postAndGetImageInformation } from "./routes/upload-calories-json.ts";
import { updateUser } from "./routes/user/update.ts";

// JWT SETUP
import fjwt, { FastifyJWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";

const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;

const app = fastify();

app.register(fastifyCors, {
  origin: "*",
});

// MORE JWT SETUP
app.register(fjwt, { secret: "supersecretcode-" + process.env.JWT_SECRET });
app.decorate(
  "authenticate",
  async (req: FastifyRequest, reply: FastifyReply) => {
    const token =
      req.cookies.access_token || req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return reply.status(401).send({ message: "Authentication required" });
    }
    // here decoded will be a different type by default but we want it to be of user-payload type
    const decoded = req.jwt.verify<FastifyJWT["user"]>(token);
    req.user = decoded;
  }
);
app.addHook("preHandler", (req, res, next) => {
  // here we are
  req.jwt = app.jwt;
  return next();
});
// cookies
app.register(fCookie, {
  secret: "some-secret-key",
  hook: "preHandler",
});

app.get("/ping", async (request, reply) => {
  return { ping: "pong 🏓" };
});

app.register(postAndGetImageInformation);
app.register(updateUser);

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
