import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import TeacherTypeStep from "@/components/registration/TeacherTypeStep";
import TeacherBasicInfoStep from "@/components/registration/TeacherBasicInfoStep";
import TeacherSubjectsStep from "@/components/registration/TeacherSubjectsStep";
import TeacherContactStep from "@/components/registration/TeacherContactStep";
import TeacherPasswordStep from "@/components/registration/TeacherPasswordStep";
import TeacherStripeStep from "@/components/registration/TeacherStripeStep";

interface FileData {
  field: "id" | "home-certificate";
  file: File;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  type: "teacher" | "professional";
  matters: { id: number; levels: number[] }[];
  phone: string;
  iban: string;
  adress: string;
  postalCode: string;
  city: string;
  birthDate?: string;
  school: string;
  files: FileData[];
}

export default function RegisterTeacher() {
  const [step, setStep] = useState("teaching");
  const [userType] = useState<"teacher" | "professional">("teacher");

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    type: "teacher",
    matters: [],
    phone: "",
    iban: "",
    adress: "",
    postalCode: "",
    city: "",
    birthDate: "",
    school: "DEFAULT_SCHOOL", // Replace with actual default school if needed
    files: [],
  });

  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDataChange = (field: string, value: string | { id: number; levels: number[] }[] | FileData[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTeacherTypeSelect = (type: "teacher" | "professional") => {
    setFormData((prev) => ({ ...prev, type: type }));
    setStep("teacher-basic-info");
  };

  const validateBasicInfo = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.confirmEmail.trim() &&
      formData.email === formData.confirmEmail &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    );
  };

  const validateTeacherSubjects = () => {
    console.log("Validating teacher subjects:", formData);
    return formData.matters && formData.matters.length > 0 && formData.matters.every((subject) => subject.levels.length > 0);
  };

  const validateTeacherContact = () => {
    const hasPhone = Boolean(formData.phone?.trim());
    const hasIdDocument = formData.files.some((f) => f.field === "id");
    const hasAddressProof = formData.files.some((f) => f.field === "home-certificate");

    return hasPhone && hasIdDocument && hasAddressProof;
  };

  const validateTeacherStripe = () => {
    return Boolean(
      formData.iban?.trim() && formData.adress?.trim() && formData.postalCode?.trim() && formData.city?.trim() && formData.birthDate?.trim()
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

    try {
      // Prepare additional data for teacher registration
      // const additionalData = {
      //   phone: formData.phone,
      //   matters: formData.matters,
      //   type: formData.type,
      //   iban: formData.iban,
      //   adress: formData.adress,
      //   postalCode: formData.postalCode,
      //   city: formData.city,
      //   birthDate: formData.birthDate,
      //   files: formData.files,
      // };

      console.log("Submitting registration with data:", formData);

      await register(formData);

      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur ViteUnProf !",
      });

      navigate("/teacher/dashboard");
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
      {step === "teaching" && <TeacherTypeStep onSelectType={handleTeacherTypeSelect} onBack={() => navigate("/register")} />}

      {step === "teacher-basic-info" && (
        <TeacherBasicInfoStep
          type={formData.type!}
          data={formData}
          onDataChange={handleDataChange}
          onNext={() => setStep("teacher-matters")}
          onBack={() => setStep("teaching")}
          isValid={validateBasicInfo()}
        />
      )}

      {step === "teacher-matters" && (
        <TeacherSubjectsStep
          data={{
            matters: formData.matters || [],
          }}
          onDataChange={handleDataChange}
          onNext={() => setStep("teacher-contact")}
          onBack={() => setStep("teacher-basic-info")}
          isValid={validateTeacherSubjects()}
        />
      )}

      {step === "teacher-contact" && (
        <TeacherContactStep
          data={{
            phone: formData.phone || "",
            files: formData.files || [],
          }}
          onDataChange={handleDataChange}
          onNext={() => setStep("teacher-stripe")}
          onBack={() => setStep("teacher-matters")}
          isValid={validateTeacherContact()}
        />
      )}

      {step === "teacher-stripe" && (
        <TeacherStripeStep
          data={{
            iban: formData.iban || "",
            adress: formData.adress || "",
            postalCode: formData.postalCode || "",
            city: formData.city || "",
            birthDate: formData.birthDate || "",
          }}
          onDataChange={handleDataChange}
          onNext={() => setStep("teacher-password")}
          onBack={() => setStep("teacher-contact")}
          isValid={validateTeacherStripe()}
        />
      )}

      {step === "teacher-password" && (
        <TeacherPasswordStep
          data={{
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }}
          onDataChange={handleDataChange}
          onSubmit={handleSubmit}
          onBack={() => setStep("teacher-stripe")}
          isValid={validatePassword()}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
