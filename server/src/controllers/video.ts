import { CustomRequest } from "../middlewares/auth";
import { Response } from "express";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});
export const generateVideo = async (req: CustomRequest, res: Response) => {
    try {
        if (!req.userId) {
            console.log("[VIDEO POST ERROR]", "Unauthorized");
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required." });
        }
        const video = await replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
                input: {
                    prompt,
                }
            }
        );
        console.log(video);
        return res.status(201).json(video);
    } catch (error) {
        console.log("[VIDEO POST ERROR]", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
}