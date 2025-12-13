import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, X, MessageCircle, Eye, EyeOff } from "lucide-react";
import ProgressBar from "./ProgressBar";

interface TeacherContactPasswordStepProps {
  data: {
    phone: string;
    password: string;
    confirmPassword: string;
  };
  onDataChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isValid: boolean;
  isLoading: boolean;
}

export default function TeacherContactPasswordStep({ data, onDataChange, onSubmit, onBack, isValid, isLoading }: TeacherContactPasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  // Validation du numéro de téléphone (format international)
  const isPhoneValid = data.phone.replace(/\s/g, "").length === 10 && /^0\d{9}$/.test(data.phone.replace(/\s/g, ""));

  // Validation du mot de passe
  const hasMinLength = data.password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(data.password);
  const hasNumberOrSpecial = /[\d\W]/.test(data.password);
  const passwordsMatch = data.password === data.confirmPassword && data.password.length > 0;

  // Formater le numéro de téléphone pendant la saisie
  const handlePhoneChange = (value: string) => {
    // Permettre uniquement les chiffres
    const digitsOnly = value.replace(/\D/g, "");

    // Limiter à 10 chiffres
    const limited = digitsOnly.slice(0, 10);

    // Formater avec des espaces : 06 12 34 56 78
    const formatted = limited.replace(/(\d{2})(?=\d)/g, "$1 ").trim();

    onDataChange("phone", formatted);
  };

  const getFormattedPhone = () => {
    const digitsOnly = data.phone.replace(/\s/g, "");
    if (digitsOnly.startsWith("0")) {
      return "+33" + digitsOnly.slice(1);
    }
    return "+33" + digitsOnly;
  };

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className="flex items-center space-x-2">
      {isValid ? <Check className="h-3.5 w-3.5 text-green-500" /> : <X className="h-3.5 w-3.5 text-gray-300" />}
      <span className={`text-xs ${isValid ? "text-green-600" : "text-gray-500"}`}>{text}</span>
    </div>
  );

  return (
    <Card className="w-full max-w-md h-[90vh] flex flex-col">
      <CardHeader className="flex-shrink-0 pb-2">
        <div className="flex items-center space-x-2 mb-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">viteunprof</span>
        </div>
        <CardTitle className="text-center text-xl">Contact et sécurité</CardTitle>
        <p className="text-center text-sm text-muted-foreground mt-1">Dernière étape avant de finaliser votre inscription</p>
        <ProgressBar currentStep={3} totalSteps={3} />
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-6 px-6">
        {/* Section WhatsApp */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-full">
              <MessageCircle className="h-4 w-4 text-green-600" />
            </div>
            <Label htmlFor="whatsapp" className="text-base font-medium">
              Numéro WhatsApp
            </Label>
          </div>

          <div className="flex">
            <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-sm text-gray-600">+33</div>
            <Input
              id="whatsapp"
              type="tel"
              value={data.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onBlur={() => setPhoneTouched(true)}
              placeholder="06 12 34 56 78"
              className={`rounded-l-none text-base ${
                phoneTouched && !isPhoneValid && data.phone.length > 0
                  ? "border-red-300 focus:border-red-500"
                  : isPhoneValid
                  ? "border-green-300 focus:border-green-500"
                  : ""
              }`}
            />
          </div>

          {phoneTouched && !isPhoneValid && data.phone.length > 0 && <p className="text-xs text-red-500">Format attendu : 06 12 34 56 78</p>}

          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-xs text-green-800">
              <strong>Pourquoi WhatsApp ?</strong> Tu reçois un message dès qu’un élève cherche un cours dans tes matières. Connecte-toi rapidement
              pour prendre le cours et maximiser tes chances.
            </p>
          </div>
        </div>

        {/* Séparateur */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-gray-500">Sécurité du compte</span>
          </div>
        </div>

        {/* Section Mot de passe */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={(e) => onDataChange("password", e.target.value)}
                placeholder="Créez votre mot de passe"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={data.confirmPassword}
                onChange={(e) => onDataChange("confirmPassword", e.target.value)}
                placeholder="Confirmez votre mot de passe"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Indicateurs de validation */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg">
            <ValidationItem isValid={hasMinLength} text="8 caractères min." />
            <ValidationItem isValid={hasUpperCase} text="Une majuscule" />
            <ValidationItem isValid={hasNumberOrSpecial} text="Un chiffre ou symbole" />
            <ValidationItem isValid={passwordsMatch} text="Mots de passe identiques" />
          </div>
        </div>
      </CardContent>

      <div className="flex justify-between p-6 pt-4 border-t flex-shrink-0 bg-white">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button onClick={onSubmit} disabled={!isValid || !isPhoneValid || isLoading} className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Inscription...
            </span>
          ) : (
            "S'inscrire"
          )}
        </Button>
      </div>
    </Card>
  );
}
