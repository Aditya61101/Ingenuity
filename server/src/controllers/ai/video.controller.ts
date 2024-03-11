import { Response } from "express";
import { CustomRequest } from "../../middlewares/auth";
import Replicate from "replicate";
import { checkApiLimit, incrementApiLimit } from "../../libs/apiLimit";
import { checkSubscription } from "../../libs/subscription";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});
export const generateVideo = async (req: CustomRequest, res: Response) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required." });
        }

        const isValidTrail = await checkApiLimit(req?.userId!);
        const isPro = await checkSubscription(req?.userId!);
        if (!isValidTrail && !isPro) {
            return res.status(403).json({ error: "Free trail has expired. Please upgrade to pro!" });
        }

        const video = await replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
                input: {
                    prompt,
                }
            }
        );

        if(!isPro) await incrementApiLimit(req?.userId!);

        console.log(video);
        return res.status(201).json(video);
    } catch (error) {
        console.log("[VIDEO POST ERROR]", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
}