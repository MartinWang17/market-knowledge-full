import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  const { priceId, userId, plan } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.DEPLOYED_NEXT_PUBLIC_BASE_URL}/pricing?success=1&user_id=${userId}`,
      cancel_url: `${process.env.DEPLOYED_NEXT_PUBLIC_BASE_URL}/pricing?canceled=1`,
      metadata: { userId, plan },
    });
    res.status(200).json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}