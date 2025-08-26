import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, FileText, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProgressBar from "./ProgressBar";
import { apiService } from "../../services/api"; // Ajustez le chemin selon votre structure

interface FileData {
  field: "id" | "home-certificate";
  file: File;
  uploadResponse?: any; // Pour stocker la réponse de l'upload
}

interface TeacherContactStepProps {
  data: {
    phone: string;
    files: FileData[];
  };
  onDataChange: (field: string, value: string | FileData[]) => void;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export default function TeacherContactStep({ data, onDataChange, onNext, onBack, isValid }: TeacherContactStepProps) {
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

  const handleFileChange = async (field: "id" | "home-certificate", event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Marquer le fichier comme en cours d'upload
    setUploadingFiles((prev) => ({ ...prev, [field]: true }));

    try {
      // Uploader le fichier via l'API
      const uploadResponse = await apiService.uploadFile(file, field);
      const fileName = uploadResponse.data.data.fileName;
      const path = uploadResponse.data.data.path;
      console.log("Upload response:", path, fileName);

      // Créer une copie du tableau files actuel
      const currentFiles = [...data.files];

      // Supprimer le fichier existant pour ce field s'il existe
      const filteredFiles = currentFiles.filter((f) => f.field !== field);

      // Ajouter le nouveau fichier avec la réponse de l'upload
      const newFiles = [...filteredFiles, { field, file, fileName, path }];

      onDataChange("files", newFiles);

      console.log("Fichier uploadé avec succès:", uploadResponse);
    } catch (error) {
      console.error("Erreur lors de l'upload du fichier:", error);
      // Vous pouvez ajouter une notification d'erreur ici
      alert("Erreur lors de l'upload du fichier. Veuillez réessayer.");
    } finally {
      // Marquer l'upload comme terminé
      setUploadingFiles((prev) => ({ ...prev, [field]: false }));
    }
  };

  const getFileByField = (field: "id" | "home-certificate"): File | null => {
    const fileData = data.files.find((f) => f.field === field);
    return fileData ? fileData.file : null;
  };

  const removeFile = (field: "id" | "home-certificate") => {
    const newFiles = data.files.filter((f) => f.field !== field);
    onDataChange("files", newFiles);
  };

  return (
    <Card className="w-full max-w-md h-[90vh] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center space-x-2 mb-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">viteunprof</span>
        </div>
        <CardTitle className="text-center text-xl">Contact et vérification</CardTitle>
        <ProgressBar currentStep={3} totalSteps={4} />
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-6 px-6">
        <div className="space-y-2">
          <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
          <Input
            id="whatsapp"
            type="tel"
            value={data.phone}
            onChange={(e) => onDataChange("phone", e.target.value)}
            placeholder="+33 6 12 34 56 78"
          />
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Les notifications de cours seront envoyées sur WhatsApp avec des liens directs pour rejoindre les sessions.
            </AlertDescription>
          </Alert>
        </div>

        {/* Pièce d'identité */}
        <div className="space-y-2">
          <Label htmlFor="idDocument">Pièce d'identité *</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              id="idDocument"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange("id", e)}
              className="hidden"
              disabled={uploadingFiles["id"]}
            />
            <label htmlFor="idDocument" className="cursor-pointer">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {uploadingFiles["id"] ? "Upload en cours..." : getFileByField("id") ? getFileByField("id")!.name : "Cliquez pour télécharger"}
              </p>
              <p className="text-xs text-gray-400">PNG, JPG ou PDF (max 5MB)</p>
            </label>
          </div>
          {getFileByField("id") && !uploadingFiles["id"] && (
            <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700 truncate max-w-48">{getFileByField("id")!.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFile("id")} className="text-red-500 hover:text-red-700 h-6 w-6 p-0">
                ×
              </Button>
            </div>
          )}
        </div>

        {/* Justificatif de domicile */}
        <div className="space-y-2">
          <Label htmlFor="addressProof">Justificatif de domicile *</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              id="addressProof"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange("home-certificate", e)}
              className="hidden"
              disabled={uploadingFiles["home-certificate"]}
            />
            <label htmlFor="addressProof" className="cursor-pointer">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {uploadingFiles["home-certificate"]
                  ? "Upload en cours..."
                  : getFileByField("home-certificate")
                  ? getFileByField("home-certificate")!.name
                  : "Cliquez pour télécharger"}
              </p>
              <p className="text-xs text-gray-400">PNG, JPG ou PDF (max 5MB)</p>
            </label>
          </div>
          {getFileByField("home-certificate") && !uploadingFiles["home-certificate"] && (
            <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700 truncate max-w-48">{getFileByField("home-certificate")!.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile("home-certificate")}
                className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          )}
        </div>

        {/* Info sur les documents */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Documents acceptés :</strong>
            <br />• Pièce d'identité : CNI, passeport, permis de conduire
            <br />• Justificatif : facture (électricité, gaz, téléphone), relevé bancaire, quittance de loyer (moins de 3 mois)
          </AlertDescription>
        </Alert>
      </CardContent>

      <div className="flex justify-between p-6 pt-4 border-t flex-shrink-0">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button onClick={onNext} disabled={!isValid || Object.values(uploadingFiles).some((uploading) => uploading)}>
          Suivant
        </Button>
      </div>
    </Card>
  );
}
