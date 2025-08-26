// src/components/payment/StripePayment.tsx
import { useState } from "react";
import { useStripe, useElements, PaymentElement, Elements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";
import { stripePromise } from "@/lib/stripe";

interface CheckoutFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  amount: number;
  packName: string;
  credits: number;
}

function CheckoutForm({ clientSecret, onSuccess, onError, amount, packName, credits }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
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
        setErrorMessage(error.message || "Une erreur est survenue lors du paiement");
        onError(error.message || "Erreur de paiement");
      } else {
        console.log("Payment successful!");
        onSuccess();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("Une erreur inattendue est survenue");
      onError("Erreur inattendue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Informations de paiement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Résumé de la commande */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-2">Résumé de votre achat</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Pack:</span>
                <span className="font-medium">{packName}</span>
              </div>
              <div className="flex justify-between">
                <span>Crédits:</span>
                <span className="font-medium">{credits}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span>{amount}€</span>
              </div>
            </div>
          </div>

          {/* Élément de paiement Stripe */}
          <div className="border rounded-lg p-4">
            <PaymentElement
              options={{
                layout: {
                  type: "tabs",
                  defaultCollapsed: false,
                },
              }}
            />
          </div>

          <Button type="submit" disabled={!stripe || isLoading} className="w-full bg-vup-navy hover:bg-vup-navy/90" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              `Payer ${amount}€`
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">Vos informations de paiement sont sécurisées par Stripe</p>
        </form>
      </CardContent>
    </Card>
  );
}

interface StripePaymentProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  amount: number;
  packName: string;
  credits: number;
}

export default function StripePayment({ clientSecret, onSuccess, onError, amount, packName, credits }: StripePaymentProps) {
  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#f59e0b", // vup-yellow
      colorBackground: "#ffffff",
      colorText: "#1f2937",
      colorDanger: "#ef4444",
      fontFamily: "system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "8px",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm clientSecret={clientSecret} onSuccess={onSuccess} onError={onError} amount={amount} packName={packName} credits={credits} />
    </Elements>
  );
}
