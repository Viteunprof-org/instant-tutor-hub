import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import WelcomeStep from '@/components/registration/WelcomeStep';
import BasicInfoStep from '@/components/registration/BasicInfoStep';
import AdditionalInfoStep from '@/components/registration/AdditionalInfoStep';
import PasswordStep from '@/components/registration/PasswordStep';
import OnboardingModal from '@/components/registration/OnboardingModal';

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
}

export default function RegisterStudent() {
  const [step, setStep] = useState('welcome');
  const [userType, setUserType] = useState<'student' | 'parent'>('student');
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
  });

  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDataChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUserTypeSelect = (type: 'student' | 'parent') => {
    setUserType(type);
    setStep('basic-info');
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
      
      await register(formData.email, formData.password, firstName, lastName, actualUserType as 'student' | 'teacher', userType as 'student' | 'parent');
      
      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur ViteUnProf !",
      });
      
      // Show onboarding modal for student/parent flows
      setShowOnboarding(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-vup-navy via-primary to-vup-navy flex items-center justify-center p-4">
      {step === 'welcome' && (
        <WelcomeStep onSelectUserType={handleUserTypeSelect} />
      )}
      
      {step === 'basic-info' && (
        <BasicInfoStep
          userType={userType}
          data={formData}
          onDataChange={handleDataChange}
          onNext={() => setStep('additional-info')}
          onBack={() => setStep('welcome')}
          isValid={validateBasicInfo()}
        />
      )}
      
      {step === 'additional-info' && (
        <AdditionalInfoStep
          userType={userType}
          data={formData}
          onDataChange={handleDataChange}
          onNext={() => setStep('password')}
          onBack={() => setStep('basic-info')}
          isValid={validateAdditionalInfo()}
        />
      )}
      
      {step === 'password' && (
        <PasswordStep
          userType={userType}
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
        userType={userType}
      />
    </div>
  );
}