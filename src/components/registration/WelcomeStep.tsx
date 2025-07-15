import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WelcomeStepProps {
  onSelectUserType: (type: 'student' | 'parent') => void;
}

export default function WelcomeStep({ onSelectUserType }: WelcomeStepProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between mb-4">
          <Link to="/login" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center space-x-1">
            <span className="text-2xl font-bold text-vup-navy">vite</span>
            <span className="text-2xl font-bold text-vup-yellow">un</span>
            <span className="text-2xl font-bold text-vup-navy">prof</span>
          </div>
          <div></div>
        </div>
        <CardTitle className="text-2xl text-center">Bienvenue</CardTitle>
        <CardDescription className="text-center">
          Choisissez votre profil pour commencer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={() => onSelectUserType('student')}
          className="w-full h-12 bg-vup-yellow text-vup-navy hover:bg-vup-yellow/90 font-medium"
        >
          Je suis élève
        </Button>
        <Button 
          onClick={() => onSelectUserType('parent')}
          className="w-full h-12 bg-vup-navy text-white hover:bg-vup-navy/90 font-medium"
        >
          Je suis parent
        </Button>
        
        <div className="mt-6 text-center text-sm space-y-2">
          <Link to="/login" className="text-accent hover:underline block">
            Se connecter
          </Link>
          <Link to="/register/teacher" className="text-accent hover:underline block">
            Devenir professeur
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}