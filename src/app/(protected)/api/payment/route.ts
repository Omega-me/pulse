import { stripe } from '@/lib/stripe.lib';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ status: 404 });

  const priceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID as string;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${
      process.env.NEXT_PUBLIC_HOST_URL as string
    }/payment?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${
      process.env.NEXT_PUBLIC_HOST_URL as string
    }/payment?cancel=true`,
  });

  if (session) {
    return NextResponse.json({
      status: 200,
      session_url: session.url,
    });
  }

  return NextResponse.json({
    status: 404,
  });
}
