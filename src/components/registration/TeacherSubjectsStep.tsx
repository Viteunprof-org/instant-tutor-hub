import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface TeacherSubjectsStepProps {
  data: {
    subjects: string[];
    levels: string[];
  };
  onDataChange: (field: string, value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

const SUBJECTS = [
  'Mathématiques',
  'Français',
  'Anglais',
  'Espagnol',
  'Allemand',
  'Histoire-Géographie',
  'Sciences Physiques',
  'SVT',
  'Philosophie',
  'Économie',
  'Informatique',
  'Arts plastiques',
  'Musique',
  'EPS',
];

const LEVELS = [
  'CP',
  'CE1',
  'CE2',
  'CM1',
  'CM2',
  '6ème',
  '5ème',
  '4ème',
  '3ème',
  'Seconde',
  'Première',
  'Terminale',
  'Post-Bac',
];

export default function TeacherSubjectsStep({ 
  data, 
  onDataChange, 
  onNext, 
  onBack, 
  isValid 
}: TeacherSubjectsStepProps) {
  const handleSubjectChange = (subject: string, checked: boolean) => {
    const newSubjects = checked 
      ? [...data.subjects, subject]
      : data.subjects.filter(s => s !== subject);
    onDataChange('subjects', newSubjects);
  };

  const handleLevelChange = (level: string, checked: boolean) => {
    const newLevels = checked 
      ? [...data.levels, level]
      : data.levels.filter(l => l !== level);
    onDataChange('levels', newLevels);
  };

  return (
    <Card className="w-full max-w-md max-h-[90vh] overflow-auto">
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
          Matières et niveaux
        </CardTitle>
        <ProgressBar currentStep={2} totalSteps={4} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-medium">Matières enseignées</Label>
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {SUBJECTS.map((subject) => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox
                  id={`subject-${subject}`}
                  checked={data.subjects.includes(subject)}
                  onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                />
                <Label
                  htmlFor={`subject-${subject}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {subject}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Niveaux enseignés</Label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {LEVELS.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={`level-${level}`}
                  checked={data.levels.includes(level)}
                  onCheckedChange={(checked) => handleLevelChange(level, checked as boolean)}
                />
                <Label
                  htmlFor={`level-${level}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {level}
                </Label>
              </div>
            ))}
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