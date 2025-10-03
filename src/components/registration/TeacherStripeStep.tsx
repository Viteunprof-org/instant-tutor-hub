import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import ProgressBar from "./ProgressBar";

interface TeacherStripeStepProps {
  data: {
    iban: string;
    adress: string;
    postalCode: string;
    city: string;
    birthDate: string;
  };
  onDataChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export default function TeacherStripeStep({ data, onDataChange, onNext, onBack, isValid }: TeacherStripeStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateIban = (iban: string) => {
    // Supprimer les espaces et convertir en majuscules
    const cleanIban = iban.replace(/\s/g, "").toUpperCase();

    // Vérifier le format français (27 caractères)
    const frenchIbanRegex = /^FR[0-9]{2}[0-9A-Z]{23}$/;
    return frenchIbanRegex.test(cleanIban);
  };

  const validatePostalCode = (postalCode: string) => {
    // Format français : 5 chiffres
    const postalCodeRegex = /^[0-9]{5}$/;
    return postalCodeRegex.test(postalCode);
  };

  const formatIban = (value: string) => {
    // Supprimer tout sauf les lettres et chiffres
    const clean = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

    // Ajouter des espaces tous les 4 caractères
    // return clean.replace(/(.{4})/g, "$1 ").trim();
    return clean;
  };

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value;
    const newErrors = { ...errors };

    // Traitement spécifique pour l'IBAN
    if (field === "iban") {
      processedValue = formatIban(value);

      if (processedValue && !validateIban(processedValue)) {
        newErrors.iban = "Format IBAN invalide (ex: FR76 1234 5678 9012 3456 7890 123)";
      } else {
        delete newErrors.iban;
      }
    }

    // Validation du code postal
    if (field === "postalCode") {
      if (processedValue && !validatePostalCode(processedValue)) {
        newErrors.postalCode = "Code postal invalide (5 chiffres)";
      } else {
        delete newErrors.postalCode;
      }
    }

    // Validation des champs requis
    if (
      !processedValue
      // && field !== "birthDate"
    ) {
      newErrors[field] = "Ce champ est requis";
    } else if (processedValue && field !== "iban" && field !== "postalCode") {
      delete newErrors[field];
    }

    setErrors(newErrors);
    onDataChange(field, processedValue);
  };

  return (
    <Card className="w-full max-w-md h-[90vh] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center space-x-2 mb-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">viteunprof</span>
        </div>
        <CardTitle className="text-center text-xl">Informations bancaires</CardTitle>
        <ProgressBar currentStep={3} totalSteps={4} />
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-6 px-6">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Ces informations sont nécessaires pour recevoir vos paiements de manière sécurisée.</p>

          {/* IBAN */}
          <div className="space-y-2">
            <Label htmlFor="iban" className="text-sm font-medium">
              IBAN <span className="text-red-500">*</span>
            </Label>
            <Input
              id="iban"
              type="text"
              placeholder="FR76 1234 5678 9012 3456 7890 123"
              value={data.iban}
              onChange={(e) => handleInputChange("iban", e.target.value)}
              className={errors.iban ? "border-red-500" : ""}
              maxLength={34} // IBAN maximum length with spaces
            />
            {errors.iban && <p className="text-xs text-red-500">{errors.iban}</p>}
          </div>

          {/* Adresse */}
          <div className="space-y-2">
            <Label htmlFor="adress" className="text-sm font-medium">
              Adresse <span className="text-red-500">*</span>
            </Label>
            <Input
              id="adress"
              type="text"
              placeholder="123 rue de la République"
              value={data.adress}
              onChange={(e) => handleInputChange("adress", e.target.value)}
              className={errors.adress ? "border-red-500" : ""}
            />
            {errors.adress && <p className="text-xs text-red-500">{errors.adress}</p>}
          </div>

          {/* Code postal et Ville */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode" className="text-sm font-medium">
                Code postal <span className="text-red-500">*</span>
              </Label>
              <Input
                id="postalCode"
                type="text"
                placeholder="75001"
                value={data.postalCode}
                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                className={errors.postalCode ? "border-red-500" : ""}
                maxLength={5}
              />
              {errors.postalCode && <p className="text-xs text-red-500">{errors.postalCode}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                Ville <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="Paris"
                value={data.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
            </div>
          </div>

          {/* Date de naissance */}
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-sm font-medium">
              Date de naissance <span className="text-red-500">*</span>
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={data.birthDate || ""}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              max={new Date().toISOString().split("T")[0]} // Pas de date future
            />
            <p className="text-xs text-muted-foreground">Requis par notre prestataire de paiement</p>
          </div>

          {/* Information de sécurité */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                <span className="text-xs text-white font-bold">i</span>
              </div>
              <div>
                <p className="text-xs text-blue-800 font-medium">Sécurité des données</p>
                <p className="text-xs text-blue-700 mt-1">
                  Vos informations bancaires sont chiffrées et sécurisées. Elles ne sont utilisées que pour les virements de vos gains.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <div className="flex justify-between p-6 pt-4 border-t flex-shrink-0">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button onClick={onNext} disabled={!isValid}>
          Suivant
        </Button>
      </div>
    </Card>
  );
}
