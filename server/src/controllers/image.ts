import { Response } from "express";
import { CustomRequest } from "../middlewares/auth";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateImage = async (req:CustomRequest, res:Response) => {
    try {
        if(!req.userId){
            console.log("[Image POST ERROR]", "Unauthorized");
            return res.status(401).json({ error: "Unauthorized" });
        }
        if(!openai.apiKey){
            console.log("[Image POST ERROR]", "OpenAI api key not configured!");
            return res.status(500).json({ error: "OpenAI api key not configured!" });
        }
        const { prompt, amount=1, resolution="512x512" } = req.body;
        if(!prompt || !amount || !resolution){
            console.log("[Image POST ERROR]", "Please provide all the fields!");
            return res.status(400).json({ error: "Please provide all the fields!" });
        }

        const numAmount = parseInt(amount, 10);
        if (isNaN(numAmount) || numAmount < 1) {
            return res.status(400).json({ error: "Invalid amount!" });
        }
        const response = await openai.images.generate({
            model: "dall-e-2",
            prompt,
            n: numAmount,
            size: resolution,
        });
        console.log("OpenAI API Response:", response);

        let urls = response.data?.map((item) => item.url);
        if (!urls || urls.length === 0) {
            return res.status(404).json({ error: "No images generated!" });
        }
        console.log('urls', urls);
        return res.status(201).json(urls);
    } catch (error) {
        console.log("[Image POST ERROR]", error);
        return res.status(500).json({ error: "Something went wrong." });
    }
}