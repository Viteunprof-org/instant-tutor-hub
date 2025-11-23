/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Header } from "@/components/ui/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, BookOpen, Calendar, Plus, Zap, Loader2, AlertCircle, Users, CreditCard, Wallet } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import OnboardingModal from "@/components/registration/OnboardingModal";
import apiService from "@/services/api";

export default function StudentDashboard() {
  const { user, isFirstLogin, setIsFirstLogin } = useAuth();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // États pour les statistiques
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // États pour les cours récents
  const [recentCourses, setRecentCourses] = useState<any>([]);
  const [isLoadingRecentCourses, setIsLoadingRecentCourses] = useState(true);
  const [recentCoursesError, setRecentCoursesError] = useState<string | null>(null);

  // États pour les packs
  const [packs, setPacks] = useState<any[]>([]);
  const [isLoadingPacks, setIsLoadingPacks] = useState(true);
  const [packsError, setPacksError] = useState<string | null>(null);

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

  // Récupérer les packs
  useEffect(() => {
    const fetchPacks = async () => {
      if (!user || user.type !== "student") return;

      try {
        setIsLoadingPacks(true);
        setPacksError(null);
        const response = await apiService.getPacks();

        if (response.success && response.data) {
          setPacks(response.data.slice(0, 3)); // Afficher seulement les 3 premiers packs
        } else {
          setPacksError(response.error || "Erreur lors du chargement des packs");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des packs:", error);
        setPacksError("Erreur lors du chargement des packs");
      } finally {
        setIsLoadingPacks(false);
      }
    };

    fetchPacks();
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

  // Fonction pour gérer l'achat de pack
  const handleBuyPack = (packId: number) => {
    navigate(`/student/payment?packId=${packId}`);
  };

  // Fonction pour prendre un cours (vérifier les crédits)
  const handleTakeCourse = () => {
    if (!user?.creditBalance || user.creditBalance <= 0) {
      // Rediriger vers la page de paiement si pas assez de crédits
      navigate("/student/payment");
    } else {
      // Rediriger vers la demande de cours
      navigate("/student/request-lesson");
    }
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
        {/* Crédits restants - nouvelle carte */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Crédits restants</p>
                <p className="text-2xl font-bold">{user?.creditBalance + user.freeCreditBalance || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
              <Users className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Matières étudiées</p>
                <p className="text-2xl font-bold">{statistics.totalSubjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Rendu des packs
  const renderPacksSection = () => {
    if (isLoadingPacks) {
      return (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Chargement des packs...</span>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (packsError) {
      return (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{packsError}</span>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Recharger vos crédits
            </div>
            <Button variant="outline" onClick={() => navigate("/student/payment")}>
              Voir tous les packs
            </Button>
          </CardTitle>
          <CardDescription>Achetez des crédits pour prendre des cours avec nos professeurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packs.map((pack) => (
              <Card
                key={pack.id}
                className="cursor-pointer transition-all hover:shadow-lg border-2 hover:border-vup-yellow"
                style={{ backgroundColor: pack.backgroundColor || "#f8f9fa" }}
              >
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-2" style={{ color: pack.titleColor || "#333" }}>
                      {pack.name}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: pack.titleColor || "#666" }}>
                      {pack.description}
                    </p>
                    <div className="mb-4">
                      <span className="text-3xl font-bold" style={{ color: pack.titleColor || "#333" }}>
                        {pack.price}€
                      </span>
                      <div className="text-sm mt-1" style={{ color: pack.titleColor || "#666" }}>
                        {pack.nbrCredits} crédit{pack.nbrCredits > 1 ? "s" : ""}
                      </div>
                      {pack.isPack && (
                        <div className="text-xs mt-1 opacity-75" style={{ color: pack.titleColor || "#666" }}>
                          {(pack.price / pack.nbrCredits).toFixed(2)}€ / crédit
                        </div>
                      )}
                    </div>
                    <Button onClick={() => handleBuyPack(pack.id)} className="w-full bg-vup-navy text-white hover:bg-vup-navy/90">
                      Acheter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
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
            <p className="text-gray-600">Prêt pour ton prochain cours ? Trouves un professeur en 30 secondes.</p>
          </div>

          {/* Quick action avec vérification des crédits */}
          <Card className="mb-8 bg-gradient-to-r from-vup-yellow via-yellow-400 to-vup-yellow border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-vup-navy mb-2">Besoin d'aide maintenant ?</h2>
                  <p className="text-vup-navy/80 mb-4">
                    {user?.creditBalance && user.creditBalance > 0
                      ? "Trouves un professeur disponible instantanément"
                      : "Recharges tes crédits pour commencer à prendre des cours"}
                  </p>
                  <Button onClick={handleTakeCourse} className="bg-vup-navy text-white hover:bg-vup-navy/90">
                    <Zap className="mr-2 h-4 w-4" />
                    {user?.creditBalance && user.creditBalance > 0 ? "Prendre un cours maintenant" : "Recharger mes crédits"}
                  </Button>
                </div>
                {user?.creditBalance !== undefined && user.creditBalance <= 0 && (
                  <div className="text-right">
                    <p className="text-vup-navy font-semibold">Crédits: {user.creditBalance}</p>
                    <p className="text-vup-navy/70 text-sm">Recharges pour continuer</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          {renderStatistics()}

          {/* Section packs de crédits */}
          {renderPacksSection()}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming lessons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Cours à venir
                </CardTitle>
                <CardDescription>Tes prochains cours programmés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 mb-4" />
                  <p className="mb-2">Cette fonctionnalité arrive bientôt !</p>
                  <p className="text-sm">Tu pourras prochainement réserver ton cours à l'avance</p>
                  <Button onClick={handleTakeCourse} className="mt-4" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Prendre un cours maintenant
                  </Button>
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
                <CardDescription>Tes derniers cours terminés</CardDescription>
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
                    <Button onClick={handleTakeCourse} className="mt-4" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Prendre ton premier cours
                    </Button>
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
