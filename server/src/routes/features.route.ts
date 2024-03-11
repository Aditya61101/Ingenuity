import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { generateConversation } from "../controllers/ai/conversation.controller";
import { generateCode } from "../controllers/ai/code.controller";
import { generateImage } from "../controllers/ai/image.controller";
import { generateMusic } from "../controllers/ai/music.controller";
import { generateVideo } from "../controllers/ai/video.controller";
import { getUserStatus } from "../controllers/ai/userStatus.controller";

const router = express.Router();

router.get("/user-status", authMiddleware, getUserStatus);
router.post("/conversation", authMiddleware, generateConversation);
router.post("/code", authMiddleware, generateCode);
router.post("/image", authMiddleware, generateImage);
router.post("/music", authMiddleware, generateMusic);
router.post("/video", authMiddleware, generateVideo);

export default router;