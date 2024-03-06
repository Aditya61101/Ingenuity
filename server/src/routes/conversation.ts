import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { postConversation } from "../controllers/conversation";
import { postCode } from "../controllers/code";
import { generateImage } from "../controllers/image";
import { generateMusic } from "../controllers/music";
import { generateVideo } from "../controllers/video";

const router = express.Router();

router.post("/conversation", authMiddleware, postConversation);
router.post("/code", authMiddleware, postCode);
router.post("/image", authMiddleware, generateImage);
router.post("/music", authMiddleware, generateMusic);
router.post("/video", authMiddleware, generateVideo);

export default router;