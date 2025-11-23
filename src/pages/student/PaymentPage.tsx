import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, Tag, Sparkles, ArrowRight, AlertCircle } from "lucide-react";
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

  // Gérer la sélection d'un pack et créer le payment intent
  const handlePackSelect = async (pack: Pack) => {
    setSelectedPack(pack);
    setPaymentStatus("idle");
    setError("");
    setIsLoadingPayment(true);
    setDiscountMessage(null);

    try {
      const paymentData: PaymentSheetRequest = {
        packId: pack.id,
        ...(discountCode && { discountCode }),
      };

      console.log("Creating payment sheet with data:", paymentData);

      const response = await apiService.createPaymentSheet(paymentData);
      console.log("createPaymentSheet response:", response);

      if (response.success && response.data) {
        setClientSecret(response.data.paymentIntent);

        // Gérer les messages de réponse du code promo
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
    if (!selectedPack) {
      setDiscountMessage({
        type: "error",
        text: "Veuillez d'abord sélectionner un pack",
      });
      return;
    }
    setShowDiscountInput(!showDiscountInput);
    setDiscountMessage(null);
  };

  // Appliquer le code promo (re-créer le payment intent avec le code)
  const handleApplyDiscount = () => {
    if (selectedPack && discountCode) {
      handlePackSelect(selectedPack);
    }
  };

  // Callbacks de succès/erreur
  const handlePaymentSuccess = () => {
    setPaymentStatus("success");
  };

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
    setPaymentStatus("error");
  };

  // Render des états de succès/erreur
  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="text-center shadow-xl border-green-200">
              <CardContent className="p-12">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-green-100 rounded-full blur-3xl opacity-50"></div>
                  <CheckCircle className="mx-auto h-20 w-20 text-green-500 relative animate-bounce" />
                </div>
                <h2 className="text-3xl font-bold text-green-700 mb-3">Paiement réussi !</h2>
                <p className="text-gray-600 mb-8">
                  Vos <strong>{selectedPack?.nbrCredits} crédits</strong> ont été ajoutés à votre compte.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate("/student/request-lesson")}
                    className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white"
                    size="lg"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Réserver un cours maintenant
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/student/dashboard")} className="w-full">
                    Retour au dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (paymentStatus === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="text-center shadow-xl border-red-200">
              <CardContent className="p-12">
                <XCircle className="mx-auto h-20 w-20 text-red-500 mb-6" />
                <h2 className="text-3xl font-bold text-red-700 mb-3">Erreur de paiement</h2>
                <Alert variant="destructive" className="mb-8 text-left">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setPaymentStatus("idle");
                      setError("");
                      setSelectedPack(null);
                      setClientSecret("");
                    }}
                    className="w-full"
                    size="lg"
                  >
                    Réessayer
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/student/dashboard")} className="w-full">
                    Retour au dashboard
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
    <div className="min-h-screen bg-gray-50 from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Recharges tes <span className="text-vup-yellow">crédits</span>
            </h1>
            <p className="text-lg text-gray-600">Choisis ton pack et commences immédiatement</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Colonne gauche : Sélection des packs */}
            <div className="lg:col-span-2 space-y-6">
              {/* Code promo toggle */}
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={handleDiscountToggle} className="text-sm text-gray-600 hover:text-amber-600">
                  <Tag className="mr-2 h-4 w-4" />
                  {showDiscountInput ? "Masquer" : "Code promo ?"}
                </Button>
              </div>

              {/* Message d'erreur si pas de pack sélectionné */}
              {discountMessage && discountMessage.type === "error" && !selectedPack && (
                <Alert variant="destructive" className="border-amber-300 bg-amber-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-amber-800">{discountMessage.text}</AlertDescription>
                </Alert>
              )}

              {/* Input code promo */}
              {showDiscountInput && selectedPack && (
                <Card className="border-dashed border-2 border-amber-300 bg-amber-50/50">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Entrez votre code promo"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="flex-1 border-amber-300 focus:ring-amber-400"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && discountCode) {
                            handleApplyDiscount();
                          }
                        }}
                      />
                      {discountCode && (
                        <>
                          <Button onClick={handleApplyDiscount} className="shrink-0 bg-amber-500 hover:bg-amber-600" disabled={isLoadingPayment}>
                            {isLoadingPayment ? <Loader2 className="h-4 w-4 animate-spin" /> : "Appliquer"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDiscountCode("");
                              setDiscountMessage(null);
                              if (selectedPack) handlePackSelect(selectedPack);
                            }}
                            className="shrink-0"
                          >
                            Effacer
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Messages de succès ou d'erreur du code promo */}
                    {discountMessage && (
                      <div className={`text-xs mt-2 flex items-center ${discountMessage.type === "success" ? "text-green-700" : "text-red-700"}`}>
                        {discountMessage.type === "success" ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                        {discountMessage.text}
                      </div>
                    )}

                    {!discountMessage && discountCode && (
                      <p className="text-xs text-amber-700 mt-2 flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Cliques sur "Appliquer" pour valider le code "{discountCode}"
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Grille des packs */}
              {loadingPacks ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {packs.map((pack) => (
                    <Card
                      key={pack.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${
                        selectedPack?.id === pack.id ? "ring-4 ring-amber-400 shadow-2xl scale-105" : "hover:shadow-lg"
                      }`}
                      onClick={() => handlePackSelect(pack)}
                      style={{
                        backgroundColor: pack.backgroundColor,
                        borderColor: selectedPack?.id === pack.id ? "#fbbf24" : "transparent",
                      }}
                    >
                      <CardContent className="p-6 relative">
                        {selectedPack?.id === pack.id && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle className="h-6 w-6 text-amber-500 fill-amber-100" />
                          </div>
                        )}

                        <div className="text-center space-y-3">
                          <div>
                            <h3 className="font-bold text-2xl mb-1 flex items-center justify-center gap-2" style={{ color: pack.titleColor }}>
                              {pack.name}
                              {pack.isPack && <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">PACK</Badge>}
                            </h3>
                            <p className="text-sm opacity-90" style={{ color: pack.titleColor }}>
                              {pack.description}
                            </p>
                          </div>

                          <div className="py-3">
                            <div className="text-4xl font-extrabold mb-1" style={{ color: pack.titleColor }}>
                              {pack.price}€
                            </div>
                            <div className="text-sm font-medium" style={{ color: pack.titleColor }}>
                              {pack.nbrCredits} crédit{pack.nbrCredits > 1 ? "s" : ""}
                            </div>
                            {pack.isPack && (
                              <div className="text-xs opacity-75 mt-1" style={{ color: pack.titleColor }}>
                                Soit {(pack.price / pack.nbrCredits).toFixed(2)}€ / crédit
                              </div>
                            )}
                          </div>

                          {selectedPack?.id === pack.id ? (
                            <div className="flex items-center justify-center text-sm font-medium text-amber-600 animate-pulse">
                              <ArrowRight className="h-4 w-4 mr-1" />
                              Sélectionné
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">Cliques pour sélectionner</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Colonne droite : Résumé et paiement */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                {!selectedPack ? (
                  <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                    <CardContent className="p-8 text-center">
                      <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Sélectionnes un pack</h3>
                      <p className="text-sm text-gray-500">Choisissez le pack qui vous convient pour continuer</p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Résumé de la commande */}
                    <Card className="bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 shadow-lg">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center text-gray-800">
                          <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
                          Ta commande
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-3 border-b border-amber-200">
                            <div>
                              <div className="font-semibold text-gray-900">{selectedPack.name}</div>
                              <div className="text-sm text-gray-600">
                                {selectedPack.nbrCredits} crédit{selectedPack.nbrCredits > 1 ? "s" : ""}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">{newPrice ? newPrice : selectedPack.price}€</div>
                            </div>
                          </div>
                          {discountMessage && discountMessage.type === "success" && (
                            <div className="text-sm text-green-600 font-medium flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {discountMessage.text}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Formulaire de paiement Stripe */}
                    {isLoadingPayment ? (
                      <Card>
                        <CardContent className="p-12 text-center">
                          <Loader2 className="mx-auto h-12 w-12 animate-spin text-amber-500 mb-4" />
                          <p className="text-sm text-gray-600">Préparation du paiement...</p>
                        </CardContent>
                      </Card>
                    ) : clientSecret ? (
                      <Elements
                        stripe={stripePromise}
                        options={{
                          clientSecret,
                          appearance: {
                            theme: "stripe" as const,
                            variables: {
                              colorPrimary: "#32f50bff",
                              colorBackground: "#ffffff",
                              colorText: "#1f2937",
                              colorDanger: "#ef4444",
                              fontFamily: "system-ui, sans-serif",
                              spacingUnit: "4px",
                              borderRadius: "8px",
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
                    ) : error ? (
                      <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-6">
                          <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                          <Button onClick={() => handlePackSelect(selectedPack)} className="w-full mt-4" variant="outline">
                            Réessayer
                          </Button>
                        </CardContent>
                      </Card>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
