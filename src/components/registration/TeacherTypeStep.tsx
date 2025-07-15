import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, GraduationCap, BookOpen } from 'lucide-react';

interface TeacherTypeStepProps {
  onSelectType: (type: 'student-teacher' | 'professional-teacher') => void;
  onBack: () => void;
}

export default function TeacherTypeStep({ onSelectType, onBack }: TeacherTypeStepProps) {
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
          Devenir professeur
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => onSelectType('student-teacher')}
          className="w-full h-14 bg-teal-400 hover:bg-teal-500 text-white font-medium"
          size="lg"
        >
          <GraduationCap className="mr-2 h-5 w-5" />
          Professeur étudiant
        </Button>
        
        <Button
          onClick={() => onSelectType('professional-teacher')}
          className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white font-medium"
          size="lg"
        >
          <BookOpen className="mr-2 h-5 w-5" />
          Professionnel de l'enseignement
        </Button>
        
        <div className="text-center mt-6">
          <button className="text-blue-500 hover:underline text-sm">
            Se connecter
          </button>
        </div>
      </CardContent>
    </Card>
  );
}