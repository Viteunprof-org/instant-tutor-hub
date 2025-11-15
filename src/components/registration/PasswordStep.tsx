import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import ProgressBar from "./ProgressBar";

interface PasswordStepProps {
  userType: "student" | "parent";
  data: {
    password: string;
    confirmPassword: string;
  };
  onDataChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isValid: boolean;
  isLoading: boolean;
}

export default function PasswordStep({ userType, data, onDataChange, onSubmit, onBack, isValid, isLoading }: PasswordStepProps) {
  const hasMinLength = data.password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(data.password);
  const hasNumberOrSpecial = /[\d\W]/.test(data.password);
  const passwordsMatch = data.password === data.confirmPassword && data.confirmPassword.length > 0;

  const title = "Mot de passe";
  const subtitle = "Choisissez un mot de passe sécurisé";

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-1">
            <img src="/logo.svg" className="w-48" />
          </div>
          <div className="w-8"></div>
        </div>
        <ProgressBar currentStep={3} totalSteps={3} />
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            placeholder="Mot de passe"
            value={data.password}
            onChange={(e) => onDataChange("password", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirmez votre mot de passe"
            value={data.confirmPassword}
            onChange={(e) => onDataChange("confirmPassword", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasMinLength ? "bg-green-500" : "bg-muted"}`}>
              {hasMinLength && <Check className="w-2 h-2 text-white" />}
            </div>
            <span className={hasMinLength ? "text-green-600" : "text-muted-foreground"}>8 caractères</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasUpperCase ? "bg-green-500" : "bg-muted"}`}>
              {hasUpperCase && <Check className="w-2 h-2 text-white" />}
            </div>
            <span className={hasUpperCase ? "text-green-600" : "text-muted-foreground"}>Une majuscule</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasNumberOrSpecial ? "bg-green-500" : "bg-muted"}`}>
              {hasNumberOrSpecial && <Check className="w-2 h-2 text-white" />}
            </div>
            <span className={hasNumberOrSpecial ? "text-green-600" : "text-muted-foreground"}>Un chiffre ou caractère spécial</span>
          </div>
          {data.confirmPassword && (
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordsMatch ? "bg-green-500" : "bg-red-500"}`}>
                {passwordsMatch && <Check className="w-2 h-2 text-white" />}
              </div>
              <span className={passwordsMatch ? "text-green-600" : "text-red-600"}>Les mots de passe correspondent</span>
            </div>
          )}
        </div>

        <Button onClick={onSubmit} disabled={!isValid || isLoading} className="w-full bg-vup-navy text-white hover:bg-vup-navy/90">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {userType === "parent" ? "Inscription" : "Je m'inscris"}
        </Button>
      </CardContent>
    </Card>
  );
}
