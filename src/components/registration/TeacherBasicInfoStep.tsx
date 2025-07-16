import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface TeacherBasicInfoStepProps {
  teacherType: 'student-teacher' | 'professional-teacher';
  data: {
    firstName: string;
    lastName: string;
    email: string;
    confirmEmail: string;
  };
  onDataChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export default function TeacherBasicInfoStep({ 
  teacherType, 
  data, 
  onDataChange, 
  onNext, 
  onBack, 
  isValid 
}: TeacherBasicInfoStepProps) {
  const isStudentTeacher = teacherType === 'student-teacher';
  
  // Check if email is from a common public provider
  const isPublicEmail = (email: string) => {
    const publicProviders = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'yahoo.fr'];
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && publicProviders.includes(domain);
  };
  
  const showEmailWarning = data.email && isPublicEmail(data.email);

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
          Informations personnelles
        </CardTitle>
        <ProgressBar currentStep={1} totalSteps={4} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            type="text"
            value={data.firstName}
            onChange={(e) => onDataChange('firstName', e.target.value)}
            placeholder="Votre prénom"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            type="text"
            value={data.lastName}
            onChange={(e) => onDataChange('lastName', e.target.value)}
            placeholder="Votre nom"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            {isStudentTeacher ? 'Email de l\'école' : 'Email académique'}
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onDataChange('email', e.target.value)}
            placeholder={isStudentTeacher ? 'votre.email@ecole.fr' : 'votre.email@institution.fr'}
          />
          {showEmailWarning && (
            <Alert className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Veuillez utiliser une adresse email universitaire ou académique. 
                Les adresses Gmail, Outlook, etc. ne sont pas acceptées.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmEmail">Confirmer l'email</Label>
          <Input
            id="confirmEmail"
            type="email"
            value={data.confirmEmail}
            onChange={(e) => onDataChange('confirmEmail', e.target.value)}
            placeholder="Confirmez votre email"
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Retour
          </Button>
          <Button onClick={onNext} disabled={!isValid}>
            Suivant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}