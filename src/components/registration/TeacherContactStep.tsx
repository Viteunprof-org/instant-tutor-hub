import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, FileText, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ProgressBar from './ProgressBar';

interface TeacherContactStepProps {
  data: {
    whatsappNumber: string;
    idDocument: File | null;
    addressProof: File | null;
  };
  onDataChange: (field: string, value: string | File | null) => void;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export default function TeacherContactStep({ 
  data, 
  onDataChange, 
  onNext, 
  onBack, 
  isValid 
}: TeacherContactStepProps) {
  const handleFileChange = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onDataChange(field, file);
  };

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
          Contact et vérification
        </CardTitle>
        <ProgressBar currentStep={3} totalSteps={4} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
          <Input
            id="whatsapp"
            type="tel"
            value={data.whatsappNumber}
            onChange={(e) => onDataChange('whatsappNumber', e.target.value)}
            placeholder="+33 6 12 34 56 78"
          />
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Les notifications de cours seront envoyées sur WhatsApp avec des liens directs pour rejoindre les sessions.
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-2">
          <Label htmlFor="idDocument">Pièce d'identité *</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              id="idDocument"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange('idDocument', e)}
              className="hidden"
            />
            <label htmlFor="idDocument" className="cursor-pointer">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {data.idDocument ? data.idDocument.name : 'Cliquez pour télécharger'}
              </p>
              <p className="text-xs text-gray-400">PNG, JPG ou PDF</p>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="addressProof">Justificatif de domicile *</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              id="addressProof"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange('addressProof', e)}
              className="hidden"
            />
            <label htmlFor="addressProof" className="cursor-pointer">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {data.addressProof ? data.addressProof.name : 'Cliquez pour télécharger'}
              </p>
              <p className="text-xs text-gray-400">PNG, JPG ou PDF</p>
            </label>
          </div>
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