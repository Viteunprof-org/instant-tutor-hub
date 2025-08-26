/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Video, Loader2, LogOut, Users } from "lucide-react";
import apiService from "@/services/api";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";
import { CourseDetails } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const sdkKey = import.meta.env.VITE_ZOOM_SDK_KEY;

export default function ZoomMeeting() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // États
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [participantsList, setParticipantsList] = useState<any[]>([]);

  // Client Zoom global
  const client = ZoomMtgEmbedded.createClient();

  console.log(client);

  // Déterminer le type d'utilisateur
  const isTeacher = user?.type === "teacher";
  const dashboardPath = `/${user?.type || "student"}/dashboard`;

  // 🔹 Fonction pour configurer les événements
  function setupEventListeners() {
    // Événement quand un autre participant quitte la réunion
    client.on("user-removed", (data) => {
      console.log("Un participant a quitté la réunion :", data);
      alert(`Le participant ${data || "Inconnu"} a quitté la réunion`);
    });

    // Événement pour surveiller les changements de participants
    client.on("user-updated", (data) => {
      console.log("Mise à jour des participants :", data);
      // Vous pouvez ici vérifier si le nombre de participants a diminué
    });

    // Événement quand la connexion est perdue
    client.on("connection-change", (payload) => {
      console.log("Changement de connexion :", payload);
      if (payload.state === "Reconnecting") {
        console.log("Tentative de reconnexion...");
      } else if (payload.state === "Fail") {
        console.log("Connexion échouée");
        alert("Connexion perdue avec la réunion");
      }
    });
  }

  // // Mettre à jour la liste des participants
  const updateParticipantsList = async () => {
    try {
      const participants = await client.getAttendeeslist();
      console.log("Liste des participants :", participants);
      setParticipantsList(participants || []);
    } catch (error) {
      console.log("Impossible d'obtenir la liste des participants :", error);
    }
  };

  // 🔹 Fonction principale pour démarrer la réunion (inspirée du POC)
  async function startMeeting() {
    if (!course || !user) {
      toast({
        title: "Erreur",
        description: "Données manquantes pour démarrer la réunion.",
        variant: "destructive",
      });
      return;
    }

    const meetingSDKElement = document.getElementById("meetingSDKElement");
    if (!meetingSDKElement) {
      toast({
        title: "Erreur",
        description: "Élément de réunion introuvable.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Initialiser le client
      await client.init({
        zoomAppRoot: meetingSDKElement,
        language: "en-US",
        patchJsMedia: true,
        leaveOnPageUnload: true,
      });

      // 🔹 Configurer les événements AVANT de rejoindre la réunion
      setupEventListeners();

      // Déterminer la signature selon le rôle
      const signature = isTeacher ? course.teacherSign : course.studentSign;
      const userName = `${user.firstName} ${user.lastName}`;
      const userEmail = user.email;

      // Rejoindre la réunion
      await client.join({
        sdkKey,
        signature,
        meetingNumber: course.meetingId.toString(),
        password: course.meetingPwd,
        userName,
        userEmail,
      });

      console.log(`${userName} a rejoint la réunion avec succès`);
      setIsInMeeting(true);

      toast({
        title: "Connexion réussie !",
        description: `Vous êtes connecté en tant que ${isTeacher ? "professeur" : "étudiant"}.`,
      });

      try {
        const participantsList = await client.getAttendeeslist();
        console.log("Liste des participants :", participantsList);
      } catch (error) {
        console.log("Impossible d'obtenir la liste des participants :", error);
      }
    } catch (error) {
      console.error("Erreur lors du démarrage de la réunion :", error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de rejoindre la réunion.",
        variant: "destructive",
      });
    }
  }

  // Initialisation
  useEffect(() => {
    if (!courseId || !user) {
      navigate(dashboardPath);
      return;
    }

    // Récupérer les détails du cours
    const fetchCourseDetails = async () => {
      try {
        console.log(`📡 Récupération du cours ${courseId}...`);

        const response = await apiService.getCourseById(Number(courseId));

        if (!response.success) {
          throw new Error("Impossible de récupérer le cours");
        }

        const courseData: CourseDetails = response.data;
        console.log("📋 Cours récupéré:", courseData);

        // Vérifier que le cours est prêt
        if (!courseData.accepted || !courseData.teacher?.id || !courseData.meetingId) {
          toast({
            title: "Erreur",
            description: "Ce cours n'est pas prêt pour la réunion.",
            variant: "destructive",
          });
          navigate(`/${user?.type}/waiting-room/${courseId}`);
          return;
        }

        setCourse(courseData);
      } catch (error) {
        console.error("❌ Erreur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer le cours.",
          variant: "destructive",
        });
        navigate(dashboardPath);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, dashboardPath, navigate, toast, user]);

  // États de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mr-3" />
                <span>Chargement du cours...</span>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600 mb-4">Cours introuvable.</p>
                <Button onClick={() => navigate(dashboardPath)}>Retour au tableau de bord</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Interface principale
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* En-tête */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isTeacher
                ? `Cours avec ${course.student?.firstName} ${course.student?.lastName}`
                : `Cours avec ${course.teacher?.firstName} ${course.teacher?.lastName}`}
            </h1>
            <p className="text-gray-600">
              {course.matter?.name} - {course.level?.name}
            </p>
            <p className="text-sm text-blue-600 mt-1">Mode: {isTeacher ? "Professeur" : "Étudiant"}</p>
          </div>

          {/* Layout en grid pour optimiser l'espace */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Colonne principale - Zone de réunion (3/4 de la largeur sur grand écran) */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Réunion Zoom</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  {/* Conteneur avec positionnement relatif */}
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    {/* Élément Zoom SDK - toujours présent mais caché si pas en réunion */}
                    <div
                      id="meetingSDKElement"
                      className={`w-full transition-all duration-300 ${
                        isInMeeting ? "h-[600px] opacity-100" : "h-0 opacity-0 absolute top-0 left-0"
                      }`}
                    />

                    {/* Interface d'attente - masquée quand en réunion */}
                    {!isInMeeting && (
                      <div className="w-full h-[400px] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center rounded-lg">
                        <div className="text-center p-8">
                          <Video className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">Prêt à rejoindre le cours</h3>
                          <p className="text-gray-600 mb-6">Cliquez sur le bouton ci-dessous pour commencer la réunion</p>
                          <Button onClick={startMeeting} size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                            <Video className="mr-2 h-5 w-5" />
                            Rejoindre le cours
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Aide - seulement visible si en réunion */}
                  {isInMeeting && (
                    <div className="mt-4 text-xs text-gray-500 text-center bg-gray-50 p-3 rounded">
                      <p>• Rôle: {isTeacher ? "Professeur (Hôte)" : "Étudiant (Participant)"}</p>
                      <p>• Vous pouvez utiliser tous les outils de la réunion Zoom</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Colonne latérale - Informations (1/4 de la largeur sur grand écran) */}
            <div className="lg:col-span-1 space-y-4">
              {/* Informations de la réunion */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-sm">
                    <Video className="mr-2 h-4 w-4 text-blue-600" />
                    Détails
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600 block text-xs">ID de réunion</span>
                      <span className="font-mono font-medium text-xs">{course.meetingId}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block text-xs">Mot de passe</span>
                      <span className="font-mono font-medium text-xs">{course.meetingPwd}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block text-xs">Durée prévue</span>
                      <span className="font-medium text-xs">{course.duration} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Participants (si en réunion) */}
              {isInMeeting && participantsList.length > 0 && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4 text-green-600" />
                      Participants ({participantsList.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {participantsList.map((participant, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded text-xs">
                          <span className="font-medium truncate">{participant.displayName || participant.userName}</span>
                          <span className="text-xs text-gray-500">{participant.isHost ? "Hôte" : "Participant"}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Informations du cours */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Informations</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 text-xs">{isTeacher ? "Étudiant:" : "Professeur:"}</span>
                      <p className="font-medium text-sm">
                        {isTeacher
                          ? `${course.student?.firstName} ${course.student?.lastName}`
                          : `${course.teacher?.firstName} ${course.teacher?.lastName}`}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-xs">Email:</span>
                      <p className="font-medium text-xs truncate">{isTeacher ? course.student?.email : course.teacher?.email}</p>
                    </div>
                    {course.description && (
                      <div>
                        <span className="text-gray-600 text-xs">Description:</span>
                        <p className="text-xs text-gray-800 line-clamp-3">{course.description}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <Button variant="outline" onClick={() => navigate(dashboardPath)} className="w-full" size="sm">
                Retour au tableau de bord
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
