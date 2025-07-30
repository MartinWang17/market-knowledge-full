import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil', // or your desired API version
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle event type
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // 1. Get metadata you passed from Checkout Session creation
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (!userId || !plan) {
      console.error('Missing userId or plan in session metadata');
      return res.status(400).json({ error: 'Missing metadata' });
    }

    // 2. Update user in Supabase (server-side, use service role key)
    const { createClient } = await import('@supabase/supabase-js');

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. Update the user's plan in your Supabase user_profiles table
    const { error } = await supabase
      .from('user_profiles')
      .update({ tier: plan })
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase update error:', error);
      return res.status(500).json({ error: 'Supabase update failed' });
    }

    // 4. Respond success
    console.log(`✅ User ${userId} upgraded to ${plan} via Stripe`);
    return res.status(200).json({ received: true });
  }
  res.status(200).json({ received: true });
}