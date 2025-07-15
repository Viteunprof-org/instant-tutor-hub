import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Check, X } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface TeacherPasswordStepProps {
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

export default function TeacherPasswordStep({ 
  data, 
  onDataChange, 
  onSubmit, 
  onBack, 
  isValid, 
  isLoading 
}: TeacherPasswordStepProps) {
  const hasMinLength = data.password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(data.password);
  const hasNumberOrSpecial = /[\d\W]/.test(data.password);
  const passwordsMatch = data.password === data.confirmPassword && data.password.length > 0;

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className="flex items-center space-x-2">
      {isValid ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      <span className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
        {text}
      </span>
    </div>
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            viteunprof
          </span>
        </div>
        <CardTitle className="text-center text-xl">
          Mot de passe
        </CardTitle>
        <ProgressBar currentStep={4} totalSteps={4} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => onDataChange('password', e.target.value)}
            placeholder="Créez votre mot de passe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={data.confirmPassword}
            onChange={(e) => onDataChange('confirmPassword', e.target.value)}
            placeholder="Confirmez votre mot de passe"
          />
        </div>

        <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Exigences du mot de passe :</p>
          <ValidationItem 
            isValid={hasMinLength} 
            text="Au moins 8 caractères" 
          />
          <ValidationItem 
            isValid={hasUpperCase} 
            text="Au moins une majuscule" 
          />
          <ValidationItem 
            isValid={hasNumberOrSpecial} 
            text="Au moins un chiffre ou caractère spécial" 
          />
          <ValidationItem 
            isValid={passwordsMatch} 
            text="Les mots de passe correspondent" 
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Retour
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={!isValid || isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? 'Inscription...' : 'S\'inscrire'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}