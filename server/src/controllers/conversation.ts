import OpenAI from "openai";
import { Response } from "express";
import { CustomRequest } from "../middlewares/auth";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export const postConversation = async (req:CustomRequest, res:Response) => {
    try {
        //have to do authentication here as the react app is using clerk authentication
        if(!req.userId){
            console.log("[CONVERSATION POST ERROR]", "Unauthorized");
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { messages } = req.body;
        if(!openai.apiKey){
            console.log("[CONVERSATION POST ERROR]", "OpenAI api key not configured!");
            return res.status(500).json({ error: "OpenAI api key not configured!" });
        }
        if(!messages){
            console.log("[CONVERSATION POST ERROR]", "Messages not provided!");
            return res.status(400).json({ error: "Messages not provided!" });
        }

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
        });
        return res.status(201).json(chatCompletion.choices[0].message);

    } catch (error) {
        console.log("[CONVERSATION POST ERROR]", error);
        return res.status(500).json({ error: "Something went wrong." });
    }
}