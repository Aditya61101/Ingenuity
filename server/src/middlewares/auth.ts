import { Request, Response, NextFunction } from "express";

export interface CustomRequest extends Request {
    userId?: string;
}

export const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req?.headers['x-user-id'] as string;
    console.log('userId', userId);
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = userId;
    next();
}