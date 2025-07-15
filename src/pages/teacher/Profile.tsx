import { useState } from 'react';
import { Header } from '@/components/ui/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User,
  MessageSquare,
  Shield,
  GraduationCap,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  Edit,
  Save,
  X
} from 'lucide-react';

// Mock teacher profile data
const mockTeacherProfile = {
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@email.com',
  phone: '+33 6 12 34 56 78',
  subjects: ['Mathématiques', 'Physique', 'Chimie'],
  education: 'Master en Mathématiques Appliquées',
  school: 'École Polytechnique',
  experience: '5 ans d\'expérience en cours particuliers',
  hourlyRate: 25,
  biography: 'Professeur passionné avec 5 ans d\'expérience dans l\'enseignement des mathématiques et des sciences. J\'adapte mes méthodes pédagogiques aux besoins de chaque élève pour assurer leur réussite.',
  isVerified: true,
  isWhatsAppConnected: true,
  verificationDate: '2025-01-15',
  whatsAppNumber: '+33 6 12 34 56 78'
};

export default function TeacherProfile() {
  const [profile, setProfile] = useState(mockTeacherProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(mockTeacherProfile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleWhatsAppToggle = () => {
    // Toggle WhatsApp connection
    setProfile(prev => ({
      ...prev,
      isWhatsAppConnected: !prev.isWhatsAppConnected
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Mon Profil
              </h1>
              <p className="text-gray-600">
                Gérez vos informations personnelles et vos paramètres
              </p>
            </div>
            
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="flex items-center"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleSave}
                    className="flex items-center bg-vup-yellow text-vup-navy hover:bg-vup-yellow/90"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center bg-vup-yellow text-vup-navy hover:bg-vup-yellow/90"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations personnelles */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Vos informations de base et contact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editedProfile.firstName}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, firstName: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{profile.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editedProfile.lastName}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, lastName: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{profile.lastName}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{profile.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{profile.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="hourlyRate">Tarif horaire (€)</Label>
                    {isEditing ? (
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={editedProfile.hourlyRate}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{profile.hourlyRate}€/h</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formation et expérience */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Formation et expérience
                </CardTitle>
                <CardDescription>
                  Votre parcours académique et professionnel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="education">Formation</Label>
                    {isEditing ? (
                      <Input
                        id="education"
                        value={editedProfile.education}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, education: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{profile.education}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="school">École</Label>
                    {isEditing ? (
                      <Input
                        id="school"
                        value={editedProfile.school}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, school: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{profile.school}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="experience">Expérience</Label>
                    {isEditing ? (
                      <Input
                        id="experience"
                        value={editedProfile.experience}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, experience: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{profile.experience}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Matières enseignées */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Matières enseignées
                </CardTitle>
                <CardDescription>
                  Les matières que vous enseignez
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.subjects.map((subject, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Biographie */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Biographie
                </CardTitle>
                <CardDescription>
                  Présentez-vous à vos futurs élèves
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedProfile.biography}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, biography: e.target.value }))}
                    placeholder="Décrivez votre approche pédagogique..."
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {profile.biography}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Statut et paramètres */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Statut de vérification
                </CardTitle>
                <CardDescription>
                  Votre statut de validation et notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Profil vérifié</span>
                    <div className="flex items-center">
                      {profile.isVerified ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <Badge className="bg-green-100 text-green-800">Vérifié</Badge>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                          <Badge variant="secondary">En attente</Badge>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {profile.isVerified && (
                    <p className="text-xs text-gray-500">
                      Vérifié le {new Date(profile.verificationDate).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Notifications WhatsApp</span>
                      <div className="flex items-center">
                        {profile.isWhatsAppConnected ? (
                          <>
                            <MessageSquare className="h-4 w-4 text-green-500 mr-2" />
                            <Badge className="bg-green-100 text-green-800">Connecté</Badge>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="h-4 w-4 text-gray-400 mr-2" />
                            <Badge variant="secondary">Non connecté</Badge>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-3">
                      Recevez les notifications de nouveaux cours directement sur WhatsApp
                    </p>
                    
                    {profile.isWhatsAppConnected && (
                      <p className="text-xs text-gray-500 mb-3">
                        Numéro: {profile.whatsAppNumber}
                      </p>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleWhatsAppToggle}
                      className="w-full"
                    >
                      {profile.isWhatsAppConnected ? 'Déconnecter' : 'Connecter'} WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}