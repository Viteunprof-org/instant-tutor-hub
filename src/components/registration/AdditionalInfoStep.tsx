import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface AdditionalInfoStepProps {
  userType: 'student' | 'parent';
  data: {
    grade?: string;
    phone: string;
    sponsorCode: string;
    // Parent specific fields
    childFirstName?: string;
    childLastName?: string;
    childGrade?: string;
  };
  onDataChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

const gradeOptions = [
  { value: '6eme', label: '6 ème' },
  { value: '5eme', label: '5 ème' },
  { value: '4eme', label: '4 ème' },
  { value: '3eme', label: '3 ème' },
  { value: 'seconde', label: 'Seconde' },
  { value: 'premiere', label: 'Première' },
  { value: 'terminale', label: 'Terminale' },
];

export default function AdditionalInfoStep({ 
  userType, 
  data, 
  onDataChange, 
  onNext, 
  onBack, 
  isValid 
}: AdditionalInfoStepProps) {
  const title = userType === 'parent' ? 'Votre enfant' : 'Informations complémentaires';
  const subtitle = userType === 'parent' 
    ? 'Entrez les informations concernant votre enfant !' 
    : 'Quelques informations supplémentaires';

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-1">
            <span className="text-2xl font-bold text-vup-navy">vite</span>
            <span className="text-2xl font-bold text-vup-yellow">un</span>
            <span className="text-2xl font-bold text-vup-navy">prof</span>
          </div>
          <div className="w-8"></div>
        </div>
        <ProgressBar currentStep={2} totalSteps={3} />
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {userType === 'parent' ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="childFirstName">Prénom</Label>
                <Input
                  id="childFirstName"
                  placeholder="Prénom"
                  value={data.childFirstName || ''}
                  onChange={(e) => onDataChange('childFirstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="childLastName">Nom de famille</Label>
                <Input
                  id="childLastName"
                  placeholder="Nom de famille"
                  value={data.childLastName || ''}
                  onChange={(e) => onDataChange('childLastName', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Classe</Label>
              <div className="grid grid-cols-4 gap-2">
                {gradeOptions.slice(0, 4).map((grade) => (
                  <Button
                    key={grade.value}
                    type="button"
                    variant={data.childGrade === grade.value ? "default" : "outline"}
                    className={`h-10 text-sm ${
                      data.childGrade === grade.value 
                        ? "bg-vup-navy text-white" 
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => onDataChange('childGrade', grade.value)}
                  >
                    {grade.label}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {gradeOptions.slice(4).map((grade) => (
                  <Button
                    key={grade.value}
                    type="button"
                    variant={data.childGrade === grade.value ? "default" : "outline"}
                    className={`h-10 text-sm ${
                      data.childGrade === grade.value 
                        ? "bg-vup-navy text-white" 
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => onDataChange('childGrade', grade.value)}
                  >
                    {grade.label}
                  </Button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <Label>Classe</Label>
            <div className="grid grid-cols-4 gap-2">
              {gradeOptions.slice(0, 4).map((grade) => (
                <Button
                  key={grade.value}
                  type="button"
                  variant={data.grade === grade.value ? "default" : "outline"}
                  className={`h-10 text-sm ${
                    data.grade === grade.value 
                      ? "bg-vup-navy text-white" 
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => onDataChange('grade', grade.value)}
                >
                  {grade.label}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {gradeOptions.slice(4).map((grade) => (
                <Button
                  key={grade.value}
                  type="button"
                  variant={data.grade === grade.value ? "default" : "outline"}
                  className={`h-10 text-sm ${
                    data.grade === grade.value 
                      ? "bg-vup-navy text-white" 
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => onDataChange('grade', grade.value)}
                >
                  {grade.label}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="phone">Numéro de téléphone +33 <span className="text-muted-foreground">(facultatif)</span></Label>
          <Input
            id="phone"
            type="tel"
            placeholder="06 12 34 56 78"
            value={data.phone}
            onChange={(e) => onDataChange('phone', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sponsorCode">Code de parrainage <span className="text-muted-foreground">(facultatif)</span></Label>
          <Input
            id="sponsorCode"
            placeholder="Code de parrainage"
            value={data.sponsorCode}
            onChange={(e) => onDataChange('sponsorCode', e.target.value)}
          />
        </div>
        
        <Button 
          onClick={onNext}
          disabled={!isValid}
          className="w-full bg-vup-navy text-white hover:bg-vup-navy/90"
        >
          Suivant
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}