import { FastifyInstance } from "fastify";
import { z } from "zod";
import { openai } from "./../lib/opeanai";
// import { prisma } from "../lib/prisma";
import { fastifyMultipart } from "@fastify/multipart";
import tesseract from "node-tesseract-ocr";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
const pump = promisify(pipeline);

export const postAndGetImageInformation = async (app: FastifyInstance) => {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_556 * 10, // 10MB
    },
  });
  app.post("/calories", async (request, reply) => {
    console.log("Request received");

    // const userId = request.userID;
    // if (!userId) {
    //   throw new Error("Not authenticated");
    // }
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ error: "No file uploaded" });
    }

    const extension = path.extname(data.filename);

    if (extension !== ".png" && extension !== ".jpg" && extension !== ".jpeg") {
      return reply
        .status(400)
        .send({ error: "Invalid file type, only images are allowed" });
    }

    const fileBaseName = path.basename(data.filename, extension);
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;

    const uploadDir = path.resolve(
      __dirname,
      "..",
      "..",
      "tmp",
      fileUploadName
    );

    await pump(data.file, fs.createWriteStream(uploadDir));
    const bodySchema = z.object({
      // startLocationITACode: z.string(),
      // endLocationITACode: z.string(),
      // JSON: z.string(),
      // photoURL: z.string().optional(),
    });

    const config = {
      oem: 1,
      psm: 3,
    };

    const backText = await tesseract
      .recognize(uploadDir, config)
      .catch((error) => {
        console.log(error.message);
      });

    if (!backText) {
      throw new Error("No text found in image");
    }

    let prompt = `
    Your role is to generate a json for this food, taking into account his parsed text from the back of the food package

Return ONLY a json object as in the example below, if there no information in certain keys, create it up yourself, dont leave any empty string neither empty NaN, dont put [], craft/create the information yourself if needed:
'''
{
	"nutrionValue": INTEGER FILL,
	"energyValue": INTEGER FILL,
	"carbonValue": INTEGER FILL,
	"sugarValue": INTEGER FILL,
	"proteinValue": INTEGER FILL,
	"saltValue": INTEGER FILL
}
'''

Parsed food package back text:
'''
{TEXT}
'''
    `;

    prompt = prompt.replace("{TEXT}", backText);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k-0613",
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: false,
    });

    const message = response.choices[0].message.content;

    if (!message) {
      throw new Error("No response from AI");
    }

    const json = JSON.parse(message);

    return reply.send(json);
  });
};
