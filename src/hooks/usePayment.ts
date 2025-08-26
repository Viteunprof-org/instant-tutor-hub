// src/hooks/usePayment.ts
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import apiService from "@/services/api";
import type { Pack, PaymentSheetRequest } from "@/types/stripe";

export const usePayment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentSheet = async (pack: Pack, discountCode?: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const paymentData: PaymentSheetRequest = {
        packId: pack.id,
        ...(discountCode && { discountCode }),
      };

      const response = await apiService.createPaymentSheet(paymentData);

      if (response.success && response.data) {
        return response.data.clientSecret;
      } else {
        setError(response.error || "Erreur lors de la création du paiement");
        return null;
      }
    } catch (err) {
      setError("Erreur lors de la préparation du paiement");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmPayment = async (clientSecret: string): Promise<boolean> => {
    if (!stripe || !elements) {
      setError("Stripe non initialisé");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: "if_required",
      });

      if (stripeError) {
        setError(stripeError.message || "Erreur de paiement");
        return false;
      }

      return true;
    } catch (err) {
      setError("Une erreur inattendue est survenue");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPaymentSheet,
    confirmPayment,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
