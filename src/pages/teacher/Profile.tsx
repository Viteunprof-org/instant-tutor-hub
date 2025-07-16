import { useState, useMemo } from 'react';
import { Header } from '@/components/ui/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
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
  Trash2,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// Available subjects and levels
const AVAILABLE_SUBJECTS = [
  'Mathématiques', 'Français', 'Anglais', 'Espagnol', 'Allemand',
  'Histoire-Géographie', 'Sciences Physiques', 'SVT', 'Philosophie',
  'Économie', 'Informatique', 'Arts plastiques', 'Musique', 'EPS'
];

const AVAILABLE_LEVELS = [
  '6ème', '5ème', '4ème', '3ème', 'Seconde', 'Première', 'Terminale'
];

// Function to calculate profile completion percentage
const calculateProfileCompletion = (user: any) => {
  const fields = [
    { key: 'firstName', weight: 5 },
    { key: 'lastName', weight: 5 },
    { key: 'email', weight: 5 },
    { key: 'phone', weight: 10 },
    { key: 'school', weight: 15 },
    { key: 'graduationYear', weight: 10 },
    { key: 'subjects', weight: 25, isArray: true },
    { key: 'biography', weight: 15 },
    { key: 'experience', weight: 10 }
  ];

  let totalWeight = 0;
  let completedWeight = 0;

  fields.forEach(field => {
    totalWeight += field.weight;
    const value = user[field.key];
    
    if (field.isArray) {
      if (value && Array.isArray(value) && value.length > 0) {
        completedWeight += field.weight;
      }
    } else {
      if (value && value.trim() !== '') {
        completedWeight += field.weight;
      }
    }
  });

  return Math.round((completedWeight / totalWeight) * 100);
};

// Get missing fields for recommendations
const getMissingFields = (user: any) => {
  const missing = [];
  
  if (!user.phone) missing.push('Numéro de téléphone');
  if (!user.school) missing.push('École/Université');
  if (!user.graduationYear) missing.push('Année de diplôme');
  if (!user.subjects || user.subjects.length === 0) missing.push('Matières enseignées');
  if (!user.biography) missing.push('Biographie');
  if (!user.experience) missing.push('Expérience professionnelle');
  
  return missing;
};

export default function TeacherProfile() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [editedProfile, setEditedProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    school: user?.school || '',
    graduationYear: user?.graduationYear || '',
    subjects: user?.subjects || [],
    biography: user?.biography || '',
    experience: user?.experience || '',
    education: user?.education || '',
    whatsappNumber: user?.whatsappNumber || '',
    isVerified: user?.isVerified || false,
    verificationDate: user?.verificationDate || ''
  });

  const completionPercentage = useMemo(() => calculateProfileCompletion(user), [user]);
  const missingFields = useMemo(() => getMissingFields(user), [user]);

  const handleSave = () => {
    // Update user context with new data
    if (user) {
      const updatedUser = { ...user, ...editedProfile };
      setUser(updatedUser);
      localStorage.setItem('vup-user', JSON.stringify(updatedUser));
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      school: user?.school || '',
      graduationYear: user?.graduationYear || '',
      subjects: user?.subjects || [],
      biography: user?.biography || '',
      experience: user?.experience || '',
      education: user?.education || '',
      whatsappNumber: user?.whatsappNumber || '',
      isVerified: user?.isVerified || false,
      verificationDate: user?.verificationDate || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isAvailable={isAvailable} 
        onAvailabilityChange={setIsAvailable} 
      />
      
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
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile completion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Complétude du profil
                </CardTitle>
                <CardDescription>
                  Complétez votre profil pour attirer plus d'élèves
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progression</span>
                    <span className="text-sm text-vup-navy font-semibold">{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="w-full" />
                  
                  {missingFields.length > 0 && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-semibold text-amber-800 mb-2">
                            Améliorez votre profil
                          </h4>
                          <p className="text-sm text-amber-700 mb-2">
                            Complétez ces informations pour attirer plus d'élèves :
                          </p>
                          <ul className="text-sm text-amber-700 space-y-1">
                            {missingFields.map((field, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-1 h-1 bg-amber-500 rounded-full mr-2"></span>
                                {field}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personal information */}
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
                    <Label htmlFor="firstName">Prénom *</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editedProfile.firstName}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, firstName: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{user.firstName || 'Non renseigné'}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editedProfile.lastName}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, lastName: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{user.lastName || 'Non renseigné'}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{user.email || 'Non renseigné'}</p>
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
                        placeholder="+33 6 12 34 56 78"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{user.phone || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="school">École/Université</Label>
                    {isEditing ? (
                      <Input
                        id="school"
                        value={editedProfile.school}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, school: e.target.value }))}
                        className="mt-1"
                        placeholder="École Polytechnique"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{user.school || 'Non renseigné'}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="graduationYear">Année de diplôme</Label>
                    {isEditing ? (
                      <Input
                        id="graduationYear"
                        value={editedProfile.graduationYear}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, graduationYear: e.target.value }))}
                        className="mt-1"
                        placeholder="2020"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{user.graduationYear || 'Non renseigné'}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="education">Formation/Diplôme</Label>
                    {isEditing ? (
                      <Input
                        id="education"
                        value={editedProfile.education}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, education: e.target.value }))}
                        className="mt-1"
                        placeholder="Master en Mathématiques Appliquées"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{user.education || 'Non renseigné'}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="experience">Expérience professionnelle</Label>
                    {isEditing ? (
                      <Textarea
                        id="experience"
                        value={editedProfile.experience}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, experience: e.target.value }))}
                        className="mt-1"
                        placeholder="5 ans d'expérience en cours particuliers..."
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{user.experience || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subjects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Matières enseignées
                </CardTitle>
                <CardDescription>
                  Les matières et niveaux que vous enseignez
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
                          <div className="grid grid-cols-2 gap-2">
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
                  <div className="space-y-4">
                    {user.subjects && user.subjects.length > 0 ? (
                      user.subjects.map((subject, index) => (
                        <div key={index} className="space-y-2">
                          <h3 className="text-base font-semibold text-gray-900">{subject.name}</h3>
                          <div className="flex flex-wrap gap-2">
                            {subject.levels.map(level => (
                              <Badge 
                                key={level} 
                                variant="outline" 
                                className="px-2 py-1 text-xs bg-blue-50 border-blue-300 text-blue-700"
                              >
                                {level}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">Aucune matière renseignée</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Biography */}
            <Card>
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
                    placeholder="Décrivez votre approche pédagogique, votre expérience et ce qui vous passionne dans l'enseignement..."
                    className="min-h-[120px]"
                  />
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {user.biography || 'Aucune biographie renseignée'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Statut de vérification
                </CardTitle>
                <CardDescription>
                  Votre statut de validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Profil vérifié</span>
                    <div className="flex items-center">
                      {user.isVerified ? (
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
                  
                  {user.isVerified && user.verificationDate && (
                    <p className="text-xs text-gray-500">
                      Vérifié le {new Date(user.verificationDate).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                  
                  {!user.isVerified && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-700">
                        {completionPercentage === 100 
                          ? "Profil en cours de validation" 
                          : "Complétez votre profil pour accélérer la vérification"
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">WhatsApp</span>
                    <Badge variant="secondary">Bientôt disponible</Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    Recevez les notifications de nouveaux cours directement sur WhatsApp
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}