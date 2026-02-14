
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
  completed?: boolean;
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
  routing: string;
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
  role?: 'student' | 'faculty';
}

export interface TodoTask {
  id: string;
  text: string;
  completed: boolean;
  deadline?: string;
}

export interface SmartNotification {
  id: string;
  type: 'deadline' | 'productivity' | 'stress' | 'motivation';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: number;
  actionLabel?: string;
  targetView?: ViewState;
  isRead: boolean;
}

export type ViewState = 'home' | 'study' | 'issues' | 'wellness' | 'chat' | 'profile' | 'features' | 'faculty';

export interface FacultyAnalytics {
  activeStudents: number;
  averageStreak: number;
  averageProgress: number;
  hotDoubts: { topic: string; frequency: number; trend: 'up' | 'down' }[];
  issueSummary: Record<IssueCategory, number>;
}
