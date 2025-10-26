export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface InstagramAccount {
  _id: string;
  userId: string;
  username: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
}

export interface Campaign {
  _id: string;
  userId: string;
  instagramAccountId: InstagramAccount | string;
  name: string;
  targetAudience: string;
  message: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
  activatedAt?: string;
}

export interface Lead {
  _id: string;
  campaignId: string;
  username: string;
  displayName: string;
  isDemo: boolean;
  createdAt: string;
}

export interface Message {
  _id: string;
  campaignId: string;
  leadId: Lead | string;
  content: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
  isDemo: boolean;
}

export interface Analytics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalLeads: number;
  totalMessages: number;
  sentMessages: number;
  successRate: number;
  recentCampaigns: Campaign[];
}
