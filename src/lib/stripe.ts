import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY is not configured in environment variables.');
}

export const stripe = new Stripe(stripeSecretKey || '', {
  // @ts-ignore
  apiVersion: '2024-12-18.acacia', // Use a stable version
});
