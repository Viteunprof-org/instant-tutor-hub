// src/components/payment/PackSelection.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import apiService from "@/services/api";

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

interface PackSelectionProps {
  onPackSelect: (pack: Pack, discountCode?: string) => void;
  isLoading?: boolean;
  preSelectedPackId?: string | null;
}

export default function PackSelection({ onPackSelect, isLoading, preSelectedPackId }: PackSelectionProps) {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [loadingPacks, setLoadingPacks] = useState(true);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await apiService.getPacks();
        if (response.success && response.data) {
          setPacks(response.data);

          // Si un pack est pré-sélectionné
          if (preSelectedPackId) {
            const preSelected = response.data.find((pack: Pack) => pack.id === parseInt(preSelectedPackId));
            if (preSelected) {
              setSelectedPack(preSelected);
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des packs:", error);
      } finally {
        setLoadingPacks(false);
      }
    };

    fetchPacks();
  }, [preSelectedPackId]);

  const handlePackSelect = (pack: Pack) => {
    setSelectedPack(pack);
  };

  const handlePayment = () => {
    console.log("handlePayment: before if ");

    if (selectedPack) {
      console.log("handlePayment");
      onPackSelect(selectedPack, discountCode || undefined);
    }
  };

  if (loadingPacks) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packs.map((pack) => (
          <Card
            key={pack.id}
            className={`cursor-pointer transition-all ${selectedPack?.id === pack.id ? "ring-2 ring-vup-yellow shadow-lg" : "hover:shadow-md"}`}
            onClick={() => handlePackSelect(pack)}
            style={{ backgroundColor: pack.backgroundColor }}
          >
            <CardContent className="p-6 text-center">
              <h3 className="font-bold text-xl mb-2" style={{ color: pack.titleColor }}>
                {pack.name}
                {pack.isPack && <Badge className="ml-2">Pack</Badge>}
              </h3>
              <p className="text-sm mb-4" style={{ color: pack.titleColor }}>
                {pack.description}
              </p>
              <div className="space-y-2">
                <div>
                  <span className="text-3xl font-bold" style={{ color: pack.titleColor }}>
                    {pack.price}€
                  </span>
                </div>
                <div>
                  <p className="text-sm" style={{ color: pack.titleColor }}>
                    {pack.nbrCredits} crédit{pack.nbrCredits > 1 ? "s" : ""}
                  </p>
                  {pack.isPack && (
                    <p className="text-xs opacity-75" style={{ color: pack.titleColor }}>
                      {(pack.price / pack.nbrCredits).toFixed(2)}€ / crédit
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPack && (
        <Card>
          <CardHeader>
            <CardTitle>Finaliser l'achat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold">Pack sélectionné: {selectedPack.name}</h3>
              <p className="text-sm text-gray-600">
                {selectedPack.nbrCredits} crédit{selectedPack.nbrCredits > 1 ? "s" : ""} - {selectedPack.price}€
              </p>
            </div>

            <div>
              <label htmlFor="discount" className="block text-sm font-medium mb-2">
                Code de réduction (optionnel)
              </label>
              <Input
                id="discount"
                placeholder="Entrez votre code promo"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button onClick={handlePayment} disabled={isLoading} className="w-full" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                `Continuer vers le paiement - ${selectedPack.price}€`
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
