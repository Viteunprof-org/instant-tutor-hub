/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Header } from "@/components/ui/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, BookOpen, Calendar, Plus, Zap, Loader2, AlertCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import OnboardingModal from "@/components/registration/OnboardingModal";
import apiService from "@/services/api";

export default function StudentDashboard() {
  const { user, isFirstLogin, setIsFirstLogin } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // États pour les statistiques
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // États pour les cours récents
  const [recentCourses, setRecentCourses] = useState<any>([]);
  const [isLoadingRecentCourses, setIsLoadingRecentCourses] = useState(true);
  const [recentCoursesError, setRecentCoursesError] = useState<string | null>(null);

  useEffect(() => {
    if (isFirstLogin && user?.type === "student") {
      setShowOnboarding(true);
    }
  }, [isFirstLogin, user]);

  // Récupérer les statistiques
  useEffect(() => {
    const fetchStatistics = async () => {
      if (!user || user.type !== "student") return;

      try {
        setIsLoadingStats(true);
        setStatsError(null);
        const response = await apiService.getStatistics();
        console.log(response);

        if (response.success && response.data) {
          setStatistics(response.data);
        } else {
          setStatsError(response.error || "Erreur lors du chargement des statistiques");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
        setStatsError("Erreur lors du chargement des statistiques");
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStatistics();
  }, [user]);

  // Récupérer les cours récents
  useEffect(() => {
    const fetchRecentCourses = async () => {
      if (!user || user.type !== "student") return;

      try {
        setIsLoadingRecentCourses(true);
        setRecentCoursesError(null);
        const response = await apiService.getRecentCourses();

        if (response.success && response.data) {
          setRecentCourses(response.data);
        } else {
          setRecentCoursesError(response.error || "Erreur lors du chargement des cours récents");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des cours récents:", error);
        setRecentCoursesError("Erreur lors du chargement des cours récents");
      } finally {
        setIsLoadingRecentCourses(false);
      }
    };

    fetchRecentCourses();
  }, [user]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setIsFirstLogin(false);
    localStorage.setItem("vup-onboarding-seen", "true");
  };

  // Fonction pour formater la durée
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? mins + "min" : ""}`;
    }
    return `${mins}min`;
  };

  // Rendu des statistiques
  const renderStatistics = () => {
    if (isLoadingStats) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (statsError) {
      return (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{statsError}</span>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!statistics) {
      return null;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-vup-yellow mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total cours</p>
                <p className="text-2xl font-bold">{statistics.totalCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Temps d'apprentissage</p>
                <p className="text-2xl font-bold">{formatDuration(statistics.totalLearningTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Matières étudiées</p>
                <p className="text-2xl font-bold">{statistics.totalSubjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Attente moyenne</p>
                <p className="text-2xl font-bold">{Math.round(statistics.averageWaitingTime)} min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bonjour {user?.firstName} ! 👋</h1>
            <p className="text-gray-600">Prêt pour votre prochain cours ? Trouvez un professeur en 30 secondes.</p>
          </div>

          {/* Quick action */}
          <Card className="mb-8 bg-gradient-to-r from-vup-yellow via-yellow-400 to-vup-yellow border-0">
            <CardContent className="p-6">
              <div>
                <h2 className="text-2xl font-bold text-vup-navy mb-2">Besoin d'aide maintenant ?</h2>
                <p className="text-vup-navy/80 mb-4">Trouvez un professeur disponible instantanément</p>
                <Link to="/student/request-lesson">
                  <Button className="bg-vup-navy text-white hover:bg-vup-navy/90">
                    <Zap className="mr-2 h-4 w-4" />
                    Prendre un cours maintenant
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          {renderStatistics()}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming lessons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Cours à venir
                </CardTitle>
                <CardDescription>Vos prochains cours programmés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 mb-4" />
                  <p className="mb-2">Cette fonctionnalité arrive bientôt !</p>
                  <p className="text-sm">Vous pourrez prochainement réserver votre cours à l'avance</p>
                  <Link to="/student/request-lesson">
                    <Button className="mt-4" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Prendre un cours maintenant
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent lessons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Cours récents
                </CardTitle>
                <CardDescription>Vos derniers cours terminés</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRecentCourses ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Chargement des cours récents...</span>
                  </div>
                ) : recentCoursesError ? (
                  <div className="text-center py-8 text-red-500">
                    <AlertCircle className="mx-auto h-12 w-12 mb-4" />
                    <p>{recentCoursesError}</p>
                  </div>
                ) : recentCourses.length > 0 ? (
                  <div className="space-y-4">
                    {recentCourses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{course.matter.name}</h3>
                          <p className="text-sm text-gray-600">
                            avec {course.teacher.firstName} {course.teacher.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{new Date(course.createdAt).toLocaleDateString("fr-FR")}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="mb-2">{course.duration} min</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="mx-auto h-12 w-12 mb-4" />
                    <p>Aucun cours terminé</p>
                    <Link to="/student/request-lesson">
                      <Button className="mt-4" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Prendre votre premier cours
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* <OnboardingModal isOpen={showOnboarding} onClose={handleOnboardingComplete} userType={user?.parentType || "student"} /> */}
    </>
  );
}
