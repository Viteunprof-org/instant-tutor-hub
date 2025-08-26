// src/lib/stripe.ts
import { loadStripe } from "@stripe/stripe-js";

// Assurez-vous d'avoir cette variable dans votre .env
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error("VITE_STRIPE_PUBLISHABLE_KEY is not defined in environment variables");
}

// Créer l'instance Stripe (singleton)
export const stripePromise = loadStripe(stripePublishableKey);
