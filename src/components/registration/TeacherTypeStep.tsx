import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface TeacherTypeStepProps {
  onSelectType: (type: "teacher" | "professional") => void;
  onBack: () => void;
}

export default function TeacherTypeStep({ onSelectType, onBack }: TeacherTypeStepProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center space-x-1">
            <img src="/logo.svg" className="w-48" />
          </div>
          <div></div>
        </div>
        <CardTitle className="text-2xl text-center">Bienvenue</CardTitle>
        <CardDescription className="text-center">Choisissez votre profil pour commencer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={() => onSelectType("teacher")} className="w-full h-12 bg-teal-400 hover:bg-teal-500 text-white font-medium">
          Devenir professeur
        </Button>

        {/* <Button onClick={() => onSelectType("professional")} className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white font-medium">
          Professionnel de l'enseignement
        </Button> */}

        <div className="mt-6 text-center text-sm space-y-2">
          <Link to="/login?type=teacher" className="text-accent hover:underline block">
            Se connecter
          </Link>
          <Link to="/register" className="text-accent hover:underline block">
            Devenir élève
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
