import axios from 'axios';
import type { 
  AuthResponse, 
  InstagramAccount, 
  Campaign, 
  Lead, 
  Message, 
  Analytics 
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post<AuthResponse>('/auth/register', { email, password, name }),
  
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password })
};

// Instagram Accounts
export const instagramAPI = {
  getAccounts: () => 
    api.get<InstagramAccount[]>('/instagram'),
  
  addAccount: (username: string, displayName: string) =>
    api.post<InstagramAccount>('/instagram', { username, displayName }),
  
  deleteAccount: (id: string) =>
    api.delete(`/instagram/${id}`)
};

// Campaigns
export const campaignAPI = {
  getCampaigns: () =>
    api.get<Campaign[]>('/campaigns'),
  
  getCampaign: (id: string) =>
    api.get<Campaign>(`/campaigns/${id}`),
  
  createCampaign: (name: string, instagramAccountId: string, targetAudience: string) =>
    api.post<Campaign>('/campaigns', { name, instagramAccountId, targetAudience }),
  
  activateCampaign: (id: string) =>
    api.post<Campaign>(`/campaigns/${id}/activate`),
  
  pauseCampaign: (id: string) =>
    api.post<Campaign>(`/campaigns/${id}/pause`),
  
  deleteCampaign: (id: string) =>
    api.delete(`/campaigns/${id}`),
  
  getLeads: (campaignId: string) =>
    api.get<Lead[]>(`/campaigns/${campaignId}/leads`),
  
  getMessages: (campaignId: string) =>
    api.get<Message[]>(`/campaigns/${campaignId}/messages`)
};

// Analytics
export const analyticsAPI = {
  getAnalytics: () =>
    api.get<Analytics>('/analytics')
};
