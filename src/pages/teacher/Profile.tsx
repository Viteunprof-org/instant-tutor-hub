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
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// Available subjects and levels
const AVAILABLE_SUBJECTS = [
  'Mathématiques', 'Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien',
  'Physique', 'Chimie', 'SVT', 'Histoire', 'Géographie', 'Philosophie',
  'Économie', 'Informatique', 'Arts plastiques', 'Musique', 'Sport'
];

const AVAILABLE_LEVELS = [
  'CP', 'CE1', 'CE2', 'CM1', 'CM2', 
  '6ème', '5ème', '4ème', '3ème', 
  '2nde', '1ère', 'Terminale', 
  'BTS', 'Licence', 'Master'
];

// Mock teacher profile data
const mockTeacherProfile = {
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@email.com',
  phone: '+33 6 12 34 56 78',
  subjects: [
    { name: 'Mathématiques', levels: ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'] },
    { name: 'Physique', levels: ['2nde', '1ère', 'Terminale'] },
    { name: 'Chimie', levels: ['2nde', '1ère', 'Terminale'] }
  ],
  education: 'Master en Mathématiques Appliquées',
  school: 'École Polytechnique',
  experience: '5 ans d\'expérience en cours particuliers',
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
                  Les matières que vous enseignez et leurs niveaux
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    {editedProfile.subjects.map((subject, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <Select 
                            value={subject.name} 
                            onValueChange={(value) => {
                              const newSubjects = [...editedProfile.subjects];
                              newSubjects[index] = { ...subject, name: value };
                              setEditedProfile(prev => ({ ...prev, subjects: newSubjects }));
                            }}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Choisir une matière" />
                            </SelectTrigger>
                            <SelectContent>
                              {AVAILABLE_SUBJECTS.map(subj => (
                                <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const newSubjects = editedProfile.subjects.filter((_, i) => i !== index);
                              setEditedProfile(prev => ({ ...prev, subjects: newSubjects }));
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Niveaux enseignés</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {AVAILABLE_LEVELS.map(level => (
                              <div key={level} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`${index}-${level}`}
                                  checked={subject.levels.includes(level)}
                                  onCheckedChange={(checked) => {
                                    const newSubjects = [...editedProfile.subjects];
                                    if (checked) {
                                      newSubjects[index] = { 
                                        ...subject, 
                                        levels: [...subject.levels, level] 
                                      };
                                    } else {
                                      newSubjects[index] = { 
                                        ...subject, 
                                        levels: subject.levels.filter(l => l !== level) 
                                      };
                                    }
                                    setEditedProfile(prev => ({ ...prev, subjects: newSubjects }));
                                  }}
                                />
                                <Label htmlFor={`${index}-${level}`} className="text-xs">
                                  {level}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const newSubjects = [...editedProfile.subjects, { name: '', levels: [] }];
                        setEditedProfile(prev => ({ ...prev, subjects: newSubjects }));
                      }}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter une matière
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center mb-4">
                      <BookOpen className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">
                        Les matières que vous enseignez et leurs niveaux
                      </span>
                    </div>
                    
                    {profile.subjects.map((subject, index) => (
                      <div key={index} className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {subject.levels.map(level => (
                            <Badge 
                              key={level} 
                              variant="outline" 
                              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 border-gray-300"
                            >
                              {level}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    
                    <p className="text-xs text-gray-500 mb-3">
                      Numéro: <span className="font-medium">{profile.whatsAppNumber}</span>
                    </p>
                    
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