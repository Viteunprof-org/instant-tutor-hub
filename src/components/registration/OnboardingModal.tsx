import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, BookOpen, Heart, Calendar, Bell, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'student' | 'parent';
}

const studentOnboardingSteps = [
  {
    title: "Le concept",
    icon: <BookOpen className="w-8 h-8 text-vup-yellow" />,
    content: [
      {
        icon: <User className="w-6 h-6 text-vup-yellow" />,
        title: "Je demande mon cours",
        description: "Effectue une demande de cours sur une durée de 20, 40, ou 60 minutes et attends ton professeur."
      },
      {
        icon: <User className="w-6 h-6 text-vup-yellow" />,
        title: "Je prends mon cours",
        description: "En quelques instants, un professeur se connecte en visio et t'aide à résoudre ton problème."
      },
      {
        icon: <Heart className="w-6 h-6 text-vup-yellow" />,
        title: "Mon problème est résolu",
        description: "Ton cours est terminé, tu peux maintenant noter ton professeur. Ton avis compte pour nous !"
      }
    ]
  },
  {
    title: "Un format sur-mesure",
    icon: <Calendar className="w-8 h-8 text-vup-yellow" />,
    content: [
      {
        icon: <Calendar className="w-6 h-6 text-vup-yellow" />,
        title: "Une flexibilité totale",
        description: "Pour les plus soucieux comme pour les procrastinateurs, le service est disponible quand tu en as besoin 24h/24 et 7j/7."
      },
      {
        icon: <Heart className="w-6 h-6 text-vup-yellow" />,
        title: "Nous sommes toujours là",
        description: "Nous avons à cœur de construire un produit que les étudiants adorent. Au moindre problème, contacte-nous."
      }
    ]
  }
] as Array<{
  title: string;
  icon: JSX.Element;
  content: Array<{
    icon: JSX.Element;
    title: string;
    description: string;
  }>;
  note?: string;
}>;

const parentOnboardingSteps = [
  {
    title: "Le concept",
    icon: <BookOpen className="w-8 h-8 text-vup-yellow" />,
    content: [
      {
        icon: <User className="w-6 h-6 text-vup-yellow" />,
        title: "Demander un cours",
        description: "Effectuez une demande de cours sur une durée de 20, 40, ou 60 minutes et attendez votre professeur."
      },
      {
        icon: <User className="w-6 h-6 text-vup-yellow" />,
        title: "Prendre son cours",
        description: "En quelques instants, un professeur se connecte en visio et vous aide à résoudre votre problème."
      },
      {
        icon: <Heart className="w-6 h-6 text-vup-yellow" />,
        title: "Problème résolu",
        description: "Le cours est terminé, vous pouvez maintenant noter le professeur. Votre avis compte pour nous !"
      }
    ]
  },
  {
    title: "Un format sur-mesure",
    icon: <Calendar className="w-8 h-8 text-vup-yellow" />,
    content: [
      {
        icon: <Calendar className="w-6 h-6 text-vup-yellow" />,
        title: "Une flexibilité totale",
        description: "Pour les plus soucieux comme pour les procrastinateurs, le service est disponible quand 24h/24 et 7j/7."
      },
      {
        icon: <Heart className="w-6 h-6 text-vup-yellow" />,
        title: "Nous sommes toujours là",
        description: "Nous avons à cœur de construire un produit que les parents et étudiants adorent. Au moindre problème, contactez-nous."
      }
    ]
  },
  {
    title: "Votre enfant",
    icon: <Heart className="w-8 h-8 text-vup-yellow" />,
    content: [
      {
        icon: <Heart className="w-6 h-6 text-vup-yellow" />,
        title: "Ravis que vous soyez là !",
        description: "Cela signifie que la réussite de votre enfant est primordiale. Elle l'est pour nous aussi ."
      },
      {
        icon: <User className="w-6 h-6 text-vup-yellow" />,
        title: "Ce compte sera le sien",
        description: "Vous vous apprêtez à créer un compte pour votre enfant. N'oubliez pas de lui faire télécharger l'app et de lui donner les identifiants !"
      },
      {
        icon: <Bell className="w-6 h-6 text-vup-yellow" />,
        title: "On a pensé à vous",
        description: "Vous pouvez entrer votre numéro de téléphone dans l'inscription si vous souhaitez recevoir un retour sms après les séances ."
      }
    ]
  }
] as Array<{
  title: string;
  icon: JSX.Element;
  content: Array<{
    icon: JSX.Element;
    title: string;
    description: string;
  }>;
  note?: string;
}>;

export default function OnboardingModal({ isOpen, onClose, userType }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = userType === 'student' ? studentOnboardingSteps : parentOnboardingSteps;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      // Mark onboarding as seen
      localStorage.setItem('vup-onboarding-seen', 'true');
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md border-0 p-0 bg-transparent">
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-1 mb-6">
                <span className="text-2xl font-bold text-vup-navy">vite</span>
                <span className="text-2xl font-bold text-vup-yellow">un</span>
                <span className="text-2xl font-bold text-vup-navy">prof</span>
              </div>
              
              <div className="flex items-center justify-center mb-4">
                {steps[currentStep].icon}
              </div>
              
              <h2 className="text-2xl font-bold text-vup-navy mb-8">
                {steps[currentStep].title}
              </h2>
            </div>

            <div className="space-y-6 mb-8">
              {steps[currentStep].content.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-vup-navy mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {steps[currentStep].note && (
              <p className="text-center text-sm text-muted-foreground italic mb-6">
                {steps[currentStep].note}
              </p>
            )}

            <div className="space-y-3">
              <Button 
                onClick={handleNext}
                className="w-full bg-vup-navy text-white hover:bg-vup-navy/90"
              >
                {isLastStep ? "C'est parti !" : "Suivant"}
                {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>

              <div className="flex justify-center space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? 'bg-vup-navy' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}