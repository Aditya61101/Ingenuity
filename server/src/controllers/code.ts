import { Response } from "express";
import OpenAI from "openai";
import { CustomRequest } from "../middlewares/auth";
// import { checkSubscription } from "@/lib/subscription";
// import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage = {
    role: "system",
    content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
};

export const postCode = async (req:CustomRequest, res:Response) => {
    try {
        //have to do authentication here as the react app is using clerk authentication
        if(!req.userId){
            console.log("[Code POST ERROR]", "Unauthorized");
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { messages } = req.body;
        if(!openai.apiKey){
            console.log("[Code POST ERROR]", "OpenAI api key not configured!");
            return res.status(500).json({ error: "OpenAI api key not configured!" });
        }
        if(!messages){
            console.log("[Code POST ERROR]", "Messages not provided!");
            return res.status(400).json({ error: "Messages not provided!" });
        }

        const codeCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages]
        });
        return res.status(201).json(codeCompletion.choices[0].message);
    } catch (error) {
        console.log("[Code POST ERROR]", error);
        return res.status(500).json({ error: "Something went wrong." });
    }
}