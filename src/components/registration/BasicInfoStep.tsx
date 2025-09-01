import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProgressBar from "./ProgressBar";

interface BasicInfoStepProps {
  userType: "student" | "parent";
  data: {
    firstName: string;
    lastName: string;
    email: string;
    confirmEmail: string;
    parentPhone: string;
  };
  onDataChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export default function BasicInfoStep({ userType, data, onDataChange, onNext, onBack, isValid }: BasicInfoStepProps) {
  const title = userType === "parent" ? "Vos informations" : "Vos informations";
  const subtitle = userType === "parent" ? "Entrez vos informations personnelles" : "Entrez vos informations personnelles";

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-1">
            <span className="text-2xl font-bold text-vup-navy">vite</span>
            <span className="text-2xl font-bold text-vup-yellow">un</span>
            <span className="text-2xl font-bold text-vup-navy">prof</span>
          </div>
          <div className="w-8"></div>
        </div>
        <ProgressBar currentStep={1} totalSteps={3} />
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input id="firstName" placeholder="Prénom" value={data.firstName} onChange={(e) => onDataChange("firstName", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom de famille</Label>
            <Input
              id="lastName"
              placeholder="Nom de famille"
              value={data.lastName}
              onChange={(e) => onDataChange("lastName", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            value={data.email}
            onChange={(e) => onDataChange("email", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmEmail">Confirmation email</Label>
          <Input
            id="confirmEmail"
            type="email"
            placeholder="Confirmez votre email"
            value={data.confirmEmail}
            onChange={(e) => onDataChange("confirmEmail", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="parentPhone">
            Numéro de téléphone +33 <span className="text-muted-foreground"></span>
          </Label>
          <Input
            id="parentPhone"
            type="tel"
            placeholder="+33 6 12 34 56 78"
            value={data.parentPhone}
            onChange={(e) => onDataChange("parentPhone", e.target.value)}
          />
        </div>
        <Button onClick={onNext} disabled={!isValid} className="w-full bg-vup-navy text-white hover:bg-vup-navy/90">
          Suivant
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
