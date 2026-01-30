import type { ReactElement } from 'react';
// import { CURRENT_USER } from './constants'; // Removing constant import to avoid confusion

export interface Organization {
  id: string | number;
  name: string;
  logoUrl?: string;
  description?: string;
  website?: string;
  isCommunityChampion?: boolean;
  projectsPosted?: number;
  // Backend specific fields
  email?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface Project {
  id: string | number;
  title?: string; // Backend uses 'name'
  name: string;   // Backend field
  organization: Organization; // Mapped from 'owner'
  summary?: string;
  description: string;
  requiredSkills?: string[];
  timeline?: string;
  commitment?: string;
  deliverables?: string[];
  status?: 'Open' | 'In Progress' | 'Completed';
  tags?: string[];
  impactScore?: number;
  highlight?: 'First Mover' | 'Featured';
  createdAt?: string;
}

export interface User {
  id: string | number;
  name?: string; // Backend splits this
  username: string; // Backend field
  firstName?: string; // Backend field
  lastName?: string; // Backend field
  email: string; // Backend field
  role?: string; // Backend field
  avatarUrl?: string;
  university?: string;
  fieldOfStudy?: string;
  skills?: string[];
  bio?: string;
  portfolio?: Project[];
  interests?: string[];
  xp?: number;
  level?: number;
  contributionStreak?: number;
  totalImpact?: number;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'other';
  text: string;
  timestamp: string;
  avatar: string;
}

export interface ChatConversation {
  id: string;
  organization: Organization;
  projectTitle: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}


export interface AIBadge {
  name: string;
  description: string;
  icon: ReactElement;
  // Progress function to calculate completion towards earning the badge
  progress: (user: User) => { current: number; target: number };
}

// Password Reset Types
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
