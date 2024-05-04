import { openai } from "./../lib/opeanai";
import { FastifyInstance } from "fastify";
import { z } from "zod";
// import { prisma } from "../lib/prisma";
import tesseract from "node-tesseract-ocr";

export const postAndGetImageInformation = async (app: FastifyInstance) => {
  app.post("/calories", async (request, reply) => {
    // const userId = request.userID;
    // if (!userId) {
    //   throw new Error("Not authenticated");
    // }

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
      .recognize("https://i.imgur.com/2vTiSu6.jpeg", config)
      .catch((error) => {
        console.log(error.message);
      });

    if (!backText) {
      throw new Error("No text found in image");
    }

    let prompt = `
    Your role is to generate a json for this food, taking into account his parsed text from the back of the food package

Return ONLY a json object as in the example below, if there no information in certain keys, create it up yoursef, dont leave any empty string neither empty arrays, dont put [], craft/create the information yourself if needed:
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
