import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/ui/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clock, Users, Video, X, CheckCircle, AlertCircle } from "lucide-react";
import apiService from "@/services/api";

// Types
interface CourseRequest {
  id: number;
  description: string;
  matter: {
    id: number;
    name: string;
  };
  level: {
    id: number;
    name: string;
  };
  status: "pending" | "accepted" | "rejected";
  teacherName?: string;
  roomName?: string;
  createdAt: string;
}

// Déclaration globale pour l'API Jitsi
declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function WaitingForTeacher() {
  const { courseId } = useParams<{ courseId: string }>();
  const [courseRequest, setCourseRequest] = useState<CourseRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [waitingTime, setWaitingTime] = useState(0);
  const [jitsiApi, setJitsiApi] = useState<any>(null);
  const [isJitsiLoaded, setIsJitsiLoaded] = useState(false);
  const jitsiContainer = useRef<HTMLDivElement>(null);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Charger le script Jitsi Meet
  const loadJitsiScript = () => {
    return new Promise<void>((resolve, reject) => {
      console.log("🔍 Checking if Jitsi script already loaded...");

      if (window.JitsiMeetExternalAPI) {
        console.log("✅ Jitsi script already available");
        resolve();
        return;
      }

      console.log("📥 Loading Jitsi script from CDN...");
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.onload = () => {
        console.log("✅ Jitsi script loaded successfully");
        setIsJitsiLoaded(true);
        resolve();
      };
      script.onerror = (error) => {
        console.error("❌ Failed to load Jitsi script:", error);
        reject(new Error("Failed to load Jitsi Meet script"));
      };
      document.head.appendChild(script);
    });
  };

  // Initialiser Jitsi Meet
  const initializeJitsi = async (roomName: string, teacherName: string) => {
    console.log("🎥 Starting Jitsi initialization...");
    console.log("📡 Room name:", roomName);
    console.log("👨‍🏫 Teacher name:", teacherName);

    try {
      console.log("📜 Loading Jitsi script...");
      await loadJitsiScript();
      console.log("✅ Jitsi script loaded successfully");

      if (jitsiContainer.current && window.JitsiMeetExternalAPI) {
        console.log("🏗️ Creating Jitsi instance...");

        // Configuration Jitsi Meet
        const options = {
          roomName: roomName,
          width: "100%",
          height: "600px",
          parentNode: jitsiContainer.current,
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            prejoinPageEnabled: false,
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              "microphone",
              "camera",
              "closedcaptions",
              "desktop",
              "fullscreen",
              "fodeviceselection",
              "hangup",
              "chat",
              "recording",
              "livestreaming",
              "etherpad",
              "sharedvideo",
              "settings",
              "raisehand",
              "videoquality",
              "filmstrip",
              "invite",
              "feedback",
              "stats",
              "shortcuts",
              "tileview",
              "select-background",
              "download",
              "help",
              "mute-everyone",
              "security",
            ],
            SETTINGS_SECTIONS: ["devices", "language", "moderator", "profile", "calendar"],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
          },
          userInfo: {
            displayName: "Étudiant", // Vous pouvez récupérer le vrai nom de l'utilisateur
          },
        };

        console.log("⚙️ Jitsi options:", options);
        const api = new window.JitsiMeetExternalAPI("meet.jit.si", options);
        console.log("🎉 Jitsi API created:", api);

        // Event listeners
        api.addEventListeners({
          readyToClose: () => {
            console.log("🚪 Jitsi ready to close");
            api.dispose();
            setJitsiApi(null);
            navigate("/student/dashboard");
          },
          participantLeft: (participant: any) => {
            console.log("👋 Participant left:", participant);
            if (participant.displayName === teacherName) {
              toast({
                title: "Le professeur a quitté",
                description: "La session vidéo s'est terminée.",
                variant: "default",
              });
            }
          },
          videoConferenceJoined: () => {
            console.log("🎊 Successfully joined the video conference!");
          },
        });

        setJitsiApi(api);
        console.log("💾 Jitsi API saved to state");

        toast({
          title: "Connexion établie !",
          description: `Vous êtes maintenant connecté avec ${teacherName}`,
        });
      } else {
        console.error("❌ Missing jitsiContainer or JitsiMeetExternalAPI");
        console.log("Container ref:", jitsiContainer.current);
        console.log("JitsiMeetExternalAPI:", window.JitsiMeetExternalAPI);
      }
    } catch (error) {
      console.error("💥 Error initializing Jitsi:", error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à la vidéoconférence.",
        variant: "destructive",
      });
    }
  };

  // Vérifier le statut du cours
  const checkCourseStatus = async () => {
    if (!courseId) return;

    try {
      console.log(`🔍 Checking course status - waitingTime: ${waitingTime}s, courseId: ${courseId}`);

      // Pour le moment, on mocke la réponse
      // En production, remplacez par: await apiService.getCourseRequest(courseId);
      const mockResponse = {
        success: true,
        data: {
          id: parseInt(courseId),
          description: "Cours de mathématiques - Équations du second degré",
          matter: { id: 1, name: "Mathématiques" },
          level: { id: 2, name: "Lycée" },
          status: waitingTime > 10 ? "accepted" : "pending", // Simule une acceptation après 10 secondes (modifié)
          teacherName: waitingTime > 10 ? "Prof. Dupont" : undefined,
          roomName: waitingTime > 10 ? `course-room-${courseId}-${Date.now()}` : undefined,
          createdAt: new Date().toISOString(),
        },
      };

      console.log("📋 Mock response:", mockResponse.data);

      if (mockResponse.success && mockResponse.data) {
        const courseData = mockResponse.data as CourseRequest;
        setCourseRequest(courseData);

        if (courseData.status === "accepted" && courseData.roomName && courseData.teacherName) {
          console.log("✅ Course accepted! Initializing Jitsi...");
          console.log("👨‍🏫 Teacher:", courseData.teacherName);
          console.log("🏠 Room:", courseData.roomName);

          // Arrêter le polling
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
            console.log("⏹️ Polling stopped");
          }

          // Initialiser Jitsi Meet
          await initializeJitsi(courseData.roomName, courseData.teacherName);
        } else if (courseData.status === "rejected") {
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
          }

          toast({
            title: "Demande refusée",
            description: "Votre demande de cours a été refusée. Vous pouvez en faire une nouvelle.",
            variant: "destructive",
          });

          setTimeout(() => navigate("/student/dashboard"), 3000);
        }
      }
    } catch (error) {
      console.error("Error checking course status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de vérifier le statut du cours.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Annuler la demande
  const cancelRequest = async () => {
    if (!courseId) return;

    try {
      // En production: await apiService.cancelCourseRequest(courseId);
      toast({
        title: "Demande annulée",
        description: "Votre demande de cours a été annulée.",
      });

      navigate("/student/dashboard");
    } catch (error) {
      console.error("Error canceling request:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la demande.",
        variant: "destructive",
      });
    }
  };

  // Quitter la visioconférence
  const leaveCall = () => {
    if (jitsiApi) {
      jitsiApi.dispose();
      setJitsiApi(null);
    }
    navigate("/student/dashboard");
  };

  // Formatage du temps d'attente
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!courseId) {
      navigate("/student/dashboard");
      return;
    }

    // Vérification initiale
    checkCourseStatus();

    // Démarrer le polling toutes les 10 secondes
    pollingInterval.current = setInterval(() => {
      checkCourseStatus();
    }, 10000);

    // Timer pour le temps d'attente
    const waitingTimer = setInterval(() => {
      setWaitingTime((prev) => prev + 1);
    }, 1000);

    // Cleanup
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
      clearInterval(waitingTimer);
      if (jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, [courseId, navigate]);

  if (isLoading && !courseRequest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vup-yellow mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {courseRequest?.status === "pending" && (
            <>
              {/* En attente d'un professeur */}
              <Card className="mb-6">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center text-2xl">
                    <Clock className="mr-2 h-6 w-6 text-vup-yellow animate-pulse" />
                    Recherche d'un professeur...
                  </CardTitle>
                  <CardDescription>Nous cherchons le professeur idéal pour votre cours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Détails du cours */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Détails de votre demande</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Matière :</span>
                        <span className="ml-2 font-medium">{courseRequest.matter.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Niveau :</span>
                        <span className="ml-2 font-medium">{courseRequest.level.name}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-gray-600">Description :</span>
                      <p className="mt-1 text-sm bg-white p-3 rounded border">{courseRequest.description}</p>
                    </div>
                  </div>

                  {/* Temps d'attente */}
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 bg-vup-yellow/10 px-4 py-2 rounded-lg">
                      <Clock className="h-5 w-5 text-vup-yellow" />
                      <span className="font-mono text-lg font-semibold">{formatTime(waitingTime)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Temps d'attente approximatif : 2-5 minutes</p>
                  </div>

                  {/* Animation de recherche */}
                  <div className="flex justify-center">
                    <div className="flex space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-3 h-3 bg-vup-yellow rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                      ))}
                    </div>
                  </div>

                  {/* Bouton annuler */}
                  <div className="flex justify-center">
                    <Button variant="outline" onClick={cancelRequest} className="text-red-600 border-red-600 hover:bg-red-50">
                      <X className="mr-2 h-4 w-4" />
                      Annuler la demande
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {courseRequest?.status === "accepted" && (
            <>
              {/* Professeur trouvé */}
              <Card className="mb-6">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center text-2xl text-green-600">
                    <CheckCircle className="mr-2 h-6 w-6" />
                    Professeur trouvé !
                  </CardTitle>
                  <CardDescription>{courseRequest.teacherName} a accepté votre demande</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-semibold">Professeur : {courseRequest.teacherName}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Matière : {courseRequest.matter.name} • Niveau : {courseRequest.level.name}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <Button onClick={leaveCall} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        <X className="mr-2 h-4 w-4" />
                        Quitter le cours
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Container Jitsi Meet */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="mr-2 h-5 w-5" />
                    Visioconférence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div ref={jitsiContainer} className="w-full bg-gray-900 rounded-lg overflow-hidden" style={{ minHeight: "600px" }}>
                    {!jitsiApi && (
                      <div className="flex items-center justify-center h-full min-h-[600px]">
                        <div className="text-center text-white">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                          <p>Connexion à la visioconférence...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {courseRequest?.status === "rejected" && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center text-2xl text-red-600">
                  <AlertCircle className="mr-2 h-6 w-6" />
                  Demande refusée
                </CardTitle>
                <CardDescription>Votre demande n'a pas pu être satisfaite pour le moment</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">
                  Aucun professeur n'est disponible actuellement pour votre demande. Vous pouvez réessayer plus tard ou modifier vos critères.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => navigate("/student/request-lesson")}>Nouvelle demande</Button>
                  <Button variant="outline" onClick={() => navigate("/student/dashboard")}>
                    Retour au tableau de bord
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
