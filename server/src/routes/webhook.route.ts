import express from 'express';
import { postPaymentWebhook } from "../controllers/stripe/webhook.controller";

const router = express.Router();

router.post("/webhook", express.raw({type: 'application/json'}), postPaymentWebhook);

export default router;