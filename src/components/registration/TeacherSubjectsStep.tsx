import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface TeacherSubjectsStepProps {
  data: {
    subjects: { name: string; levels: string[] }[];
  };
  onDataChange: (field: string, value: { name: string; levels: string[] }[]) => void;
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
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      const newSubjects = [...data.subjects, { name: subject, levels: [] }];
      onDataChange('subjects', newSubjects);
    } else {
      const newSubjects = data.subjects.filter(s => s.name !== subject);
      onDataChange('subjects', newSubjects);
    }
  };

  const handleLevelChange = (subjectName: string, level: string, checked: boolean) => {
    const newSubjects = data.subjects.map(subject => {
      if (subject.name === subjectName) {
        const newLevels = checked
          ? [...subject.levels, level]
          : subject.levels.filter(l => l !== level);
        return { ...subject, levels: newLevels };
      }
      return subject;
    });
    onDataChange('subjects', newSubjects);
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
        {/* Aperçu des sélections */}
        {data.subjects.length > 0 && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            {data.subjects.map((subject) => (
              <div key={subject.name} className="space-y-2">
                <h3 className="text-base font-semibold text-gray-900">{subject.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {subject.levels.map(level => (
                    <Badge 
                      key={level} 
                      variant="outline" 
                      className="px-2 py-1 text-xs bg-white hover:bg-gray-100 border-gray-300"
                    >
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Matières enseignées</Label>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {SUBJECTS.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject}`}
                    checked={data.subjects.some(s => s.name === subject)}
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

          {data.subjects.length > 0 && (
            <div>
              <Label className="text-base font-medium mb-3 block">Niveaux pour chaque matière</Label>
              <div className="space-y-4">
                {data.subjects.map((subject) => (
                  <div key={subject.name} className="p-3 border rounded-lg">
                    <h4 className="text-sm font-medium mb-2">{subject.name}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {LEVELS.map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${subject.name}-${level}`}
                            checked={subject.levels.includes(level)}
                            onCheckedChange={(checked) => handleLevelChange(subject.name, level, checked as boolean)}
                          />
                          <Label
                            htmlFor={`${subject.name}-${level}`}
                            className="text-xs font-normal cursor-pointer"
                          >
                            {level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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