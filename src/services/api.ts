import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useAppStore } from '../store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProfileAnalysisRequest {
  instagram_url: string;
  detailed_analysis?: boolean;
}

export interface ProfileAnalysisResponse {
  profile_id: string;
  name: string;
  age?: number;
  location?: string;
  compatibility_score: number;
  photos: string[];
  bio?: string;
  interests: string[];
  lifestyle_analysis: {
    activity_level: string;
    social_preferences: string;
    values: string[];
  };
  compatibility_details: {
    score_breakdown: Record<string, number>;
    reasons: string[];
    concerns: string[];
  };
}

export interface MessageGenerationRequest {
  conversation_id: string;
  context: string;
  message_type: 'opener' | 'follow_up' | 'opportunity_response';
  tone: 'casual' | 'flirty' | 'friendly' | 'humorous';
}

export interface MessageGenerationResponse {
  variants: Array<{
    content: string;
    confidence: number;
    tone: string;
    reasoning: string;
  }>;
  context_analysis: {
    mood: string;
    engagement_level: string;
    suggested_timing: string;
  };
}

export interface OpportunityDetectionRequest {
  conversation_id: string;
  recent_activity: any[];
}

export interface OpportunityDetectionResponse {
  opportunities: Array<{
    type: string;
    description: string;
    confidence: number;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    suggested_response: string;
    timing_recommendation: string;
  }>;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      (error) => {
        const store = useAppStore.getState();
        
        if (error.response?.status === 401) {
          // Handle auth errors
          localStorage.removeItem('auth_token');
          store.setConnectionStatus(false);
        } else if (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR') {
          // Handle network errors
          store.setSystemStatus('offline');
          store.addNotification({
            type: 'error',
            title: 'Connection Error',
            message: 'Unable to connect to the server. Please check your internet connection.',
          });
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Profile Analysis
  async analyzeProfile(request: ProfileAnalysisRequest): Promise<ProfileAnalysisResponse> {
    try {
      const response = await this.api.post<ApiResponse<ProfileAnalysisResponse>>(
        '/api/profiles/analyze',
        request
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Profile analysis failed');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Profile analysis error:', error);
      throw error;
    }
  }

  // Conversation Management
  async getConversations(): Promise<any[]> {
    try {
      const response = await this.api.get<ApiResponse<any[]>>('/api/conversations');
      return response.data.data || [];
    } catch (error) {
      console.error('Get conversations error:', error);
      return [];
    }
  }

  async getConversationHistory(conversationId: string): Promise<any[]> {
    try {
      const response = await this.api.get<ApiResponse<any[]>>(
        `/api/conversations/${conversationId}/messages`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Get conversation history error:', error);
      return [];
    }
  }

  // Message Generation
  async generateMessage(request: MessageGenerationRequest): Promise<MessageGenerationResponse> {
    try {
      const response = await this.api.post<ApiResponse<MessageGenerationResponse>>(
        '/api/messages/generate',
        request
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Message generation failed');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Message generation error:', error);
      throw error;
    }
  }

  async sendMessage(conversationId: string, content: string): Promise<void> {
    try {
      const response = await this.api.post<ApiResponse>(
        '/api/messages/send',
        { conversation_id: conversationId, content }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Message send failed');
      }
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  // Opportunity Detection
  async detectOpportunities(request: OpportunityDetectionRequest): Promise<OpportunityDetectionResponse> {
    try {
      const response = await this.api.post<ApiResponse<OpportunityDetectionResponse>>(
        '/api/opportunities/detect',
        request
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Opportunity detection failed');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Opportunity detection error:', error);
      throw error;
    }
  }

  // Analytics
  async getAnalytics(timeframe: string): Promise<any> {
    try {
      const response = await this.api.get<ApiResponse<any>>(
        `/api/analytics?timeframe=${timeframe}`
      );
      return response.data.data || {};
    } catch (error) {
      console.error('Get analytics error:', error);
      return {};
    }
  }

  async getMetrics(): Promise<any> {
    try {
      const response = await this.api.get<ApiResponse<any>>('/api/metrics');
      return response.data.data || {};
    } catch (error) {
      console.error('Get metrics error:', error);
      return {};
    }
  }

  // Configuration
  async updateWorkflowConfig(workflow: string, config: any): Promise<void> {
    try {
      const response = await this.api.put<ApiResponse>(
        `/api/config/${workflow}`,
        config
      );
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Config update failed');
      }
    } catch (error) {
      console.error('Update config error:', error);
      throw error;
    }
  }

  async getWorkflowConfig(workflow: string): Promise<any> {
    try {
      const response = await this.api.get<ApiResponse<any>>(`/api/config/${workflow}`);
      return response.data.data || {};
    } catch (error) {
      console.error('Get config error:', error);
      return {};
    }
  }

  // System Status
  async getSystemStatus(): Promise<any> {
    try {
      const response = await this.api.get<ApiResponse<any>>('/api/system/status');
      return response.data.data || {};
    } catch (error) {
      console.error('Get system status error:', error);
      return { status: 'offline' };
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get<ApiResponse>('/api/health');
      return response.data.success || false;
    } catch (error) {
      return false;
    }
  }
}

export const apiService = new ApiService();

// Custom hooks for API calls
export const useApi = () => {
  const store = useAppStore();

  const handleApiError = (error: any, defaultMessage: string) => {
    const message = error.response?.data?.error || error.message || defaultMessage;
    store.addNotification({
      type: 'error',
      title: 'API Error',
      message,
    });
  };

  const handleApiSuccess = (message: string) => {
    store.addNotification({
      type: 'success',
      title: 'Success',
      message,
    });
  };

  return {
    apiService,
    handleApiError,
    handleApiSuccess,
  };
};
