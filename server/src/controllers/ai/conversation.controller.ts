import OpenAI from "openai";
import { Response } from "express";
import { CustomRequest } from "../../middlewares/auth";
import { checkApiLimit, incrementApiLimit } from "../../libs/apiLimit";
import { checkSubscription } from "../../libs/subscription";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateConversation = async (req: CustomRequest, res: Response) => {



    try {



        const { messages } = req.body;



        if (!openai.apiKey) {



            console.log("[CONVERSATION POST ERROR]", "OpenAI api key not configured!");



            return res.status(500).json({ error: "OpenAI api key not configured!" });



        }



        if (!messages) {



            console.log("[CONVERSATION POST ERROR]", "Messages not provided!");



            return res.status(400).json({ error: "Messages not provided!" });



        }



        const isValidTrail = await checkApiLimit(req?.userId!);

        const isPro = await checkSubscription(req?.userId!);



        if (!isValidTrail && !isPro) {



            return res.status(403).json({ error: "Free trail has expired. Please upgrade to pro!" });



        }



        const chatCompletion = await openai.chat.completions.create({

            model: "gpt-3.5-turbo",

            messages,

            stream: true,

        });



        if(!isPro) await incrementApiLimit(req?.userId!);



        res.status(200);



        try {

            for await (const chunk of chatCompletion) {

                res.write(chunk);

            }

            res.end();

        } catch (error) {

            console.log("[CONVERSATION STREAM ERROR]", error);

            res.status(500).json({ error: "Something went wrong during streaming." });

        }



    } catch (error) {



        console.log("[CONVERSATION POST ERROR]", error);



        return res.status(500).json({ error: "Something went wrong." });



    }



}