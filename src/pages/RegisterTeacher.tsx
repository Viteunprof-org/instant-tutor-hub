import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import TeacherTypeStep from '@/components/registration/TeacherTypeStep';
import TeacherBasicInfoStep from '@/components/registration/TeacherBasicInfoStep';
import TeacherSubjectsStep from '@/components/registration/TeacherSubjectsStep';
import TeacherContactStep from '@/components/registration/TeacherContactStep';
import TeacherPasswordStep from '@/components/registration/TeacherPasswordStep';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  // Teacher specific fields
  teacherType?: 'student-teacher' | 'professional-teacher';
  subjects?: { name: string; levels: string[] }[];
  whatsappNumber?: string;
  idDocument?: File | null;
  addressProof?: File | null;
}

export default function RegisterTeacher() {
  const [step, setStep] = useState('teacher-type');
  const [userType] = useState<'teacher'>('teacher');
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    subjects: [],
    whatsappNumber: '',
    idDocument: null,
    addressProof: null,
  });

  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDataChange = (field: string, value: string | { name: string; levels: string[] }[] | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTeacherTypeSelect = (type: 'student-teacher' | 'professional-teacher') => {
    setFormData(prev => ({ ...prev, teacherType: type }));
    setStep('teacher-basic-info');
  };

  const validateBasicInfo = () => {
    return formData.firstName.trim() && 
           formData.lastName.trim() && 
           formData.email.trim() && 
           formData.confirmEmail.trim() &&
           formData.email === formData.confirmEmail &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  };

  const validateTeacherSubjects = () => {
    return formData.subjects && formData.subjects.length > 0 && 
           formData.subjects.every(subject => subject.levels.length > 0);
  };

  const validateTeacherContact = () => {
    return Boolean(formData.whatsappNumber?.trim() && 
                   formData.idDocument && 
                   formData.addressProof);
  };

  const validatePassword = () => {
    const hasMinLength = formData.password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasNumberOrSpecial = /[\d\W]/.test(formData.password);
    const passwordsMatch = formData.password === formData.confirmPassword;
    
    return hasMinLength && hasUpperCase && hasNumberOrSpecial && passwordsMatch;
  };

  const handleSubmit = async () => {
    if (!validatePassword()) {
      toast({
        title: "Erreur",
        description: "Veuillez vérifier les exigences du mot de passe.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare additional data for teacher registration
      const additionalData = {
        phone: formData.whatsappNumber,
        subjects: formData.subjects,
        teacherType: formData.teacherType
      };
      
      await register(formData.email, formData.password, formData.firstName, formData.lastName, 'teacher', undefined, additionalData);
      
      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur ViteUnProf !",
      });
      
      navigate('/teacher/dashboard');
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vup-navy via-primary to-vup-navy flex items-center justify-center p-4">
      {step === 'teacher-type' && (
        <TeacherTypeStep
          onSelectType={handleTeacherTypeSelect}
          onBack={() => navigate('/register')}
        />
      )}
      
      {step === 'teacher-basic-info' && (
        <TeacherBasicInfoStep
          teacherType={formData.teacherType!}
          data={formData}
          onDataChange={handleDataChange}
          onNext={() => setStep('teacher-subjects')}
          onBack={() => setStep('teacher-type')}
          isValid={validateBasicInfo()}
        />
      )}
      
      {step === 'teacher-subjects' && (
        <TeacherSubjectsStep
          data={{
            subjects: formData.subjects || []
          }}
          onDataChange={handleDataChange}
          onNext={() => setStep('teacher-contact')}
          onBack={() => setStep('teacher-basic-info')}
          isValid={validateTeacherSubjects()}
        />
      )}
      
      {step === 'teacher-contact' && (
        <TeacherContactStep
          data={{
            whatsappNumber: formData.whatsappNumber || '',
            idDocument: formData.idDocument || null,
            addressProof: formData.addressProof || null
          }}
          onDataChange={handleDataChange}
          onNext={() => setStep('teacher-password')}
          onBack={() => setStep('teacher-subjects')}
          isValid={validateTeacherContact()}
        />
      )}
      
      {step === 'teacher-password' && (
        <TeacherPasswordStep
          data={{
            password: formData.password,
            confirmPassword: formData.confirmPassword
          }}
          onDataChange={handleDataChange}
          onSubmit={handleSubmit}
          onBack={() => setStep('teacher-contact')}
          isValid={validatePassword()}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}