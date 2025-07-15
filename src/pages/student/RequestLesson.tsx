import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/ui/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Clock, Users, Zap, BookOpen, Upload, X, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const subjects = [
  { id: 'maths', name: 'Mathématiques', icon: '🔢' },
  { id: 'physics', name: 'Physique', icon: '⚡' },
  { id: 'chemistry', name: 'Chimie', icon: '🧪' },
  { id: 'french', name: 'Français', icon: '📝' },
  { id: 'english', name: 'Anglais', icon: '🇬🇧' },
  { id: 'history', name: 'Histoire', icon: '📚' },
  { id: 'philosophy', name: 'Philosophie', icon: '🤔' },
  { id: 'economics', name: 'Économie', icon: '💰' },
];

const durations = [
  { value: '30', label: '30 minutes', price: '15€' },
  { value: '45', label: '45 minutes', price: '22€' },
  { value: '60', label: '1 heure', price: '30€' },
  { value: '90', label: '1h30', price: '45€' },
];

const urgencyLevels = [
  { value: 'low', label: 'Dans la semaine', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Dans 24h', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Maintenant (30 sec)', color: 'bg-red-100 text-red-800' },
];

export default function RequestLesson() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [duration, setDuration] = useState('');
  const [urgency, setUrgency] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB max
    );
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Certains fichiers ont été ignorés",
        description: "Seules les images de moins de 5MB sont acceptées.",
        variant: "destructive"
      });
    }
    
    setUploadedImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUrgencyChange = (value: string) => {
    setUrgency(value);
    // Reset date/time selection when urgency changes
    if (value === 'high') {
      setSelectedDate(undefined);
      setSelectedTime('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Demande de cours envoyée !",
      description: urgency === 'high' 
        ? "Recherche d'un professeur en cours... Vous serez notifié dans 30 secondes."
        : selectedDate 
          ? `Votre cours est programmé pour le ${format(selectedDate, 'PPPP', { locale: fr })} à ${selectedTime}.`
          : "Nous vous contacterons bientôt avec des professeurs disponibles.",
    });

    setIsSubmitting(false);
    navigate('/student/dashboard');
  };

  const selectedDuration = durations.find(d => d.value === duration);
  const selectedUrgencyLevel = urgencyLevels.find(u => u.value === urgency);

  // Generate time slots for appointment scheduling
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Demander un cours
            </h1>
            <p className="text-gray-600">
              Décrivez votre besoin et trouvez le professeur idéal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Subject selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Matière
                </CardTitle>
                <CardDescription>
                  Dans quelle matière avez-vous besoin d'aide ?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {subjects.map((subject) => (
                    <button
                      key={subject.id}
                      type="button"
                      onClick={() => setSelectedSubject(subject.id)}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        selectedSubject === subject.id
                          ? 'border-vup-yellow bg-vup-yellow/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{subject.icon}</div>
                      <div className="text-sm font-medium">{subject.name}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Duration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Durée du cours
                </CardTitle>
                <CardDescription>
                  Combien de temps souhaitez-vous étudier ?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {durations.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDuration(d.value)}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        duration === d.value
                          ? 'border-vup-yellow bg-vup-yellow/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{d.label}</div>
                      <div className="text-sm text-gray-600">{d.price}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Urgency */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Urgence
                </CardTitle>
                <CardDescription>
                  Quand avez-vous besoin de ce cours ?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {urgencyLevels.map((level) => (
                    <div key={level.value}>
                      <button
                        type="button"
                        onClick={() => handleUrgencyChange(level.value)}
                        className={`w-full p-4 border rounded-lg text-left transition-colors ${
                          urgency === level.value
                            ? 'border-vup-yellow bg-vup-yellow/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{level.label}</span>
                          <Badge className={level.color}>
                            {level.value === 'high' && '🚀'}
                            {level.value === 'medium' && '⏰'}
                            {level.value === 'low' && '📅'}
                          </Badge>
                        </div>
                      </button>

                      {/* Date/Time picker - simple style */}
                      {urgency === level.value && (level.value === 'low' || level.value === 'medium') && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="date-picker" className="text-sm font-medium">Date souhaitée</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full max-w-xs justify-start text-left font-normal mt-1",
                                      !selectedDate && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    disabled={(date) => {
                                      const today = new Date();
                                      const maxDate = new Date();
                                      maxDate.setDate(today.getDate() + (urgency === 'medium' ? 1 : 7));
                                      return date < today || date > maxDate;
                                    }}
                                    initialFocus
                                    className={cn("p-3 pointer-events-auto")}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>

                            {selectedDate && (
                              <div>
                                <Label htmlFor="time-picker" className="text-sm font-medium">Heure souhaitée</Label>
                                <Select value={selectedTime} onValueChange={setSelectedTime}>
                                  <SelectTrigger className="w-full max-w-xs mt-1">
                                    <SelectValue placeholder="Sélectionner une heure" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-60">
                                    {timeSlots.map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
                <CardDescription>
                  Décrivez précisément votre besoin et ajoutez des images si nécessaire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Ex: J'ai des difficultés avec les équations du second degré, je prépare un contrôle demain..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />

                {/* Image upload section */}
                <div>
                  <div className="flex items-center space-x-3">
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Label 
                      htmlFor="image-upload" 
                      className="cursor-pointer flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                    >
                      <Upload className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Ajouter des images</span>
                    </Label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 5MB chacune</p>

                  {/* Preview uploaded images */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4">
                      <Label className="mb-2 block">Images ajoutées ({uploadedImages.length})</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {uploadedImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                              {file.name.length > 10 ? `${file.name.substring(0, 10)}...` : file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Summary and submit */}
            {selectedSubject && duration && urgency && (
              <Card className="border-vup-yellow">
                <CardHeader>
                  <CardTitle className="text-vup-navy">Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span>Matière :</span>
                      <span className="font-medium">
                        {subjects.find(s => s.id === selectedSubject)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Durée :</span>
                      <span className="font-medium">{selectedDuration?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prix :</span>
                      <span className="font-medium text-vup-navy">{selectedDuration?.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Urgence :</span>
                      <div className="text-right">
                        <Badge className={selectedUrgencyLevel?.color}>
                          {selectedUrgencyLevel?.label}
                        </Badge>
                        {selectedDate && selectedTime && (
                          <div className="text-sm text-gray-600 mt-1">
                            {format(selectedDate, "PPPP", { locale: fr })} à {selectedTime}
                          </div>
                        )}
                      </div>
                    </div>
                    {uploadedImages.length > 0 && (
                      <div className="flex justify-between">
                        <span>Images :</span>
                        <span className="font-medium">{uploadedImages.length} image(s)</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-vup-yellow text-vup-navy hover:bg-vup-yellow/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Users className="mr-2 h-4 w-4 animate-spin" />
                        Recherche en cours...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Trouver un professeur
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}