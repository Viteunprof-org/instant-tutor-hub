/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Video, Loader2, Users, ExternalLink } from "lucide-react";
import apiService from "@/services/api";
import { ZoomMtg } from "@zoom/meetingsdk";
import { CourseDetails } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareWebSDK();
// const sdkKey = import.meta.env.VITE_ZOOM_SDK_KEY;

const leaveUrl = import.meta.env.VITE_FRONTEND_URL;

export default function ZoomMeeting() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // États
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState<"waiting" | "joining" | "in-meeting" | "ended">("waiting");
  const [participantsList, setParticipantsList] = useState<any[]>([]);

  // Déterminer le type d'utilisateur
  const isTeacher = user?.type === "teacher";
  const dashboardPath = `/${user?.type || "student"}/dashboard`;

  const setupZoomEvents = () => {
    // 🔹 ÉVÉNEMENTS DE CONNEXION

    // Connexion établie
    ZoomMtg.inMeetingServiceListener("onUserJoin", (data) => {
      console.log("✅ Connecté au meeting");
      console.log(data);
      // setMeetingStatus("connected");
    });

    ZoomMtg.inMeetingServiceListener("onUserLeave", (data) => {
      console.log("✅ le user a quitter");

      console.log(data);
      apiService.endCourse(Number(courseId));
      // alert("Hello");
      // setMeetingStatus("connected");
    });
  };

  async function startMeeting() {
    setMeetingStatus("joining");
    const zmmtgRoot = document.getElementById("zmmtg-root");
    if (zmmtgRoot) {
      zmmtgRoot.style.display = "block";
    }

    const signature = isTeacher ? course.teacherSign : course.studentSign;
    const userName = `${user.firstName} ${user.lastName}`;
    const userEmail = user.email;

    // setupZoomEvents();

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      patchJsMedia: true,
      leaveOnPageUnload: true,
      disableZoomLogo: true,
      // lang: 'fr-FR',
      success: (success) => {
        setupZoomEvents();
        console.log(success);
        ZoomMtg.join({
          signature: signature,
          meetingNumber: course.meetingId.toString(),
          passWord: course.meetingPwd,
          userName: userName,
          userEmail: userEmail,
          success: (success) => {
            setMeetingStatus("in-meeting");
            console.log(success);
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  console.log(isInitialized);
  console.log(ZoomMtg);

  useEffect(() => {
    // ZoomMtg.preLoadWasm();
    // ZoomMtg.prepareWebSDK();
    // setIsInitialized(true);
    const initializeZoomLazy = async () => {
      if (!isInitialized) {
        try {
          console.log("🚀 Initialisation paresseuse...");
          // ZoomMtg.preLoadWasm();
          // ZoomMtg.prepareWebSDK();
          ZoomMtg.i18n.load("fr-FR");
          setIsInitialized(true);
          console.log("✅ Initialisation paresseuse terminée");
        } catch (error) {
          console.error("❌ Erreur initialisation paresseuse:", error);
          // Continuer sans preload
        }
      }
    };
    initializeZoomLazy();
  }, [isInitialized]);

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
                <CardContent className="p-6">
                  {/* Interface selon le statut de la réunion */}
                  {meetingStatus === "waiting" && (
                    <div className="w-full h-[400px] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center rounded-lg">
                      <div className="text-center p-8">
                        <Video className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Prêt à rejoindre le cours</h3>
                        <p className="text-gray-600 mb-6">La réunion s'ouvrira dans la même fenêtre</p>
                        <Button onClick={startMeeting} disabled={!isInitialized} size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                          <Video className="mr-2 h-5 w-5" />
                          {!isInitialized ? "Initialisation..." : "Rejoindre le cours"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {meetingStatus === "joining" && (
                    <div className="w-full h-[400px] bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center rounded-lg">
                      <div className="text-center p-8">
                        <Loader2 className="mx-auto h-16 w-16 text-green-500 animate-spin mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Connexion en cours...</h3>
                        <p className="text-gray-600">On vous met en relations avec votre prof dans quelque instants...</p>
                      </div>
                    </div>
                  )}

                  {meetingStatus === "in-meeting" && (
                    <div className="w-full h-[400px] bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center rounded-lg border-2 border-green-200">
                      <div className="text-center p-8">
                        <ExternalLink className="mx-auto h-16 w-16 text-green-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Réunion en cours</h3>
                        <p className="text-gray-600 mb-4">Vous êtes connecté à la réunion Zoom dans une fenêtre séparée</p>
                        <p className="text-sm text-green-700 bg-green-100 p-3 rounded mb-4">
                          ✅ Connecté en tant que {isTeacher ? "Professeur (Hôte)" : "Étudiant (Participant)"}
                        </p>
                      </div>
                    </div>
                  )}

                  {meetingStatus === "ended" && (
                    <div className="w-full h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center rounded-lg">
                      <div className="text-center p-8">
                        <Video className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Réunion terminée</h3>
                        <p className="text-gray-600 mb-6">La réunion Zoom s'est terminée</p>
                        <Button onClick={() => navigate(dashboardPath)}>Retour au tableau de bord</Button>
                      </div>
                    </div>
                  )}

                  {/* Informations sur le client View */}
                  {/* <div className="mt-4 text-xs text-gray-500 text-center bg-gray-50 p-3 rounded">
                    <p>• Mode: Client View (fenêtre Zoom séparée)</p>
                    <p>• Rôle: {isTeacher ? "Professeur (Hôte)" : "Étudiant (Participant)"}</p>
                    <p>• Toutes les fonctionnalités Zoom sont disponibles</p>
                  </div> */}
                </CardContent>
              </Card>
            </div>

            {/* Colonne latérale - Informations (1/4 de la largeur sur grand écran) */}
            <div className="lg:col-span-1 space-y-4">
              {/* Statut de la réunion */}
              <Card
                className={`border-2 ${
                  meetingStatus === "in-meeting"
                    ? "border-green-200 bg-green-50"
                    : meetingStatus === "joining"
                    ? "border-yellow-200 bg-yellow-50"
                    : meetingStatus === "ended"
                    ? "border-gray-200 bg-gray-50"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-sm">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        meetingStatus === "in-meeting"
                          ? "bg-green-500"
                          : meetingStatus === "joining"
                          ? "bg-yellow-500"
                          : meetingStatus === "ended"
                          ? "bg-gray-500"
                          : "bg-blue-500"
                      }`}
                    />
                    Statut
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm font-medium">
                    {meetingStatus === "waiting" && "En attente"}
                    {meetingStatus === "joining" && "Connexion..."}
                    {meetingStatus === "in-meeting" && "En cours"}
                    {meetingStatus === "ended" && "Terminé"}
                  </p>
                </CardContent>
              </Card>

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

              {/* Participants (si en réunion et qu'on a des données) */}
              {meetingStatus === "in-meeting" && participantsList.length > 0 && (
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
                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => console.log("TODO")}>
                      Actualiser
                    </Button>
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
