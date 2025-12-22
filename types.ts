
export enum PlanType {
  FREE = 'FREE',
  PRO = 'PRO',
  ULTRA = 'ULTRA',
  UNLIMITED = 'UNLIMITED'
}

export interface WritingStyle {
  id: string;
  name: string;
  sourceType: 'text' | 'url';
  content: string; // The URL or the Text snippet
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: PlanType;
  wordsUsedToday: number;
  wordLimit: number;
  writingStyles?: WritingStyle[];
  role?: 'user' | 'admin';
  status?: 'active' | 'suspended';
  joinedDate?: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  originalText: string;
  humanizedText: string;
  tone: string;
  wordCount: number;
}

export enum Tone {
  STANDARD = 'Standard',
  PROFESSIONAL = 'Professional',
  CONVERSATIONAL = 'Conversational',
  SIMPLE = 'Simple',
  ACADEMIC = 'Academic'
}

export interface RewritingConfig {
  tone: Tone;
  mode: 'humanize' | 'shorten' | 'expand' | 'simplify';
}

// Admin Types

export interface Invoice {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  date: string;
  status: 'paid' | 'refunded' | 'pending';
  plan: PlanType;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// Added Ticket interface for admin support dashboard
export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  lastMessage: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'closed';
}

export interface SystemLog {
  id: string;
  action: string;
  adminId: string; // or 'system'
  details: string;
  date: string;
  ip?: string;
  severity: 'info' | 'warning' | 'error';
}

export interface SystemConfig {
  maintenanceMode: boolean;
  allowSignups: boolean;
  featureFlags: {
    betaFeatures: boolean;
    newUI: boolean;
  };
  emailSettings: {
    welcomeEmail: boolean;
    marketingEmails: boolean;
  };
}
