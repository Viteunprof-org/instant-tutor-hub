import { useState, useEffect } from 'react';
import { Header } from '@/components/ui/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingModal from '@/components/registration/OnboardingModal';
import { ProfileCompletionBanner } from '@/components/ProfileCompletionBanner';
import { useProfileStatus } from '@/hooks/useProfileStatus';
import { 
  BookOpen, 
  Calendar, 
  Star, 
  DollarSign, 
  Users, 
  TrendingUp,
  Bell,
  CheckCircle2
} from 'lucide-react';

// Mock data
const todaysLessons = [
  {
    id: '1',
    subject: 'Mathématiques',
    student: 'Alice Martin',
    time: '14:00',
    duration: 60,
    status: 'confirmed',
    studentLevel: 'Terminale S'
  },
  {
    id: '2',
    subject: 'Physique',
    student: 'Thomas Dubois',
    time: '16:30',
    duration: 45,
    status: 'pending',
    studentLevel: '1ère S'
  },
];

const pendingRequests = [
  {
    id: '3',
    subject: 'Mathématiques',
    student: 'Marie Leroy',
    requestedTime: 'Maintenant',
    duration: 45,
    description: 'Aide pour résoudre des équations du second degré',
    urgency: 'high'
  },
  {
    id: '4',
    subject: 'Chimie',
    student: 'Paul Bernard',
    requestedTime: 'Ce soir',
    duration: 60,
    description: 'Préparation contrôle sur les réactions chimiques',
    urgency: 'medium'
  },
];

const stats = {
  totalLessons: 127,
  totalEarnings: 2850,
  averageRating: 4.9,
  totalStudents: 43,
  thisWeekLessons: 8,
  completionRate: 98
};

export default function TeacherDashboard() {
  const { user, isFirstLogin, setIsFirstLogin } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { isVerified } = useProfileStatus();

  useEffect(() => {
    if (isFirstLogin && user?.type === 'teacher') {
      setShowOnboarding(true);
    }
  }, [isFirstLogin, user]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setIsFirstLogin(false);
    localStorage.setItem('vup-onboarding-seen', 'true');
  };

  const handleAcceptRequest = (requestId: string) => {
    // Handle accept logic
    console.log('Accepting request:', requestId);
  };

  const handleDeclineRequest = (requestId: string) => {
    // Handle decline logic
    console.log('Declining request:', requestId);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header 
          isAvailable={isAvailable} 
          onAvailabilityChange={setIsAvailable}
          isVerified={isVerified}
        />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bonjour {user?.firstName} ! 👨‍🏫
            </h1>
            <p className="text-gray-600">
              Gérez vos cours et aidez vos élèves à réussir
            </p>
          </div>
        </div>

        {/* Profile completion banner */}
        <ProfileCompletionBanner />

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-vup-yellow mr-2" />
                <div>
                  <p className="text-xs text-gray-600">Total cours</p>
                  <p className="text-lg font-bold">{stats.totalLessons}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-green-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-600">Revenus</p>
                  <p className="text-lg font-bold">{stats.totalEarnings}€</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Star className="h-6 w-6 text-yellow-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-600">Note moyenne</p>
                  <p className="text-lg font-bold">{stats.averageRating}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-600">Élèves</p>
                  <p className="text-lg font-bold">{stats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-purple-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-600">Cette semaine</p>
                  <p className="text-lg font-bold">{stats.thisWeekLessons}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-600 mr-2" />
                <div>
                  <p className="text-xs text-gray-600">Taux réussite</p>
                  <p className="text-lg font-bold">{stats.completionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                <Badge variant="secondary">{pendingRequests.length}</Badge>
              </CardTitle>
              <CardDescription>
                Nouvelles demandes de cours à confirmer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{request.subject}</h3>
                          <p className="text-sm text-gray-600">avec {request.student}</p>
                        </div>
                        <Badge 
                          className={
                            request.urgency === 'high' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {request.requestedTime}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">
                        {request.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Durée: {request.duration} min
                        </span>
                        <div className="space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeclineRequest(request.id)}
                          >
                            Décliner
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-vup-yellow text-vup-navy hover:bg-vup-yellow/90"
                            onClick={() => handleAcceptRequest(request.id)}
                          >
                            Accepter
                          </Button>
                        </div>
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

          {/* Today's lessons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Cours d'aujourd'hui
              </CardTitle>
              <CardDescription>
                Vos cours programmés pour aujourd'hui
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todaysLessons.length > 0 ? (
                <div className="space-y-4">
                  {todaysLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{lesson.subject}</h3>
                        <p className="text-sm text-gray-600">avec {lesson.student}</p>
                        <p className="text-sm text-gray-500">
                          {lesson.time} • {lesson.duration} min • {lesson.studentLevel}
                        </p>
                      </div>
                      <Badge 
                        variant={lesson.status === 'confirmed' ? 'default' : 'secondary'}
                      >
                        {lesson.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 mb-4" />
                  <p>Aucun cours aujourd'hui</p>
                  <p className="text-sm">Profitez de votre journée libre !</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    
    <OnboardingModal
      isOpen={showOnboarding}
      onClose={handleOnboardingComplete}
      userType="teacher"
    />
    </>
  );
}