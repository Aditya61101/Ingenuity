import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { postConversation } from "../controllers/conversation";
import { postCode } from "../controllers/code";
import { generateImage } from "../controllers/image";

const router = express.Router();

router.post("/conversation", authMiddleware, postConversation);
router.post("/code", authMiddleware, postCode);
router.post("/image", authMiddleware, generateImage);

export default router;