export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter' | 'student';
  avatar?: string;
}

export interface Student {
  id: string;
  enrollmentNumber: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  branch: string;
  profilePhoto?: string;
  resumeUrl?: string;
  createdAt: Date;
}

export interface Question {
  id: string;
  type: 'mcq' | 'subjective' | 'coding';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  marks: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  questions: Question[];
  recruiterId: string;
  companyName: string;
  createdAt: Date;
  isActive: boolean;
  settings: {
    shuffleQuestions: boolean;
    negativeMarking: boolean;
    proctoringLevel: 'strict' | 'moderate' | 'off';
    allowTabSwitch: boolean;
  };
}

export interface ExamSession {
  id: string;
  testId: string;
  studentId: string;
  startTime: Date;
  endTime?: Date;
  answers: Record<string, any>;
  violations: ProctoringViolation[];
  score?: number;
  status: 'in-progress' | 'completed' | 'terminated';
}

export interface ProctoringViolation {
  id: string;
  type: 'face-not-detected' | 'multiple-faces' | 'tab-switch' | 'voice-detected' | 'suspicious-movement';
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface ExamResult {
  id: string;
  examSessionId: string;
  studentId: string;
  testId: string;
  score: number;
  totalMarks: number;
  percentage: number;
  timeTaken: number; // in minutes
  violations: ProctoringViolation[];
  cheatingProbability: number; // 0-100
  status: 'pass' | 'fail' | 'under-review';
  generatedAt: Date;
  questions: Question[];
  answers: Record<string, any>;
}