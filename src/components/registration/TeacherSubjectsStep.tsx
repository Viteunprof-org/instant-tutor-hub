import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronDown, ChevronUp, X, BookOpen, AlertCircle, ChevronRight, Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollHint, setShowScrollHint] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

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

  // Masquer l'indicateur de scroll après le premier scroll
  useEffect(() => {
    const handleScroll = () => {
      if (showScrollHint) {
        setShowScrollHint(false);
      }
    };

    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener("scroll", handleScroll);
      return () => listElement.removeEventListener("scroll", handleScroll);
    }
  }, [showScrollHint]);

  // Scroll vers la matière ouverte
  useEffect(() => {
    if (expandedMatter && expandedRef.current) {
      setTimeout(() => {
        expandedRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [expandedMatter]);

  const getSelectedMatter = (matterId: number) => {
    return data.matters.find((m) => m.id === matterId);
  };

  const handleMatterToggle = (matterId: number) => {
    const existing = getSelectedMatter(matterId);

    if (existing) {
      const newMatters = data.matters.filter((m) => m.id !== matterId);
      onDataChange("matters", newMatters);
      if (expandedMatter === matterId) {
        setExpandedMatter(null);
      }
    } else {
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

  // Filtrer les matières par recherche
  const filteredMatters = matters.filter((matter) => matter.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Compter les matières sans niveaux
  const mattersWithoutLevels = data.matters.filter((m) => m.levels.length === 0);

  if (loading) {
    return (
      <Card className="w-full max-w-lg h-[90vh] flex flex-col">
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
      <Card className="w-full max-w-lg h-[90vh] flex flex-col">
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
    <Card className="w-full max-w-lg h-[90vh] md:h-[85vh] flex flex-col">
      {/* Header fixe */}
      <CardHeader className="flex-shrink-0 pb-2 border-b">
        <div className="flex items-center space-x-2 mb-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">viteunprof</span>
        </div>
        <CardTitle className="text-center text-xl">Matières et niveaux</CardTitle>
        <ProgressBar currentStep={2} totalSteps={4} />

        {/* Barre de recherche */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher une matière..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-50"
          />
        </div>
      </CardHeader>

      {/* Alerte si matières sans niveaux */}
      {mattersWithoutLevels.length > 0 && (
        <div className="mx-4 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              {mattersWithoutLevels.length} matière{mattersWithoutLevels.length > 1 ? "s" : ""} sans niveau
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Clique sur {mattersWithoutLevels.length > 1 ? "ces matières" : "cette matière"} pour ajouter des niveaux :
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {mattersWithoutLevels.map((m) => (
                <Badge
                  key={m.id}
                  variant="outline"
                  className="text-xs bg-amber-100 border-amber-300 text-amber-800 cursor-pointer hover:bg-amber-200"
                  onClick={() => setExpandedMatter(m.id)}
                >
                  {getMatterName(m.id)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Résumé des sélections valides */}
      {data.matters.filter((m) => m.levels.length > 0).length > 0 && (
        <div className="mx-4 mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium text-green-800 flex items-center gap-1">
              <Check className="h-4 w-4" />
              Sélections validées
            </Label>
            <span className="text-xs text-green-600">
              {data.matters.filter((m) => m.levels.length > 0).length} matière
              {data.matters.filter((m) => m.levels.length > 0).length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.matters
              .filter((m) => m.levels.length > 0)
              .map((matter) => (
                <div key={matter.id} className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-green-200">
                  <span className="text-sm font-medium text-green-900">{getMatterName(matter.id)}</span>
                  <span className="text-xs text-green-600">({matter.levels.length === levels.length ? "tous" : matter.levels.length})</span>
                  <button onClick={(e) => removeMatter(matter.id, e)} className="ml-1 text-green-400 hover:text-red-500 transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Liste des matières - scrollable */}
      <div className="flex-1 overflow-hidden relative">
        {/* Indicateur de scroll */}
        {showScrollHint && filteredMatters.length > 5 && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-10 flex items-end justify-center pb-2">
            <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full animate-bounce flex items-center gap-1">
              <ChevronDown className="h-3 w-3" />
              Scroll pour voir plus
            </div>
          </div>
        )}

        <div ref={listRef} className="h-full overflow-y-auto px-4 py-3 space-y-2">
          {filteredMatters.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune matière trouvée pour "{searchQuery}"</p>
            </div>
          ) : (
            filteredMatters.map((matter) => {
              const selected = getSelectedMatter(matter.id);
              const isExpanded = expandedMatter === matter.id;
              const allLevelsSelected = selected && levels.every((level) => selected.levels.includes(level.id));
              const hasLevels = selected && selected.levels.length > 0;

              return (
                <div
                  key={matter.id}
                  ref={isExpanded ? expandedRef : null}
                  className={`border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                    selected
                      ? hasLevels
                        ? "border-green-300 bg-green-50/30"
                        : "border-amber-300 bg-amber-50/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* En-tête de la matière */}
                  <div
                    className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                      selected ? (hasLevels ? "bg-green-50" : "bg-amber-50") : "hover:bg-gray-50"
                    }`}
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
                        className={`h-5 w-5 ${
                          selected
                            ? hasLevels
                              ? "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                              : "data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                            : ""
                        }`}
                      />
                      <div className="flex items-center gap-2">
                        <BookOpen className={`h-5 w-5 ${selected ? (hasLevels ? "text-green-600" : "text-amber-500") : "text-gray-400"}`} />
                        <span className={`font-medium text-base ${selected ? (hasLevels ? "text-green-900" : "text-amber-900") : "text-gray-700"}`}>
                          {matter.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {selected && (
                        <>
                          {hasLevels ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              {selected.levels.length === levels.length
                                ? "Tous niveaux"
                                : `${selected.levels.length} niveau${selected.levels.length > 1 ? "x" : ""}`}
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200">Choisir niveaux</Badge>
                          )}
                          {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Panneau des niveaux */}
                  {selected && isExpanded && (
                    <div className="border-t border-gray-200 bg-white p-4">
                      <p className="text-sm text-gray-600 mb-3">
                        Sélectionne les niveaux que tu enseignes en <strong>{matter.name}</strong> :
                      </p>

                      {/* Bouton "Tous les niveaux" */}
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg mb-3 cursor-pointer transition-all ${
                          allLevelsSelected ? "bg-blue-100 border-2 border-blue-400" : "bg-gray-100 hover:bg-gray-200 border-2 border-transparent"
                        }`}
                        onClick={() => handleSelectAllLevels(matter.id)}
                      >
                        <Checkbox
                          checked={allLevelsSelected || false}
                          onCheckedChange={() => handleSelectAllLevels(matter.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-5 w-5 data-[state=checked]:bg-blue-600"
                        />
                        <span className="font-medium">Tous les niveaux ({levels.length})</span>
                      </div>

                      {/* Grille des niveaux */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {levels.map((level) => {
                          const isLevelSelected = selected.levels.includes(level.id);
                          return (
                            <div
                              key={level.id}
                              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                                isLevelSelected ? "bg-blue-50 border-2 border-blue-300" : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                              }`}
                              onClick={() => handleLevelToggle(matter.id, level.id)}
                            >
                              <Checkbox
                                checked={isLevelSelected}
                                onCheckedChange={() => handleLevelToggle(matter.id, level.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="h-4 w-4 data-[state=checked]:bg-blue-600"
                              />
                              <span className="text-sm font-medium">{level.name}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Bouton de confirmation */}
                      <Button
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                        onClick={() => setExpandedMatter(null)}
                        disabled={selected.levels.length === 0}
                      >
                        {selected.levels.length === 0
                          ? "Sélectionne au moins 1 niveau"
                          : `Valider ${selected.levels.length} niveau${selected.levels.length > 1 ? "x" : ""}`}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Message d'aide initial */}
          {data.matters.length === 0 && !searchQuery && (
            <div className="mt-4 p-6 bg-blue-50 rounded-xl text-center border-2 border-dashed border-blue-200">
              <BookOpen className="h-10 w-10 text-blue-400 mx-auto mb-3" />
              <p className="text-base font-medium text-blue-900 mb-1">Commence par sélectionner une matière</p>
              <p className="text-sm text-blue-600">Clique sur une matière ci-dessus pour l'ajouter, puis choisis les niveaux</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer fixe */}
      <div className="flex-shrink-0 p-4 border-t bg-white">
        {/* Résumé compact */}
        <div className="flex items-center justify-between mb-3 text-sm">
          <span className="text-gray-600">
            {data.matters.length} matière{data.matters.length > 1 ? "s" : ""} sélectionnée
            {data.matters.length > 1 ? "s" : ""}
          </span>
          {!isValid && data.matters.length > 0 && (
            <span className="text-amber-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Niveaux manquants
            </span>
          )}
          {isValid && (
            <span className="text-green-600 flex items-center gap-1">
              <Check className="h-4 w-4" />
              Prêt
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Retour
          </Button>
          <Button onClick={onNext} disabled={!isValid} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Suivant
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
