import { useState } from 'react';
import { Header } from '@/components/ui/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, BookOpen, Calendar, Plus, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data
const recentLessons = [
  {
    id: '1',
    subject: 'Mathématiques',
    teacher: 'Prof. Martin',
    date: new Date('2024-01-15T14:00:00'),
    duration: 60,
    status: 'completed',
    rating: 5
  },
  {
    id: '2',
    subject: 'Physique',
    teacher: 'Prof. Dubois',
    date: new Date('2024-01-20T16:00:00'),
    duration: 45,
    status: 'completed',
    rating: 4
  },
];

const upcomingLessons = [
  {
    id: '3',
    subject: 'Chimie',
    teacher: 'Prof. Leroy',
    date: new Date('2024-01-25T10:00:00'),
    duration: 60,
    status: 'scheduled'
  }
];

const stats = {
  totalLessons: 12,
  totalHours: 15.5,
  favoriteSubject: 'Mathématiques',
  averageRating: 4.8
};

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour {user?.firstName} ! 👋
          </h1>
          <p className="text-gray-600">
            Prêt pour votre prochain cours ? Trouvez un professeur en 30 secondes.
          </p>
        </div>

        {/* Quick action */}
        <Card className="mb-8 bg-gradient-to-r from-vup-yellow via-yellow-400 to-vup-yellow border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-vup-navy mb-2">
                  Besoin d'aide maintenant ?
                </h2>
                <p className="text-vup-navy/80 mb-4">
                  Trouvez un professeur disponible instantanément
                </p>
                <Link to="/student/request-lesson">
                  <Button className="bg-vup-navy text-white hover:bg-vup-navy/90">
                    <Zap className="mr-2 h-4 w-4" />
                    Prendre un cours maintenant
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="text-6xl">🚀</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-vup-yellow mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total cours</p>
                  <p className="text-2xl font-bold">{stats.totalLessons}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Heures totales</p>
                  <p className="text-2xl font-bold">{stats.totalHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⭐</span>
                <div>
                  <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                  <p className="text-2xl font-bold">{stats.averageRating}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <span className="text-2xl mr-3">📚</span>
                <div>
                  <p className="text-sm font-medium text-gray-600">Matière préférée</p>
                  <p className="text-lg font-bold">{stats.favoriteSubject}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming lessons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Cours à venir
              </CardTitle>
              <CardDescription>
                Vos prochains cours programmés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingLessons.length > 0 ? (
                <div className="space-y-4">
                  {upcomingLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{lesson.subject}</h3>
                        <p className="text-sm text-gray-600">avec {lesson.teacher}</p>
                        <p className="text-sm text-gray-500">
                          {lesson.date.toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {lesson.duration} min
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 mb-4" />
                  <p>Aucun cours programmé</p>
                  <Link to="/student/request-lesson">
                    <Button className="mt-4" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Réserver un cours
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent lessons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Cours récents
              </CardTitle>
              <CardDescription>
                Vos derniers cours terminés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentLessons.length > 0 ? (
                <div className="space-y-4">
                  {recentLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{lesson.subject}</h3>
                        <p className="text-sm text-gray-600">avec {lesson.teacher}</p>
                        <p className="text-sm text-gray-500">
                          {lesson.date.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="mb-2">
                          {lesson.duration} min
                        </Badge>
                        <div className="flex items-center">
                          <span className="text-sm mr-1">{'⭐'.repeat(lesson.rating!)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="mx-auto h-12 w-12 mb-4" />
                  <p>Aucun cours terminé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}