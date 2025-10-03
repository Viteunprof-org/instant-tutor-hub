/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Users, Zap, BookOpen, Upload, X, CreditCard } from "lucide-react";
import apiService from "@/services/api";

// Types pour une meilleure typage
interface Matter {
  id: number;
  name: string;
  icon?: string;
}

interface Level {
  id: number;
  name: string;
  description?: string;
}

interface Pack {
  id: number;
  name: string;
  credits: number;
  price: number;
  description?: string;
}

interface UploadedFile {
  file: File;
  uploadResponse?: any;
}

export default function RequestLesson() {
  const [selectedLevel, setSelectedLevel] = useState<number | "">("");
  const [selectedPack, setSelectedPack] = useState<number | "">("");
  const [selectedMatter, setSelectedMatter] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  // const [courseId, setCourseId] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024 // 5MB max
    );

    if (validFiles.length !== files.length) {
      toast({
        title: "Certains fichiers ont été ignorés",
        description: "Seules les images de moins de 5MB sont acceptées.",
        variant: "destructive",
      });
    }

    const newUploadedFiles = validFiles.map((file) => ({ file }));
    setUploadedImages((prev) => [...prev, ...newUploadedFiles]);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (courseId): Promise<UploadedFile[]> => {
    if (uploadedImages.length === 0) return [];

    setIsUploading(true);
    const uploadedFiles: UploadedFile[] = [];
    console.log("courseId:", courseId);
    try {
      for (let i = 0; i < uploadedImages.length; i++) {
        const uploadedFile = uploadedImages[i];

        try {
          const response = await apiService.uploadFile(uploadedFile.file, `course_image_${i}`, courseId);

          if (response.success) {
            uploadedFiles.push({
              ...uploadedFile,
              uploadResponse: response.data,
            });
          } else {
            console.error(`Failed to upload file ${i}:`, response.error);
            toast({
              title: "Erreur d'upload",
              description: `Impossible d'uploader l'image ${uploadedFile.file.name}`,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error(`Error uploading file ${i}:`, error);
        }
      }

      return uploadedFiles;
    } catch (error) {
      console.error("Error in upload process:", error);
      toast({
        title: "Erreur lors de l'upload",
        description: "Une erreur est survenue lors de l'upload des images.",
        variant: "destructive",
      });
      return uploadedFiles;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMatter || !selectedLevel || !description.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload des fichiers d'abord

      // Trouver les objets complets
      const selectedMatterObj = matters.find((m) => m.id === selectedMatter);
      const selectedLevelObj = levels.find((l) => l.id === selectedLevel);

      if (!selectedMatterObj || !selectedLevelObj) {
        throw new Error("Matière ou niveau non trouvé");
      }

      // Préparer les données selon le format demandé
      const courseData = {
        description: description.trim(),
        matter: {
          id: selectedMatterObj.id,
        },
        level: {
          id: selectedLevelObj.id,
        },
      };

      console.log("Sending course request data:", courseData);

      // Créer la demande de cours
      const courseResponse = await apiService.askForCourseRequest(courseData);

      if (!courseResponse.success) {
        throw new Error(courseResponse.error || "Échec de la création de la demande de cours");
      }

      console.log("Course request response:", courseResponse.data);
      // setCourseId(courseResponse.data.id);
      console.log("Course ID set to:", courseResponse.data.id);

      await uploadFiles(courseResponse.data.id);

      toast({
        title: "Demande de cours envoyée !",
        description: "Nous contactons les professeurs disponibles dans ta matière.",
      });

      // navigate("/student/dashboard");
      navigate(`/student/waiting-room/${courseResponse.data.id}`);
    } catch (error) {
      console.error("Error submitting course request:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi de votre demande.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Objets sélectionnés pour l'affichage
  const selectedMatterObj = matters.find((m) => m.id === selectedMatter);
  const selectedLevelObj = levels.find((l) => l.id === selectedLevel);
  const selectedPackObj = packs.find((p) => p.id === selectedPack);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mattersResponse, levelsResponse, packsResponse] = await Promise.all([
          apiService.getMatters(),
          apiService.getLevels(),
          apiService.getPacks(),
        ]);

        if (mattersResponse.success && mattersResponse.data) {
          setMatters(Array.isArray(mattersResponse.data) ? mattersResponse.data : []);
        }

        if (levelsResponse.success && levelsResponse.data) {
          setLevels(Array.isArray(levelsResponse.data) ? levelsResponse.data : []);
        }

        if (packsResponse.success && packsResponse.data) {
          setPacks(Array.isArray(packsResponse.data) ? packsResponse.data : []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données nécessaires.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Demander un cours</h1>
            <p className="text-gray-600">Décrivez votre besoin et trouvez le professeur idéal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Subject selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Matière *
                </CardTitle>
                <CardDescription>Dans quelle matière avez-vous besoin d'aide ?</CardDescription>
              </CardHeader>
              <CardContent>
                {matters.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {matters.map((subject) => (
                      <button
                        key={subject.id}
                        type="button"
                        onClick={() => setSelectedMatter(subject.id)}
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          selectedMatter === subject.id ? "border-vup-yellow bg-vup-yellow/10" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {subject.icon && <div className="text-2xl mb-2">{subject.icon}</div>}
                        <div className="text-sm font-medium">{subject.name}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">Chargement des matières...</div>
                )}
              </CardContent>
            </Card>

            {/* Level selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Niveau *
                </CardTitle>
                <CardDescription>Quel est votre niveau dans cette matière ?</CardDescription>
              </CardHeader>
              <CardContent>
                {levels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {levels.map((level) => (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setSelectedLevel(level.id)}
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          selectedLevel === level.id ? "border-vup-yellow bg-vup-yellow/10" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-lg font-medium">{level.name}</div>
                        {level.description && <div className="text-sm text-gray-600 mt-1">{level.description}</div>}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">Chargement des niveaux...</div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description *</CardTitle>
                <CardDescription>Décrivez précisément votre besoin et ajoutez des images si nécessaire</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Ex: J'ai des difficultés avec les équations du second degré, je prépare un contrôle demain..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />

                {/* Image upload section */}
                <div>
                  <input id="image-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                  >
                    <Upload className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Ajouter des images</span>
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 5MB chacune</p>

                  {/* Preview uploaded images */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4">
                      <Label className="mb-2 block">Images ajoutées ({uploadedImages.length})</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {uploadedImages.map((uploadedFile, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(uploadedFile.file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                              {uploadedFile.file.name.length > 10 ? `${uploadedFile.file.name.substring(0, 10)}...` : uploadedFile.file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pack selection (optionnel) */}
            {/* {packs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pack de crédits *
                  </CardTitle>
                  <CardDescription>Choisissez votre pack de crédits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {packs.map((pack) => (
                      <button
                        key={pack.id}
                        type="button"
                        onClick={() => setSelectedPack(pack.id)}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          selectedPack === pack.id ? "border-vup-yellow bg-vup-yellow/10" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-medium text-lg">{pack.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{pack.credits} crédits</div>
                        <div className="text-lg font-bold text-vup-navy mt-2">{pack.price}€</div>
                        {pack.description && <div className="text-xs text-gray-500 mt-2">{pack.description}</div>}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )} */}

            {/* Summary and submit */}
            {selectedMatterObj && selectedLevelObj && description.trim() && (
              <Card className="border-vup-yellow">
                <CardHeader>
                  <CardTitle className="text-vup-navy">Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span>Matière :</span>
                      <span className="font-medium">{selectedMatterObj.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Niveau :</span>
                      <span className="font-medium">{selectedLevelObj.name}</span>
                    </div>
                    {selectedPackObj && (
                      <div className="flex justify-between">
                        <span>Pack :</span>
                        <span className="font-medium">
                          {selectedPackObj.name} ({selectedPackObj.credits} crédits)
                        </span>
                      </div>
                    )}
                    {uploadedImages.length > 0 && (
                      <div className="flex justify-between">
                        <span>Images :</span>
                        <span className="font-medium">{uploadedImages.length} image(s)</span>
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full bg-vup-yellow text-vup-navy hover:bg-vup-yellow/90" disabled={isSubmitting || isUploading}>
                    {isSubmitting ? (
                      <>
                        <Users className="mr-2 h-4 w-4 animate-spin" />
                        {isUploading ? "Upload en cours..." : "Envoi en cours..."}
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Demander un cours
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
