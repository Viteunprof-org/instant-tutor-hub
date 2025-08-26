import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { apiService } from "../../services/api";

interface Matter {
  id: number;
  name: string;
}

interface Level {
  id: number;
  name: string;
}

interface TeacherSubjectsStepProps {
  data: {
    matters: { id: number; levels: number[] }[];
  };
  onDataChange: (field: string, value: { id: number; levels: number[] }[]) => void;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

const ALL_LEVELS_OPTION = "Tous les niveaux";

export default function TeacherSubjectsStep({ data, onDataChange, onNext, onBack, isValid }: TeacherSubjectsStepProps) {
  const [matters, setMatters] = useState<Matter[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mattersResponse, levelsResponse] = await Promise.all([apiService.getMatters(), apiService.getLevels()]);
        console.log("Fetched matters:", mattersResponse);
        if (mattersResponse.success && mattersResponse.data) {
          setMatters(mattersResponse.data);
        }

        if (levelsResponse.success && levelsResponse.data) {
          setLevels(levelsResponse.data);
        }
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error("Error fetching matters and levels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMatterChange = (matterId: number, checked: boolean) => {
    if (checked) {
      const newMatters = [...data.matters, { id: matterId, levels: [] }];
      onDataChange("matters", newMatters);
    } else {
      const newMatters = data.matters.filter((m) => m.id !== matterId);
      onDataChange("matters", newMatters);
    }
  };

  const handleLevelChange = (matterId: number, levelId: number | string, checked: boolean) => {
    const newMatters = data.matters.map((matter) => {
      if (matter.id === matterId) {
        if (levelId === ALL_LEVELS_OPTION) {
          // Si on clique sur "Tous les niveaux", sélectionner/désélectionner tous les niveaux
          const newLevels = checked ? levels.map((level) => level.id) : [];
          return { ...matter, levels: newLevels };
        } else {
          // Gestion normale pour un niveau spécifique
          const newLevels = checked ? [...matter.levels, levelId as number] : matter.levels.filter((l) => l !== levelId);
          return { ...matter, levels: newLevels };
        }
      }
      return matter;
    });
    onDataChange("matters", newMatters);
  };

  const areAllLevelsSelected = (matter: { id: number; levels: number[] }) => {
    return levels.every((level) => matter.levels.includes(level.id));
  };

  const getMatterName = (matterId: number) => {
    return matters.find((m) => m.id === matterId)?.name || "";
  };

  const getLevelName = (levelId: number) => {
    return levels.find((l) => l.id === levelId)?.name || "";
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md h-[90vh] flex flex-col">
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Chargement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md h-[90vh] flex flex-col">
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md h-[90vh] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center space-x-2 mb-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">viteunprof</span>
        </div>
        <CardTitle className="text-center text-xl">Matières et niveaux</CardTitle>
        <ProgressBar currentStep={2} totalSteps={4} />
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-6 px-6">
        {/* Aperçu des sélections */}
        {data.matters.length > 0 && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            {data.matters.map((matter) => (
              <div key={matter.id} className="space-y-2">
                <h3 className="text-base font-semibold text-gray-900">{getMatterName(matter.id)}</h3>
                <div className="flex flex-wrap gap-2">
                  {areAllLevelsSelected(matter) ? (
                    <Badge variant="outline" className="px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700">
                      Tous les niveaux
                    </Badge>
                  ) : (
                    matter.levels.map((levelId) => (
                      <Badge key={levelId} variant="outline" className="px-2 py-1 text-xs bg-white hover:bg-gray-100 border-gray-300">
                        {getLevelName(levelId)}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Matières enseignées</Label>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {matters.map((matter) => (
                <div key={matter.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`matter-${matter.id}`}
                    checked={data.matters.some((m) => m.id === matter.id)}
                    onCheckedChange={(checked) => handleMatterChange(matter.id, checked as boolean)}
                  />
                  <Label htmlFor={`matter-${matter.id}`} className="text-sm font-normal cursor-pointer">
                    {matter.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {data.matters.length > 0 && (
            <div>
              <Label className="text-base font-medium mb-3 block">Niveaux pour chaque matière</Label>
              <div className="space-y-4">
                {data.matters.map((matter) => (
                  <div key={matter.id} className="p-3 border rounded-lg">
                    <h4 className="text-sm font-medium mb-2">{getMatterName(matter.id)}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Niveaux individuels */}
                      {levels.map((level) => (
                        <div key={level.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${matter.id}-${level.id}`}
                            checked={matter.levels.includes(level.id)}
                            onCheckedChange={(checked) => handleLevelChange(matter.id, level.id, checked as boolean)}
                          />
                          <Label htmlFor={`${matter.id}-${level.id}`} className="text-xs font-normal cursor-pointer">
                            {level.name}
                          </Label>
                        </div>
                      ))}

                      {/* Option "Tous les niveaux" */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${matter.id}-${ALL_LEVELS_OPTION}`}
                          checked={areAllLevelsSelected(matter)}
                          onCheckedChange={(checked) => handleLevelChange(matter.id, ALL_LEVELS_OPTION, checked as boolean)}
                        />
                        <Label htmlFor={`${matter.id}-${ALL_LEVELS_OPTION}`} className="text-xs font-normal cursor-pointer">
                          {ALL_LEVELS_OPTION}
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <div className="flex justify-between p-6 pt-4 border-t flex-shrink-0">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button onClick={onNext} disabled={!isValid}>
          Suivant
        </Button>
      </div>
    </Card>
  );
}
