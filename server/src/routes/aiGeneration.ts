import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { postConversation } from "../controllers/ai/conversation";
import { postCode } from "../controllers/ai/code";
import { generateImage } from "../controllers/ai/image";
import { generateMusic } from "../controllers/ai/music";
import { generateVideo } from "../controllers/ai/video";

const router = express.Router();

router.post("/conversation", authMiddleware, postConversation);
router.post("/code", authMiddleware, postCode);
router.post("/image", authMiddleware, generateImage);
router.post("/music", authMiddleware, generateMusic);
router.post("/video", authMiddleware, generateVideo);

export default router;