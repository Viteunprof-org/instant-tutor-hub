export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: 'student' | 'teacher';
  parentType?: 'student' | 'parent'; // For students: who registered them
  avatar?: string;
  createdAt: Date;
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
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'matched' | 'in-progress' | 'completed' | 'cancelled';
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
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  startTime: Date;
  endTime: Date;
  meetingUrl?: string;
  rating?: number;
  feedback?: string;
}