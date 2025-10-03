import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/ui/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import PackSelection from "@/components/payment/PackSelection";
import StripePayment from "@/components/payment/StripePayment";
import apiService from "@/services/api";
import { PaymentSheetRequest } from "@/types/stripe";

enum PaymentStep {
  PACK_SELECTION = "pack_selection",
  PAYMENT = "payment",
  SUCCESS = "success",
  ERROR = "error",
}

interface Pack {
  id: number;
  name: string;
  description: string;
  price: number;
  nbrCredits: number;
  backgroundColor: string;
  titleColor: string;
  isPack: boolean;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { packId } = useParams();
  const [currentStep, setCurrentStep] = useState<PaymentStep>(PaymentStep.PACK_SELECTION);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [discountCode, setDiscountCode] = useState<string>();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handlePackSelect = async (pack: Pack, discount?: string) => {
    console.log(pack);
    console.log("TEST");
    setSelectedPack(pack);
    setDiscountCode(discount);
    setIsLoading(true);
    setError("");

    try {
      const paymentData: PaymentSheetRequest = {
        packId: pack.id,
        ...(discount && { discountCode: discount }),
      };

      const response = await apiService.createPaymentSheet(paymentData);
      console.log(response);
      if (response.success && response.data) {
        setClientSecret(response.data.paymentIntent);
        setCurrentStep(PaymentStep.PAYMENT);
      } else {
        setError(response.error || "Erreur lors de la création du paiement");
        setCurrentStep(PaymentStep.ERROR);
      }
    } catch (err) {
      console.error("Erreur paiement:", err);
      setError("Erreur lors de la préparation du paiement");
      setCurrentStep(PaymentStep.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setCurrentStep(PaymentStep.SUCCESS);
  };

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
    setCurrentStep(PaymentStep.ERROR);
  };

  const handleBackToSelection = () => {
    setCurrentStep(PaymentStep.PACK_SELECTION);
    setSelectedPack(null);
    setDiscountCode(undefined);
    setClientSecret("");
    setError("");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case PaymentStep.PACK_SELECTION:
        return <PackSelection onPackSelect={handlePackSelect} isLoading={isLoading} />;

      case PaymentStep.PAYMENT:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Finaliser le paiement</h2>
              <Button variant="outline" onClick={handleBackToSelection} className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              {/* <Button variant="outline" onClick={() => console.log(selectedPack, clientSecret)} className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Show pack
              </Button> */}
            </div>

            {selectedPack && (
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{selectedPack.name}</h3>
                      <p className="text-sm text-gray-600">
                        {selectedPack.nbrCredits} crédit{selectedPack.nbrCredits > 1 ? "s" : ""}
                      </p>
                      {discountCode && <p className="text-sm text-green-600">Code promo appliqué: {discountCode}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{selectedPack.price}€</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {clientSecret && selectedPack && (
              <StripePayment
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                amount={selectedPack.price}
                packName={selectedPack.name}
                credits={selectedPack.nbrCredits}
              />
            )}
          </div>
        );

      case PaymentStep.SUCCESS:
        return (
          <Card className="text-center">
            <CardContent className="p-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">Paiement réussi !</h2>
              <p className="text-gray-600 mb-6">Vos crédits ont été ajoutés à votre compte. Vous pouvez maintenant réserver vos cours !</p>
              <div className="space-y-3">
                <Button onClick={() => navigate("/student/dashboard")} className="w-full">
                  Retourner au dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate("/student/request-lesson")} className="w-full">
                  Prendre un cours maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case PaymentStep.ERROR:
        return (
          <Card className="text-center">
            <CardContent className="p-8">
              <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-red-700 mb-2">Erreur de paiement</h2>
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="space-y-3">
                <Button onClick={handleBackToSelection} className="w-full">
                  Réessayer
                </Button>
                <Button variant="outline" onClick={() => navigate("/student/dashboard")} className="w-full">
                  Retourner au dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Acheter des crédits</h1>
            <p className="text-gray-600">Rechargez votre compte pour prendre des cours avec nos professeurs</p>
          </div>

          {renderStepContent()}
        </div>
      </main>
    </div>
  );
}
