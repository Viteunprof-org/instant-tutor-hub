// src/types/stripe.ts
import { Stripe, StripeElements } from "@stripe/stripe-js";

export interface PaymentSheetRequest {
  packId?: number;
  credits?: number;
  discountCode?: string;
}

export interface PaymentSheetResponse {
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
  publishableKey: string;
}

export interface Pack {
  id: number;
  name: string;
  description: string;
  price: number;
  nbrCredits: number;
  backgroundColor: string;
  titleColor: string;
  isPack: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
