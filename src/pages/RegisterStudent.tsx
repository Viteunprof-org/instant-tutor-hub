// src/pages/RegisterStudent.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import WelcomeStep from "@/components/registration/WelcomeStep";
import BasicInfoStep from "@/components/registration/BasicInfoStep";
import AdditionalInfoStep from "@/components/registration/AdditionalInfoStep";
import PasswordStep from "@/components/registration/PasswordStep";
import OnboardingModal from "@/components/registration/OnboardingModal";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  phone: string;
  parentPhone: string;
  referrer: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterStudent() {
  const [step, setStep] = useState("welcome");
  const [userType, setUserType] = useState<"student" | "parent">("student");
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phone: "",
    parentPhone: "",
    referrer: "",
    password: "",
    confirmPassword: "",
  });

  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDataChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserTypeSelect = (type: "student" | "parent") => {
    setUserType(type);
    console.log("Selected user type:", type);
    setStep("basic-info");
  };

  const validateBasicInfo = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.confirmEmail.trim() &&
      formData.parentPhone.trim() &&
      formData.email === formData.confirmEmail &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    );
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

    if (!formData.parentPhone.trim()) {
      toast({
        title: "Erreur",
        description: "Le numéro de téléphone est requis.",
        variant: "destructive",
      });
      return;
    }

    try {
      let phone = null;
      if (userType === "student") {
        phone = formData.parentPhone;
      }
      console.log(formData);
      const user = {
        ...formData,
        type: "student",
        phone: phone,
        levels: [null],
      };

      await register(user);

      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur ViteUnProf !",
      });

      // Show onboarding modal for student/parent flows
      setShowOnboarding(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.";

      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
      });

      console.error("Registration error:", error);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate("/student/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vup-navy via-primary to-vup-navy flex items-center justify-center p-4">
      {step === "welcome" && <WelcomeStep onSelectUserType={handleUserTypeSelect} />}

      {step === "basic-info" && (
        <BasicInfoStep
          userType={userType}
          data={formData}
          onDataChange={handleDataChange}
          onNext={() => setStep("password")}
          onBack={() => setStep("welcome")}
          isValid={validateBasicInfo()}
        />
      )}

      {/* {step === "additional-info" && (
        <AdditionalInfoStep
          userType={userType}
          data={formData}
          onDataChange={handleDataChange}
          onNext={() => setStep("password")}
          onBack={() => setStep("basic-info")}
          isValid={validateAdditionalInfo()}
        />
      )} */}

      {step === "password" && (
        <PasswordStep
          userType={userType}
          data={formData}
          onDataChange={handleDataChange}
          onSubmit={handleSubmit}
          onBack={() => setStep("basic-info")}
          isValid={validatePassword()}
          isLoading={isLoading}
        />
      )}

      <OnboardingModal isOpen={showOnboarding} onClose={handleOnboardingComplete} userType={userType} />
    </div>
  );
}
