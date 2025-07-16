import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProfileStatus } from '@/hooks/useProfileStatus';

export function ProfileCompletionBanner() {
  const { completionPercentage, isComplete, missingFields } = useProfileStatus();

  // Ne pas afficher la bannière si le profil est complet
  if (isComplete) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-amber-800 mb-2">
            Complétez votre profil pour recevoir des demandes de cours
          </h3>
          
          <div className="mb-3">
            <div className="flex justify-between text-xs text-amber-700 mb-1">
              <span>Progression du profil</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          {missingFields.length > 0 && (
            <p className="text-xs text-amber-700 mb-3">
              Champs manquants : {missingFields.join(', ')}
            </p>
          )}

          <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
            <Link to="/teacher/profile" className="flex items-center">
              Compléter mon profil
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}