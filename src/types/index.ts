export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: "student" | "teacher" | "professional";
  createdAt: Date;
  creditBalance?: number;
  freeCreditBalance?: number;
  phone?: string;
  school?: string;
  parrentPhone?: string;
  isVerified?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export interface LessonRequest {
  id: string;
  studentId: string;
  subjectId: string;
  duration: number; // in minutes
  description: string;
  urgency: "low" | "medium" | "high";
  status: "pending" | "matched" | "in-progress" | "completed" | "cancelled";
  createdAt: Date;
  scheduledAt?: Date;
  teacherId?: string;
}

export interface Teacher {
  id: string;
  userId: string;
  subjects: string[];
  hourlyRate: number;
  rating: number;
  totalLessons: number;
  school: string;
  description: string;
  isAvailable: boolean;
  languages: string[];
}

export interface Lesson {
  id: string;
  requestId: string;
  studentId: string;
  teacherId: string;
  subjectId: string;
  duration: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  startTime: Date;
  endTime: Date;
  meetingUrl?: string;
  rating?: number;
  feedback?: string;
}

export interface CourseDetails {
  id: number;
  description: string;
  accepted: boolean;
  cancelled: boolean;
  completed: boolean;
  teacherId?: number;
  matter: {
    id: number;
    name: string;
  };
  level: {
    id: number;
    name: string;
  };
  teacher?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  student: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };

  meetingId: number;
  meetingPwd: string;
  duration: number;
  studentSign: string;
  teacherSign: string;
}
