import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { createClient } from '@supabase/supabase-js';

// Stripe needs the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!; // set this in your .env

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Webhook hit!")
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const buf = await new Promise<Buffer>((resolve, reject) => {
    let data = Buffer.alloc(0);
    req.on("data", (chunk) => {
      data = Buffer.concat([data, chunk]);
    });
    req.on("end", () => {
      resolve(data);
    });
    req.on("error", reject);
  });

  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Get your metadata (userId and possibly plan)
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    await supabase
    .from('user_profiles')
    .update({ tier: plan }) // Or use the actual plan from session if you set it
    .eq('user_id', userId);

    console.log("✅ Payment complete for user:", userId);
  }

  res.status(200).json({ received: true });
}