import { Response } from "express";
import { getApiLimitCount } from '../../libs/apiLimit';
import { checkSubscription } from '../../libs/subscription';
import { CustomRequest } from '../../middlewares/auth';
export const getUserStatus = async (req: CustomRequest, res: Response) => {
    try {
        const isPro = await checkSubscription(req?.userId!);
        const apiLimitCount = await getApiLimitCount(req?.userId!);
        console.log("[CHECK SUBSCRIPTION ERROR]", { isPro, apiLimitCount });
        return res.status(200).json({ isPro, apiLimitCount });
    } catch (error) {
        console.log("[CHECK SUBSCRIPTION ERROR]", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}