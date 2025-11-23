// src/components/payment/StripePaymentForm.tsx
import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, AlertCircle } from "lucide-react";

interface StripePaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  amount: number;
}

export default function StripePaymentForm({ onSuccess, onError, amount }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment error:", error);
        const message = error.message || "Une erreur est survenue lors du paiement";
        setErrorMessage(message);
        onError(message);
      } else {
        onSuccess();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      const message = "Une erreur inattendue est survenue";
      setErrorMessage(message);
      onError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="shadow-lg border-2 border-gray-200">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message d'erreur */}
          {errorMessage && (
            <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Élément de paiement Stripe */}
          <div className="border-2 border-gray-200 rounded-xl p-5 bg-white hover:border-amber-300 transition-colors">
            <PaymentElement
              options={{
                layout: {
                  type: "tabs",
                  defaultCollapsed: false,
                },
                terms: {
                  card: "never",
                },
                wallets: {
                  applePay: "auto",
                  googlePay: "auto",
                },
              }}
            />
          </div>

          {/* Bouton de paiement */}
          <Button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full h-14 text-lg font-semibold bg-vup-yellow text-white shadow-lg hover:shadow-xl"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Paiement en cours...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-5 w-5" />
                Payer {amount}€
              </>
            )}
          </Button>

          {/* Message de sécurité */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Lock className="h-3 w-3" />
            <span>Paiement 100% sécurisé par Stripe</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
