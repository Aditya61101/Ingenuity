import { Response } from "express";
import { CustomRequest } from "../../middlewares/auth";
import { stripe } from "../../libs/stripe";
import db from "../../config/db";

const SETTINGS_URL = "http://localhost:5173/dashboard/settings";

export const getStripe = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req?.userId!;
        const userSubscription = await db.userSubscription.findUnique({
            where: {
                userId
            },
        });
        if (userSubscription && userSubscription.stripeCustomerId) {
            // if the user has already subscribed
            console.log("[STRIPE GET], user has already subscribed");
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: SETTINGS_URL,
            });
            return res.status(200).json({ url: stripeSession.url });
        }
        
        console.log("[STRIPE GET], user has not subscribed yet");
        const stripeSession = await stripe.checkout.sessions.create({
            success_url: SETTINGS_URL,
            cancel_url: SETTINGS_URL,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: req.email,
            line_items: [
                {
                    price_data: {
                        currency: "INR",
                        product_data: {
                            name: "Ingenuity Pro",
                            description: "Enjoy Unlimited AI Generations"
                        },
                        unit_amount: 1000,
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId
            }
        })
        return res.status(200).json({ url: stripeSession.url });
    } catch (error) {
        console.log("[STRIPE GET ERROR]", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
}