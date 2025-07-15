interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        <span>Étape {currentStep} sur {totalSteps}</span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2">
        <div 
          className="bg-vup-yellow h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}