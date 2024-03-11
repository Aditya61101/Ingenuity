import OpenAI from "openai";
import { Response } from "express";
import { CustomRequest } from "../../middlewares/auth";
import { checkApiLimit, incrementApiLimit } from "../../libs/apiLimit";
import { checkSubscription } from "../../libs/subscription";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage = {
    role: "system",
    content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
};

export const generateCode = async (req: CustomRequest, res: Response) => {
    try {
        const { messages } = req.body;
        if (!openai.apiKey) {
            console.log("[Code POST ERROR]", "OpenAI api key not configured!");
            return res.status(500).json({ error: "OpenAI api key not configured!" });
        }
        if (!messages) {
            console.log("[Code POST ERROR]", "Messages not provided!");
            return res.status(400).json({ error: "Messages not provided!" });
        }
        const isValidTrail = await checkApiLimit(req?.userId!);
        const isPro = await checkSubscription(req?.userId!);
        if (!isValidTrail && !isPro) {
            return res.status(403).json({ error: "Free trail has expired. Please upgrade to pro!" });
        }

        const codeCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages]
        });
        
        if (!isPro) await incrementApiLimit(req?.userId!);
        
        console.log(typeof codeCompletion.choices[0].message.content);
        return res.status(201).json(codeCompletion.choices[0].message);
    } catch (error) {
        console.log("[Code POST ERROR]", error);
        return res.status(500).json({ error: "Something went wrong." });
    }
}