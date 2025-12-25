
export interface StudyPlan {
  subject: string;
  duration: string;
  tasks: string[];
  tips: string;
}

export interface WellnessTip {
  category: 'mental' | 'physical' | 'social';
  tip: string;
  action: string;
}

export enum IssueCategory {
  INFRASTRUCTURE = 'Infrastructure',
  ACADEMIC = 'Academic',
  SAFETY = 'Safety',
  ADMINISTRATION = 'Administration',
  SPORTS_CLUBS = 'Sports & Clubs',
  SOCIAL = 'Social'
}

export interface CommunityIssue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  routing: string; // The club or authority it was routed to
  status: 'pending' | 'resolved' | 'in-progress';
  timestamp: number;
}

export interface UserProfile {
  name: string;
  username?: string;
  major: string;
  collegeCampus: string;
  department: string;
  grade: string;
  streak: number;
  lastActiveDate?: string;
}

export interface TodoTask {
  id: string;
  text: string;
  completed: boolean;
  deadline?: string;
}

export type ViewState = 'home' | 'study' | 'issues' | 'wellness' | 'chat' | 'profile' | 'features';
