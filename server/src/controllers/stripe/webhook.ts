import Stripe from "stripe";
import { Response } from "express";
import { CustomRequest } from "../../middlewares/auth";
import { stripe } from "../../libs/stripe";
import db from "../../config/db";

//INDIAN CARD: 4000003560000008
export const postPaymentWebhook = async (req: CustomRequest, res: Response) => {
    const signature = req.headers['stripe-signature']!;
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        console.log("[STRIPE WEBHOOK ERROR]", error.message);
        return res.status(400).json({ error: `Webhook Error: ${error.message}` });
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            console.log("[STRIPE WEBHOOK LINE33]", session); // metadata shouldn't be empty
            console.log("[STRIPE WEBHOOK LINE34]", subscription);
            if (!session?.metadata?.userId)
                return res.status(400).json({ error: "User id is required" });

            const record = await db.userSubscription.create({
                data: {
                    userId: session?.metadata?.userId,
                    name: session.customer_details?.name,
                    phone: session.customer_details?.phone,
                    stripeSubscriptionId: subscription.id,
                    stripeCustomerId: subscription.customer as string,
                    stripePriceId: subscription.items.data[0].price.id,
                    stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                },
            })
            console.log("[STRIPE WEBHOOK LINE42]", record);
            return res.status(200);
        }
        //unnecessary case, might remove later
        case "invoice.payment_succeeded": {
            const session = event.data.object as Stripe.Invoice;
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            console.log("[STRIPE WEBHOOK LINE49]", session); // metadata should be empty
            console.log("[STRIPE WEBHOOK LINE50]", subscription);
            const subscriber = await db.userSubscription.findFirst({
                where: {
                    stripeSubscriptionId: subscription.id,
                },
            })
            if (subscriber) {
                await db.userSubscription.update({
                    where: {
                        stripeSubscriptionId: subscription.id,
                    },
                    data: {
                        stripePriceId: subscription.items.data[0].price.id,
                        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                    },
                })
            }
            return res.status(200);
        }
        case "customer.updated": {
            const subscribedCustomer = event.data.object as Stripe.Customer;
            console.log("[STRIPE WEBHOOK LINE72]", event);
            console.log("[STRIPE WEBHOOK LINE73]", subscribedCustomer);
            const subscriber = await db.userSubscription.findFirst({
                where: {
                    stripeSubscriptionId: subscribedCustomer.id,
                },
            })
            if(subscriber){
                await db.userSubscription.update({
                    where: {
                        stripeCustomerId: subscribedCustomer.id,
                    },
                    data: {
                        name: subscribedCustomer.name,
                        phone: subscribedCustomer.phone,
                    },
                })
            }
            return res.status(200);
        }
        default: {
            const defaultData = event.data.object as any;
            console.log("[STRIPE WEBHOOK LINE66]", event);
            console.log("[STRIPE WEBHOOK LINE67]", defaultData);
            return res.status(200);
        }
    }
}