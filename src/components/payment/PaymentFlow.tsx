// src/components/payment/PaymentFlow.tsx
import React, { useState, useCallback } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { usePayment } from "@/hooks/usePayment";
import type { Pack } from "@/types/stripe";

interface PaymentFlowProps {
  onSuccess: () => void;
  onCancel: () => void;
}

enum PaymentStep {
  PACK_SELECTION = "pack_selection",
  PAYMENT_FORM = "payment_form",
  PROCESSING = "processing",
  SUCCESS = "success",
  ERROR = "error",
}

const PaymentFlow: React.FC<PaymentFlowProps> = ({ onSuccess, onCancel }) => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>(PaymentStep.PACK_SELECTION);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");
  const { createPaymentSheet, isLoading, error } = usePayment();

  const handlePackSelection = useCallback(
    async (pack: Pack, discountCode?: string) => {
      const secret = await createPaymentSheet(pack, discountCode);

      if (secret) {
        setSelectedPack(pack);
        setClientSecret(secret);
        setCurrentStep(PaymentStep.PAYMENT_FORM);
      } else {
        setCurrentStep(PaymentStep.ERROR);
      }
    },
    [createPaymentSheet]
  );

  const handlePaymentSuccess = useCallback(() => {
    setCurrentStep(PaymentStep.SUCCESS);
    setTimeout(onSuccess, 2000); // Redirect after showing success
  }, [onSuccess]);

  // Render logic based on currentStep...
  return <div className="payment-flow">{/* Your step-based rendering */}</div>;
};

// Wrapper avec Stripe Elements
const PaymentFlowWithStripe: React.FC<PaymentFlowProps> = (props) => {
  const stripeOptions = {
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#f59e0b",
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <PaymentFlow {...props} />
    </Elements>
  );
};

export default PaymentFlowWithStripe;
