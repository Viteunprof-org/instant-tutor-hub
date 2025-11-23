import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, Tag, Sparkles, ArrowRight, AlertCircle, Clock, TrendingUp, Gift } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import apiService from "@/services/api";
import { PaymentSheetRequest, Pack } from "@/types/stripe";
import StripePaymentForm from "@/components/payment/StripePaymentForm";

export default function PaymentPage() {
  const navigate = useNavigate();

  // State pour les packs
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loadingPacks, setLoadingPacks] = useState(true);

  // State pour la sélection
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [showDiscountInput, setShowDiscountInput] = useState(false);

  // State pour les messages du code promo
  const [discountMessage, setDiscountMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // State pour le paiement
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");
  const [newPrice, setNewPrice] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  // Charger les packs au montage
  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await apiService.getPacks();
        if (response.success && response.data) {
          setPacks(response.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des packs:", error);
      } finally {
        setLoadingPacks(false);
      }
    };
    fetchPacks();
  }, []);

  // Trouver le meilleur pack (meilleur prix par crédit)
  const bestValuePack =
    packs.length > 0
      ? packs.reduce((best, current) => {
          const bestPricePerCredit = best.price / best.nbrCredits;
          const currentPricePerCredit = current.price / current.nbrCredits;
          return currentPricePerCredit < bestPricePerCredit ? current : best;
        })
      : null;

  // Gérer la sélection d'un pack (sans créer le payment intent immédiatement)
  const handlePackSelect = (pack: Pack) => {
    setSelectedPack(pack);
    setPaymentStatus("idle");
    setError("");
    setClientSecret(""); // Reset le client secret
    setNewPrice(null);
    setDiscountMessage(null);
  };

  // Créer le payment intent quand l'utilisateur est prêt à payer
  const handlePreparePayment = async () => {
    if (!selectedPack) return;

    setIsLoadingPayment(true);
    setError("");
    setDiscountMessage(null);

    try {
      const paymentData: PaymentSheetRequest = {
        packId: selectedPack.id,
        ...(discountCode && { discountCode }),
      };

      const response = await apiService.createPaymentSheet(paymentData);

      if (response.success && response.data) {
        setClientSecret(response.data.paymentIntent);

        if (discountCode && response.data.discountApplied) {
          setDiscountMessage({
            type: "success",
            text: response.data.discountMessage || `Code promo "${discountCode}" appliqué avec succès !`,
          });
          setNewPrice(response.data.amount || null);
        } else if (discountCode && !response.data.discountApplied) {
          setDiscountMessage({
            type: "error",
            text: response.data.discountMessage || `Code promo "${discountCode}" invalide ou expiré`,
          });
        }
      } else {
        setError(response.error || "Erreur lors de la création du paiement");
      }
    } catch (err) {
      console.error("Erreur paiement:", err);
      setDiscountMessage({
        type: "error",
        text: err.message || "Une erreur est survenue !",
      });
      setError("Erreur lors de la préparation du paiement");
    } finally {
      setIsLoadingPayment(false);
    }
  };

  // Gérer le toggle du code promo
  const handleDiscountToggle = () => {
    setShowDiscountInput(!showDiscountInput);
    setDiscountMessage(null);
    setClientSecret(""); // Reset le payment intent si on change le code
  };

  // Callbacks de succès/erreur
  const handlePaymentSuccess = () => {
    setPaymentStatus("success");
  };

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
    setPaymentStatus("error");
  };

  // Render de succès
  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Header />
        <main className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="max-w-lg w-full">
            <Card className="text-center shadow-2xl border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-500/10"></div>
              <CardContent className="p-12 relative">
                <div className="mb-8 relative">
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                  <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-xl">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Paiement réussi !</h2>
                <p className="text-lg text-gray-600 mb-3">
                  Félicitations ! Vos <span className="font-bold text-[#32f50b]">{selectedPack?.nbrCredits} crédits</span> sont maintenant
                  disponibles.
                </p>
                <p className="text-sm text-gray-500 mb-10">Vous pouvez dès à présent réserver vos cours</p>
                <div className="space-y-4">
                  <Button
                    onClick={() => navigate("/student/request-lesson")}
                    className="w-full h-14 bg-[#32f50b] hover:bg-[#2dd60a] text-gray-900 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Réserver mon premier cours
                  </Button>
                  <Button variant="ghost" onClick={() => navigate("/student/dashboard")} className="w-full h-12 text-gray-600 hover:text-gray-900">
                    Retour au tableau de bord
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Render d'erreur
  if (paymentStatus === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
        <Header />
        <main className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="max-w-lg w-full">
            <Card className="text-center shadow-2xl border-0">
              <CardContent className="p-12">
                <div className="mb-8 relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-full shadow-xl">
                  <XCircle className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Une erreur est survenue</h2>
                <Alert variant="destructive" className="mb-8 text-left border-0 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
                <div className="space-y-4">
                  <Button
                    onClick={() => {
                      setPaymentStatus("idle");
                      setError("");
                      setSelectedPack(null);
                      setClientSecret("");
                    }}
                    className="w-full h-14 bg-[#32f50b] hover:bg-[#2dd60a] text-gray-900 font-semibold text-lg"
                  >
                    Réessayer
                  </Button>
                  <Button variant="ghost" onClick={() => navigate("/student/dashboard")} className="w-full h-12">
                    Retour au tableau de bord
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Interface principale
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choisis ton pack de <span className="text-[#32f50b]">crédits</span>
          </h1>
          <p className="text-xl text-gray-600">Commence immédiatement tes cours de soutien</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Colonne principale : Packs */}
          <div className="lg:col-span-8 space-y-6">
            {/* Grille des packs */}
            {loadingPacks ? (
              <div className="flex justify-center py-20">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-[#32f50b] mx-auto mb-4" />
                  <p className="text-gray-600">Chargement des packs...</p>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {packs.map((pack) => {
                  const isBestValue = bestValuePack?.id === pack.id;
                  const isSelected = selectedPack?.id === pack.id;
                  const pricePerCredit = (pack.price / pack.nbrCredits).toFixed(2);

                  return (
                    <div
                      key={pack.id}
                      className={`group relative cursor-pointer transition-all duration-300 ${isSelected ? "scale-105" : "hover:scale-105"}`}
                      onClick={() => handlePackSelect(pack)}
                    >
                      {/* Badge Meilleur choix */}
                      {isBestValue && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                          <Badge className="bg-gradient-to-r from-[#32f50b] to-[#2dd60a] text-gray-900 font-bold px-4 py-1.5 shadow-lg border-0">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Meilleur choix
                          </Badge>
                        </div>
                      )}

                      <Card
                        className={`relative overflow-hidden h-full transition-all duration-300 ${
                          isSelected
                            ? "border-[#32f50b] border-2 shadow-2xl shadow-[#32f50b]/20"
                            : isBestValue
                            ? "border-[#32f50b]/40 border-2 shadow-lg hover:shadow-2xl hover:shadow-[#32f50b]/20"
                            : "border-gray-200 shadow-md hover:shadow-xl hover:border-gray-300"
                        }`}
                        style={{ backgroundColor: pack.backgroundColor }}
                      >
                        {/* Glow effect sur sélection */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#32f50b]/20 to-transparent pointer-events-none"></div>
                        )}

                        <CardContent className="p-7 relative">
                          {/* Checkmark si sélectionné */}
                          {isSelected && (
                            <div className="absolute top-4 right-4">
                              <div className="w-8 h-8 bg-[#32f50b] rounded-full flex items-center justify-center shadow-lg">
                                <CheckCircle className="h-5 w-5 text-gray-900" />
                              </div>
                            </div>
                          )}

                          <div className="text-center space-y-5">
                            {/* Nom du pack */}
                            <div>
                              <h3 className="font-bold text-2xl mb-2 flex items-center justify-center gap-2" style={{ color: pack.titleColor }}>
                                {pack.name}
                              </h3>
                              <p className="text-sm opacity-80" style={{ color: pack.titleColor }}>
                                {pack.description}
                              </p>
                            </div>

                            {/* Prix principal */}
                            <div className="py-4">
                              <div className="flex items-baseline justify-center gap-1 mb-2">
                                <span className="text-5xl font-extrabold" style={{ color: pack.titleColor }}>
                                  {pack.price}
                                </span>
                                <span className="text-2xl font-bold opacity-80" style={{ color: pack.titleColor }}>
                                  €
                                </span>
                              </div>
                              <div className="text-base font-semibold flex items-center justify-center gap-2" style={{ color: pack.titleColor }}>
                                <Clock className="h-4 w-4" />
                                {pack.nbrCredits} crédit{pack.nbrCredits > 1 ? "s" : ""}
                              </div>
                            </div>

                            {/* Avantages */}
                            <div className="space-y-2.5 pt-4 border-t" style={{ borderColor: `${pack.titleColor}20` }}>
                              <div className="flex items-center justify-between text-sm">
                                <span style={{ color: pack.titleColor }} className="opacity-80">
                                  Prix par crédit
                                </span>
                                <span style={{ color: pack.titleColor }} className="font-bold">
                                  {pricePerCredit}€
                                </span>
                              </div>
                              {pack.isPack && (
                                <div className="flex items-center justify-center gap-2 text-sm font-medium pt-2" style={{ color: pack.titleColor }}>
                                  <Sparkles className="h-4 w-4" />
                                  Pack économique
                                </div>
                              )}
                            </div>

                            {/* Call to action */}
                            <div className="pt-2">
                              {isSelected ? (
                                <div className="flex items-center justify-center text-sm font-bold text-[#32f50b] animate-pulse">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Pack sélectionné
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500 group-hover:text-[#32f50b] transition-colors duration-200">
                                  Cliquer pour sélectionner
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Colonne droite : Paiement intégré */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <Card className="border-0 shadow-2xl bg-white overflow-hidden">
                <div className="bg-gradient-to-r from-[#32f50b] to-[#2dd60a] p-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    Finaliser l'achat
                  </h3>
                </div>

                <CardContent className="p-6 space-y-6">
                  {!selectedPack ? (
                    <div className="text-center py-12">
                      <div className="mb-6">
                        <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                          <ArrowRight className="h-10 w-10 text-gray-400" />
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-gray-700 mb-2">Sélectionne un pack</h4>
                      <p className="text-sm text-gray-500">Choisis le pack adapté à tes besoins</p>
                    </div>
                  ) : (
                    <>
                      {/* Résumé de la commande */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-lg text-gray-900">Récapitulatif</h4>
                        <div className="space-y-3 pb-4 border-b border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-base text-gray-900">{selectedPack.name}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                {selectedPack.nbrCredits} crédit{selectedPack.nbrCredits > 1 ? "s" : ""}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">{newPrice ? newPrice.toFixed(2) : selectedPack.price}€</div>
                              {newPrice && newPrice < selectedPack.price && (
                                <div className="text-sm text-gray-500 line-through">{selectedPack.price}€</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Section code promo */}
                        <div className="space-y-3">
                          <button
                            onClick={handleDiscountToggle}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 border border-gray-200"
                          >
                            <span className="flex items-center gap-2">
                              <Gift className="h-4 w-4 text-[#32f50b]" />
                              Code promo
                            </span>
                            <span className="text-xs text-gray-500">{showDiscountInput ? "Masquer" : "Afficher"}</span>
                          </button>

                          {showDiscountInput && (
                            <div className="space-y-3 p-4 bg-[#32f50b]/5 rounded-xl border border-[#32f50b]/20">
                              <Input
                                placeholder="Ton code promo"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                                className="h-11 border-[#32f50b]/30 focus-visible:ring-[#32f50b] bg-white"
                              />
                              {discountMessage && (
                                <div
                                  className={`text-xs flex items-center font-medium ${
                                    discountMessage.type === "success" ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {discountMessage.type === "success" ? (
                                    <CheckCircle className="h-3 w-3 mr-1.5" />
                                  ) : (
                                    <AlertCircle className="h-3 w-3 mr-1.5" />
                                  )}
                                  {discountMessage.text}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Avantages */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-xl border border-green-100">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>Crédits disponibles immédiatement</span>
                        </div>
                      </div>

                      {/* Formulaire de paiement */}
                      <div className="pt-4 border-t border-gray-200">
                        {!clientSecret ? (
                          <Button
                            onClick={handlePreparePayment}
                            disabled={isLoadingPayment}
                            className="w-full h-14 bg-gradient-to-r from-[#32f50b] to-[#2dd60a] hover:from-[#2dd60a] hover:to-[#32f50b] text-gray-900 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                          >
                            {isLoadingPayment ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Préparation...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-5 w-5" />
                                Payer maintenant
                              </>
                            )}
                          </Button>
                        ) : (
                          <Elements
                            stripe={stripePromise}
                            options={{
                              clientSecret,
                              appearance: {
                                theme: "stripe" as const,
                                variables: {
                                  colorPrimary: "#32f50b",
                                  colorBackground: "#ffffff",
                                  colorText: "#1f2937",
                                  colorDanger: "#ef4444",
                                  fontFamily: "system-ui, sans-serif",
                                  spacingUnit: "4px",
                                  borderRadius: "12px",
                                },
                              },
                            }}
                          >
                            <StripePaymentForm
                              onSuccess={handlePaymentSuccess}
                              onError={handlePaymentError}
                              amount={newPrice ? newPrice : selectedPack.price}
                            />
                          </Elements>
                        )}

                        {error && (
                          <Alert variant="destructive" className="mt-4 border-0 bg-red-50">
                            <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {/* Sécurité */}
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Paiement 100% sécurisé par Stripe
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(50, 245, 11, 0.3); }
          50% { box-shadow: 0 0 30px rgba(50, 245, 11, 0.5); }
        }
      `}</style>
    </div>
  );
}
