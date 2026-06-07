export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  description: string;
  brief: string;
  ranking: number;
  documents: string[];
  fee: string;
  deadlines: string;
  website: string;
  rating: number;
  featured?: boolean;
  grantPercent?: number; // 0 to 100%
  minimumIelts?: number; // e.g. 5.5, 6.0, 6.5, 7.0
  minimumGpa?: number;   // 2.0 to 5.0 scale
  minimumSat?: number;   // e.g. 1000 to 1600
}

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  isLoggedIn: boolean;
  isPremium: boolean;
  usageLog: Record<string, string>; // toolKey -> ISO timestamp
}

export interface TestQuestion {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
}

export interface PrepGuide {
  id: string;
  title: string;
  type: 'IELTS' | 'SAT' | 'UZ';
  description: string;
  content: string;
  downloadSize: string;
}

export interface UsageRecord {
  lastUsed: string; // ISO string
}
