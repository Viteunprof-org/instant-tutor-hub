import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronDown, ChevronUp, X, BookOpen } from "lucide-react";
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

export default function TeacherSubjectsStep({ data, onDataChange, onNext, onBack, isValid }: TeacherSubjectsStepProps) {
  const [matters, setMatters] = useState<Matter[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedMatter, setExpandedMatter] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mattersResponse, levelsResponse] = await Promise.all([apiService.getMatters(), apiService.getLevels()]);

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

  const getSelectedMatter = (matterId: number) => {
    return data.matters.find((m) => m.id === matterId);
  };

  const handleMatterToggle = (matterId: number) => {
    const existing = getSelectedMatter(matterId);

    if (existing) {
      // Désélectionner la matière
      const newMatters = data.matters.filter((m) => m.id !== matterId);
      onDataChange("matters", newMatters);
      if (expandedMatter === matterId) {
        setExpandedMatter(null);
      }
    } else {
      // Sélectionner la matière et ouvrir le panneau des niveaux
      const newMatters = [...data.matters, { id: matterId, levels: [] }];
      onDataChange("matters", newMatters);
      setExpandedMatter(matterId);
    }
  };

  const handleLevelToggle = (matterId: number, levelId: number) => {
    const newMatters = data.matters.map((matter) => {
      if (matter.id === matterId) {
        const hasLevel = matter.levels.includes(levelId);
        const newLevels = hasLevel ? matter.levels.filter((l) => l !== levelId) : [...matter.levels, levelId];
        return { ...matter, levels: newLevels };
      }
      return matter;
    });
    onDataChange("matters", newMatters);
  };

  const handleSelectAllLevels = (matterId: number) => {
    const matter = getSelectedMatter(matterId);
    if (!matter) return;

    const allSelected = levels.every((level) => matter.levels.includes(level.id));
    const newMatters = data.matters.map((m) => {
      if (m.id === matterId) {
        return {
          ...m,
          levels: allSelected ? [] : levels.map((l) => l.id),
        };
      }
      return m;
    });
    onDataChange("matters", newMatters);
  };

  const getLevelName = (levelId: number) => {
    return levels.find((l) => l.id === levelId)?.name || "";
  };

  const getMatterName = (matterId: number) => {
    return matters.find((m) => m.id === matterId)?.name || "";
  };

  const removeMatter = (matterId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newMatters = data.matters.filter((m) => m.id !== matterId);
    onDataChange("matters", newMatters);
    if (expandedMatter === matterId) {
      setExpandedMatter(null);
    }
  };

  const removeLevel = (matterId: number, levelId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    handleLevelToggle(matterId, levelId);
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
      <CardHeader className="flex-shrink-0 pb-2">
        <div className="flex items-center space-x-2 mb-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">viteunprof</span>
        </div>
        <CardTitle className="text-center text-xl">Matières et niveaux</CardTitle>
        <p className="text-center text-sm text-muted-foreground mt-1">Sélectionnez vos matières puis les niveaux que vous enseignez</p>
        <ProgressBar currentStep={2} totalSteps={4} />
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto px-4 pb-2">
        {/* Résumé des sélections en haut */}
        {data.matters.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Label className="text-sm font-medium text-blue-900 mb-2 block">
              Vos sélections ({data.matters.length} matière{data.matters.length > 1 ? "s" : ""})
            </Label>
            <div className="space-y-2">
              {data.matters.map((matter) => (
                <div key={matter.id} className="flex items-start gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shrink-0"
                    onClick={(e) => removeMatter(matter.id, e)}
                  >
                    {getMatterName(matter.id)}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                  {matter.levels.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {matter.levels.length === levels.length ? (
                        <Badge variant="outline" className="text-xs bg-white">
                          Tous niveaux
                        </Badge>
                      ) : (
                        matter.levels.map((levelId) => (
                          <Badge
                            key={levelId}
                            variant="outline"
                            className="text-xs bg-white cursor-pointer hover:bg-gray-100"
                            onClick={(e) => removeLevel(matter.id, levelId, e)}
                          >
                            {getLevelName(levelId)}
                            <X className="h-2 w-2 ml-1" />
                          </Badge>
                        ))
                      )}
                    </div>
                  )}
                  {matter.levels.length === 0 && <span className="text-xs text-amber-600 italic">Sélectionnez des niveaux ↓</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Liste des matières avec accordéon */}
        <div className="space-y-2">
          {matters.map((matter) => {
            const selected = getSelectedMatter(matter.id);
            const isExpanded = expandedMatter === matter.id;
            const allLevelsSelected = selected && levels.every((level) => selected.levels.includes(level.id));

            return (
              <div
                key={matter.id}
                className={`border rounded-lg overflow-hidden transition-all ${selected ? "border-blue-300 bg-blue-50/50" : "border-gray-200"}`}
              >
                {/* En-tête de la matière */}
                <div
                  className={`flex items-center justify-between p-3 cursor-pointer ${selected ? "bg-blue-50" : "hover:bg-gray-50"}`}
                  onClick={() => {
                    if (selected) {
                      setExpandedMatter(isExpanded ? null : matter.id);
                    } else {
                      handleMatterToggle(matter.id);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={!!selected}
                      onCheckedChange={() => handleMatterToggle(matter.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className={`font-medium ${selected ? "text-blue-900" : ""}`}>{matter.name}</span>
                    </div>
                  </div>

                  {selected && (
                    <div className="flex items-center gap-2">
                      {selected.levels.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {selected.levels.length === levels.length
                            ? "Tous"
                            : `${selected.levels.length} niveau${selected.levels.length > 1 ? "x" : ""}`}
                        </Badge>
                      )}
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    </div>
                  )}
                </div>

                {/* Panneau des niveaux (accordéon) */}
                {selected && isExpanded && (
                  <div className="p-3 pt-0 border-t border-blue-100 bg-white">
                    <div className="pt-3">
                      {/* Bouton "Tous les niveaux" */}
                      <div
                        className={`flex items-center gap-2 p-2 rounded-md mb-2 cursor-pointer transition-colors ${
                          allLevelsSelected ? "bg-blue-100 border border-blue-300" : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                        }`}
                        onClick={() => handleSelectAllLevels(matter.id)}
                      >
                        <Checkbox
                          checked={allLevelsSelected}
                          onCheckedChange={() => handleSelectAllLevels(matter.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <span className="text-sm font-medium">Tous les niveaux</span>
                      </div>

                      {/* Grille des niveaux individuels */}
                      <div className="grid grid-cols-2 gap-1">
                        {levels.map((level) => {
                          const isLevelSelected = selected.levels.includes(level.id);
                          return (
                            <div
                              key={level.id}
                              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                                isLevelSelected ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50 border border-transparent"
                              }`}
                              onClick={() => handleLevelToggle(matter.id, level.id)}
                            >
                              <Checkbox
                                checked={isLevelSelected}
                                onCheckedChange={() => handleLevelToggle(matter.id, level.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="data-[state=checked]:bg-blue-600"
                              />
                              <span className="text-sm">{level.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Message d'aide si aucune sélection */}
        {data.matters.length === 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
            <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Cliquez sur une matière pour commencer</p>
          </div>
        )}
      </CardContent>

      <div className="flex justify-between p-4 border-t flex-shrink-0 bg-white">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="bg-blue-600 hover:bg-blue-700">
          Suivant
        </Button>
      </div>
    </Card>
  );
}
