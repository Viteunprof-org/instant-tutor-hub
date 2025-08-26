/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Header } from "@/components/ui/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import OnboardingModal from "@/components/registration/OnboardingModal";
import { useProfileStatus } from "@/hooks/useProfileStatus";
import { BookOpen, Calendar, Star, DollarSign, Users, Bell } from "lucide-react";
import apiService from "@/services/api";
import { useNavigate } from "react-router-dom";

interface Stats {
  totalLessons: number;
  totalEarnings: number;
  averageRating: number;
  totalStudents: number;
}

export default function TeacherDashboard() {
  const { user, isFirstLogin, setIsFirstLogin } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { isVerified } = useProfileStatus();
  const [coursesRequest, setCoursesRequest] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalLessons: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalStudents: 0,
  });
  const [isAccepting, setIsAccepting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isFirstLogin && user?.type === "teacher") {
      setShowOnboarding(true);
    }
  }, [isFirstLogin, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, statsResponse] = await Promise.all([apiService.getCoursesRequest(), apiService.getStatistics()]);

        console.log(coursesResponse);

        if (coursesResponse.success) {
          setCoursesRequest(coursesResponse.data);
        }

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user?.type === "teacher") {
      fetchData();
    }
  }, [user]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setIsFirstLogin(false);
    localStorage.setItem("vup-onboarding-seen", "true");
  };

  const handleAcceptRequest = async (courseId: number) => {
    setIsAccepting(true);
    try {
      const result = await apiService.acceptCourseRequest(courseId);
      console.log(result);
      navigate(`/teacher/zoom-meeting/${courseId}`);
    } catch (error) {
      console.error("Error accepting request:", error);
    } finally {
      setIsAccepting(false);
    }
  };

  const statsCards = [
    { icon: BookOpen, label: "Total cours", value: stats.totalLessons, color: "text-vup-yellow" },
    { icon: DollarSign, label: "Revenus", value: `${stats.totalEarnings}€`, color: "text-green-500" },
    { icon: Star, label: "Note moyenne", value: `${stats.averageRating}/5`, color: "text-yellow-500" },
    { icon: Users, label: "Élèves", value: stats.totalStudents, color: "text-blue-500" },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header isAvailable={isAvailable} onAvailabilityChange={setIsAvailable} isVerified={isVerified} />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bonjour {user?.firstName} ! 👨‍🏫</h1>
            <p className="text-gray-600">Gérez vos cours et aidez vos élèves à réussir</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsCards.map(({ icon: Icon, label, value, color }) => (
              <Card key={label}>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Icon className={`h-6 w-6 ${color} mr-2`} />
                    <div>
                      <p className="text-xs text-gray-600">{label}</p>
                      <p className="text-lg font-bold">{value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Demandes en attente
                  </div>
                  <Badge variant="secondary">{coursesRequest.length}</Badge>
                </CardTitle>
                <CardDescription>Nouvelles demandes de cours à confirmer</CardDescription>
              </CardHeader>
              <CardContent>
                {coursesRequest.length > 0 ? (
                  <div className="space-y-4">
                    {coursesRequest.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{request.matter.name}</h3>
                            <p className="text-sm text-gray-600">avec {request.student.firstName}</p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                        </div>

                        <p className="text-sm text-gray-700 mb-3">{request.description}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Durée: {request.duration} min</span>
                          <Button
                            size="sm"
                            className="bg-vup-yellow text-vup-navy hover:bg-vup-yellow/90"
                            disabled={isAccepting}
                            onClick={() => handleAcceptRequest(request.id)}
                          >
                            {isAccepting ? "En cours..." : "Accepter"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="mx-auto h-12 w-12 mb-4" />
                    <p>Aucune demande en attente</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Today's lessons - Coming soon */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Cours d'aujourd'hui
                </CardTitle>
                <CardDescription>Vos cours programmés pour aujourd'hui</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 mb-4" />
                  <p className="font-semibold mb-2">Fonctionnalité en cours de développement</p>
                  <p className="text-sm">Cette section arrivera très prochainement !</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <OnboardingModal isOpen={showOnboarding} onClose={handleOnboardingComplete} userType="teacher" />
    </>
  );
}
