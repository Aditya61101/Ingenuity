import { Request, Response, NextFunction } from "express";

export interface CustomRequest extends Request {
    userId?: string;
    email?: string;
}

export const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req?.headers['x-user-id'] as string;
    const email = req?.headers['x-user-email'] as string;
    console.log({ userId, email });

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    req.userId = userId;
    req.email = email;
    next();
}