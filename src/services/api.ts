/* eslint-disable @typescript-eslint/no-explicit-any */

import { PaymentSheetRequest, PaymentSheetResponse } from "@/types/stripe";

// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface RegisterStudentRequest {
  firstName: string;
  lastName: string;
  type: "student";
  email: string;
  password: string;
  phone: string;
  parentPhone: string;
  referrer?: string | null;
  levels?: number[]; // Ajouté pour les niveaux scolaires
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem("vup-token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Inscription étudiant
  async registerStudent(data: RegisterStudentRequest): Promise<ApiResponse<any>> {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Connexion
  async login(data: LoginRequest): Promise<ApiResponse<any>> {
    return this.request("/auth/signin", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Récupérer le profil utilisateur
  async getProfile(): Promise<ApiResponse<any>> {
    return this.request("/users/current");
  }

  // Déconnexion
  async logout(): Promise<void> {
    try {
      await this.request("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  async getMatters(): Promise<ApiResponse<any>> {
    console.log("Fetching matters from API");
    return this.request("/matter/matters");
  }

  async getLevels(): Promise<ApiResponse<any>> {
    return this.request("/matter/levels");
  }

  async getCoursesRequest(): Promise<ApiResponse<any>> {
    return this.request(`/courses/course-requests`);
  }

  async getPacks(): Promise<ApiResponse<any>> {
    return this.request(`/credit/packs`);
  }

  async getStatistics(): Promise<ApiResponse<any>> {
    console.log("API call : getStatistics");
    return this.request(`/courses/dashboard/statistics`);
  }

  // Récupérer les cours récents de l'étudiant
  async getRecentCourses(): Promise<ApiResponse<ApiResponse<any>>> {
    return this.request(`/courses/student/recent-courses`);
  }

  async askForCourseRequest(data: any): Promise<ApiResponse<any>> {
    return this.request(`/courses/course-request`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCourseById(courseId: number): Promise<ApiResponse<any>> {
    return this.request(`/courses/${courseId}`);
  }

  async acceptCourseRequest(courseId: number): Promise<ApiResponse<any>> {
    return this.request(`/courses/accept-course-request/${courseId}`, {
      method: "POST",
    });
  }

  async createPaymentSheet(data: PaymentSheetRequest): Promise<ApiResponse<any>> {
    return this.request("/stripe/payment-sheet", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getPaymentMethods(): Promise<ApiResponse<any>> {
    return this.request("/stripe/payment-methods");
  }

  async endCourse(courseId: number): Promise<ApiResponse<any>> {
    return this.request(`/courses/end-course/${courseId}`);
  }

  async cancelCourse(courseId: number): Promise<ApiResponse<any>> {
    return this.request(`/courses/cancel-course/${courseId}`);
  }

  async uploadFile(file: File, field: string, courseId?: number): Promise<ApiResponse<any>> {
    const user = localStorage.getItem("vup-user");

    console.log("Uploading file:", {
      fileName: file.name,
      field,
      user,
      courseId,
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", field);
    formData.append("user", user || "");
    formData.append("courseId", courseId?.toString() || "");

    const url = `${API_BASE_URL}/file/upload`;

    // Headers séparés pour FormData (pas de Content-Type)
    const headers: Record<string, string> = {};
    const token = localStorage.getItem("vup-token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error("File upload failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Upload failed" };
    }
  }

  async getDiscount(code: string): Promise<ApiResponse<any>> {
    return this.request(`/discount/${code}`);
  }
}

// Créer une instance unique
const apiService = new ApiService();

// Exports
export { apiService };
export default apiService;
