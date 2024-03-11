import { CustomRequest } from "../../middlewares/auth";
import { Response } from "express";
import Replicate from "replicate";
import { checkApiLimit, incrementApiLimit } from "../../libs/apiLimit";
import { checkSubscription } from "../../libs/subscription";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});
export const generateMusic = async (req: CustomRequest, res: Response) => {
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
        const music = await replicate.run(
            "meta/musicgen:b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38", {
            input: {
                prompt: prompt,
                duration: 11,
            }
        });
        if (!isPro) await incrementApiLimit(req?.userId!);

        console.log(music);
        return res.status(201).json(music);
    } catch (error) {
        console.log("[MUSIC POST ERROR]", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
}