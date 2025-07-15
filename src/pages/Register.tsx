import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import WelcomeStep from '@/components/registration/WelcomeStep';
import BasicInfoStep from '@/components/registration/BasicInfoStep';
import AdditionalInfoStep from '@/components/registration/AdditionalInfoStep';
import PasswordStep from '@/components/registration/PasswordStep';
import OnboardingModal from '@/components/registration/OnboardingModal';
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
  grade?: string;
  phone: string;
  sponsorCode: string;
  password: string;
  confirmPassword: string;
  // Parent specific fields
  childFirstName?: string;
  childLastName?: string;
  childGrade?: string;
  // Teacher specific fields
  teacherType?: 'student-teacher' | 'professional-teacher';
  subjects?: string[];
  levels?: string[];
  whatsappNumber?: string;
  idDocument?: File | null;
  addressProof?: File | null;
}

export default function Register() {
  const [searchParams] = useSearchParams();
  const isTeacherFlow = searchParams.get('type') === 'teacher';
  
  const [step, setStep] = useState(isTeacherFlow ? 'teacher-type' : 'welcome');
  const [userType, setUserType] = useState<'student' | 'parent' | 'teacher'>('student');
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    phone: '',
    sponsorCode: '',
    password: '',
    confirmPassword: '',
    subjects: [],
    levels: [],
    whatsappNumber: '',
    idDocument: null,
    addressProof: null,
  });

  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDataChange = (field: string, value: string | string[] | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUserTypeSelect = (type: 'student' | 'parent') => {
    setUserType(type);
    setStep('basic-info');
  };

  const handleTeacherTypeSelect = (type: 'student-teacher' | 'professional-teacher') => {
    setUserType('teacher');
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

  const validateAdditionalInfo = () => {
    if (userType === 'parent') {
      return Boolean(formData.childFirstName?.trim() && 
                    formData.childLastName?.trim() && 
                    formData.childGrade);
    }
    return Boolean(formData.grade);
  };

  const validateTeacherSubjects = () => {
    return formData.subjects && formData.subjects.length > 0 && 
           formData.levels && formData.levels.length > 0;
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
      // For parent type, we create a student account for the child
      const actualUserType = userType === 'parent' ? 'student' : userType;
      const firstName = userType === 'parent' ? formData.childFirstName! : formData.firstName;
      const lastName = userType === 'parent' ? formData.childLastName! : formData.lastName;
      
      await register(formData.email, formData.password, firstName, lastName, actualUserType as 'student' | 'teacher', userType === 'teacher' ? undefined : userType as 'student' | 'parent');
      
      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur ViteUnProf !",
      });
      
      // Show onboarding modal for student/parent flows
      if (userType === 'student' || userType === 'parent') {
        setShowOnboarding(true);
      } else {
        navigate('/teacher/dashboard');
      }
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate('/student/dashboard');
  };

  // Teacher registration flow
  console.log('isTeacherFlow:', isTeacherFlow, 'step:', step);
  
  if (isTeacherFlow) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg">
          <h1>Test Teacher Registration</h1>
          <p>Step: {step}</p>
          <p>isTeacherFlow: {String(isTeacherFlow)}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-vup-navy via-primary to-vup-navy flex items-center justify-center p-4">
      {step === 'welcome' && (
        <WelcomeStep onSelectUserType={handleUserTypeSelect} />
      )}
      
      {step === 'basic-info' && (
        <BasicInfoStep
          userType={userType as 'student' | 'parent'}
          data={formData}
          onDataChange={handleDataChange}
          onNext={() => setStep('additional-info')}
          onBack={() => setStep('welcome')}
          isValid={validateBasicInfo()}
        />
      )}
      
      {step === 'additional-info' && (
        <AdditionalInfoStep
          userType={userType as 'student' | 'parent'}
          data={formData}
          onDataChange={handleDataChange}
          onNext={() => setStep('password')}
          onBack={() => setStep('basic-info')}
          isValid={validateAdditionalInfo()}
        />
      )}
      
      {step === 'password' && (
        <PasswordStep
          userType={userType as 'student' | 'parent'}
          data={formData}
          onDataChange={handleDataChange}
          onSubmit={handleSubmit}
          onBack={() => setStep('additional-info')}
          isValid={validatePassword()}
          isLoading={isLoading}
        />
      )}
      
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingComplete}
        userType={userType as 'student' | 'parent'}
      />
    </div>
  );
}