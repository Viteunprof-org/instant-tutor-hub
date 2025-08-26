import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clock, Users, Loader2, CheckCircle } from "lucide-react";
import apiService from "@/services/api";
import { CourseDetails } from "@/types";

export default function WaitingRoom() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [waitingTime, setWaitingTime] = useState(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const waitingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // 🎯 FONCTION PRINCIPALE : Récupérer les détails du cours via API
  const fetchCourseDetails = async () => {
    try {
      console.log(`📡 Récupération des détails du cours ${courseId}... (${waitingTime}s)`);

      const response = await apiService.getCourseById(Number(courseId));
      console.log("📥 Réponse de l'API:", response);
      if (!response.success) {
        throw new Error("Impossible de récupérer les détails du cours");
      }

      const courseData: CourseDetails = response.data;
      console.log("📋 Cours récupéré:", courseData);

      setCourse(courseData);

      // 🎯 VÉRIFICATION : Cours accepté avec un professeur assigné
      if (courseData.accepted && courseData.teacher.id && courseData.meetingId) {
        console.log("🎉 Cours accepté avec professeur assigné et réunion prête!");

        // Arrêter le polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        // Arrêter le timer d'attente
        if (waitingTimerRef.current) {
          clearInterval(waitingTimerRef.current);
          waitingTimerRef.current = null;
        }

        toast({
          title: "Cours accepté !",
          description: `${courseData.teacher?.firstName} ${courseData.teacher?.lastName} a accepté votre demande.`,
        });

        // Rediriger vers le composant ZoomMeeting après 2 secondes
        setTimeout(() => {
          navigate(`/student/zoom-meeting/${courseId}`);
        }, 2000);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des détails du cours:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails du cours.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🎯 Démarrer le polling et le timer
  useEffect(() => {
    if (!courseId) {
      navigate("/student/dashboard");
      return;
    }

    // Première récupération
    fetchCourseDetails();

    // Démarrer le polling toutes les 10 secondes
    pollingIntervalRef.current = setInterval(fetchCourseDetails, 10000);

    // Démarrer le timer d'attente
    waitingTimerRef.current = setInterval(() => {
      setWaitingTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (waitingTimerRef.current) {
        clearInterval(waitingTimerRef.current);
      }
    };
  }, [courseId, navigate]);

  // Fonction pour annuler la demande de cours
  const cancelCourse = async () => {
    try {
      // Ici vous pouvez ajouter un appel API pour annuler le cours
      // await apiService.cancelCourse(Number(courseId));

      toast({
        title: "Demande annulée",
        description: "Votre demande de cours a été annulée.",
      });

      navigate("/student/dashboard");
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la demande.",
        variant: "destructive",
      });
    }
  };

  // Formater le temps d'attente
  const formatWaitingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // 🎯 ÉTATS DE CHARGEMENT
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mr-3" />
                <span>Chargement des détails du cours...</span>
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
                <Button onClick={() => navigate("/student/dashboard")}>Retour au tableau de bord</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Vérifier si le cours a été annulé
  if (course.cancelled) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="text-center py-12">
                <h2 className="text-xl font-semibold text-red-800 mb-4">Cours annulé</h2>
                <p className="text-red-600 mb-4">Ce cours a été annulé. Vous pouvez créer une nouvelle demande.</p>
                <Button onClick={() => navigate("/student/dashboard")}>Retour au tableau de bord</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // 🎯 INTERFACE PRINCIPALE - SEULEMENT EN ATTENTE
  const isCourseAccepted = course.accepted && course.teacher.id;

  // Si le cours est accepté, redirection automatique (ne devrait pas arriver)
  if (isCourseAccepted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="flex items-center justify-center py-12">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <span>Cours accepté ! Redirection vers la réunion...</span>
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

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* En-tête */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">En attente d'un professeur</h1>
            <p className="text-gray-600">Nous recherchons un professeur disponible pour votre demande de cours.</p>
          </div>

          {/* Statut du cours */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-yellow-600" />
                Recherche en cours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Matière :</span>
                  <span className="font-medium">{course.matter.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Niveau :</span>
                  <span className="font-medium">{course.level.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Description :</span>
                  <span className="font-medium">{course.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temps d'attente :</span>
                  <span className="font-medium font-mono text-lg">{formatWaitingTime(waitingTime)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Animation d'attente */}
          <Card>
            <CardContent className="text-center py-8">
              <div className="animate-pulse">
                <Users className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
              </div>
              <h3 className="text-lg font-medium mb-2">Recherche en cours...</h3>
              <p className="text-gray-600 mb-4">Nous contactons les professeurs disponibles dans votre matière.</p>
              <p className="text-sm text-gray-500 mb-6">
                La recherche peut prendre quelques minutes. Vous serez automatiquement redirigé vers la réunion dès qu'un professeur acceptera votre
                demande.
              </p>

              {/* Animation de points */}
              <div className="flex justify-center items-center space-x-1 mb-6">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>

              {/* Statistiques d'attente (optionnel) */}
              <div className="text-xs text-gray-500">
                <p>⏱️ Temps d'attente moyen : 2-5 minutes</p>
                <p>👨‍🏫 Professeurs actifs dans cette matière</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => navigate("/student/dashboard")} className="flex-1">
              Retour au tableau de bord
            </Button>

            <Button variant="destructive" onClick={cancelCourse} className="flex-1">
              Annuler la demande
            </Button>
          </div>

          {/* Informations complémentaires */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <h4 className="font-medium text-blue-800 mb-2">💡 Pendant l'attente :</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Préparez vos questions et le matériel nécessaire</li>
                <li>• Vérifiez votre connexion internet</li>
                <li>• Assurez-vous d'avoir un environnement calme</li>
                <li>• La page se met à jour automatiquement</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
