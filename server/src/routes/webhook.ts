import express from 'express';
import { postPaymentWebhook } from "../controllers/stripe/webhook";

const router = express.Router();

router.post("/webhook", express.raw({type: 'application/json'}), postPaymentWebhook);

export default router;