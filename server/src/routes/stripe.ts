import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { getStripe } from '../controllers/stripe/stripe';

const router = express.Router();

router.get("/", authMiddleware, getStripe);

export default router;