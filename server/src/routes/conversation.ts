import express from "express";
import { postConversation } from "../controllers/conversation";
import { authMiddleware } from "../middlewares/auth";
import { postCode } from "../controllers/code";

const router = express.Router();

router.post("/conversation", authMiddleware, postConversation);
router.post("/code", authMiddleware, postCode);
export default router;