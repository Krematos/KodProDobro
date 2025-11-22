import type { ReactElement } from 'react';
import { CURRENT_USER } from './constants'; // Imported for badge progress calculation

export interface Organization {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  website: string;
  isCommunityChampion: boolean;
  projectsPosted: number;
}

export interface Project {
  id: string;
  title: string;
  organization: Organization;
  summary: string;
  description: string;
  requiredSkills: string[];
  timeline: string;
  commitment: string;
  deliverables: string[];
  status: 'Open' | 'In Progress' | 'Completed';
  tags: string[];
  impactScore: number;
  highlight?: 'Průkopník' | 'Doporučeno';
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  university: string;
  fieldOfStudy: string;
  skills: string[];
  bio: string;
  portfolio: Project[];
  interests: string[];
  xp: number;
  level: number;
  contributionStreak: number;
  totalImpact: number;
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
