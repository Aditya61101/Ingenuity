import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

declare global {
    var prisma: PrismaClient | undefined
}

const db = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

export default db;