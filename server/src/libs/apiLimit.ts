import db from "../config/db";

const MAX_FREE_COUNTS = 5;

export const incrementApiLimit = async (userId: string) => {
    if (!userId) return;

    const userApiLimit = await db.userApiLimit.findUnique({
        where: { userId: userId },
    });

    if (userApiLimit) {
        await db.userApiLimit.update({
            where: { userId: userId },
            data: { count: userApiLimit.count + 1 },
        });
    } else {
        await db.userApiLimit.create({
            data: { userId: userId, count: 1 },
        });
    }
};

export const checkApiLimit = async (userId: string) => {
    if (!userId) return false;

    const userApiLimit = await db.userApiLimit.findUnique({
        where: { userId: userId },
    });

    if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
        return true;
    } else {
        return false;
    }
};

export const getApiLimitCount = async (userId: string) => {
    if (!userId) return 0;

    const userApiLimit = await db.userApiLimit.findUnique({
        where: {
            userId
        }
    });

    if (!userApiLimit) return 0;

    return userApiLimit.count;
};