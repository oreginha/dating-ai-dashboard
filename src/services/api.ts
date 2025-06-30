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
  enhanced_analysis?: boolean;
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

  // Profile Analysis - FIXED: Use /mcp/ endpoints
  async analyzeProfile(request: ProfileAnalysisRequest): Promise<ProfileAnalysisResponse> {
    try {
      const response = await this.api.post<any>(
        '/mcp/profile/analyze',
        request
      );
      
      // The backend returns direct data, not wrapped in ApiResponse
      if (!response.data.success) {
        throw new Error(response.data.error || 'Profile analysis failed');
      }
      
      return response.data;
    } catch (error) {
      console.error('Profile analysis error:', error);
      throw error;
    }
  }

  // Get Profiles - FIXED: Use /mcp/ endpoint
  async getProfiles(): Promise<any[]> {
    try {
      const response = await this.api.get<any>('/mcp/profiles');
      return response.data.profiles || [];
    } catch (error) {
      console.error('Get profiles error:', error);
      return [];
    }
  }

  // Get Analytics - FIXED: Use /mcp/ endpoint
  async getAnalytics(): Promise<any> {
    try {
      const response = await this.api.get<any>('/mcp/analytics');
      return response.data || {};
    } catch (error) {
      console.error('Get analytics error:', error);
      return {};
    }
  }

  // Strategy Generation - FIXED: Use /mcp/ endpoint
  async generateStrategy(profileId: number, objective: string = 'romantic_connection'): Promise<any> {
    try {
      const response = await this.api.post<any>('/mcp/strategy/generate', {
        profile_id: profileId,
        objective,
        enhanced_strategy: true
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Strategy generation failed');
      }
      
      return response.data;
    } catch (error) {
      console.error('Strategy generation error:', error);
      throw error;
    }
  }

  // Health check - FIXED: Use correct endpoint
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get<any>('/health');
      return response.data.status === 'ok';
    } catch (error) {
      return false;
    }
  }

  // Legacy methods - keeping for compatibility but not used
  async getConversations(): Promise<any[]> {
    console.warn('getConversations not implemented in MCP backend');
    return [];
  }

  async getConversationHistory(conversationId: string): Promise<any[]> {
    console.warn('getConversationHistory not implemented in MCP backend');
    return [];
  }

  async generateMessage(request: MessageGenerationRequest): Promise<MessageGenerationResponse> {
    console.warn('generateMessage not implemented in MCP backend');
    throw new Error('Not implemented');
  }

  async sendMessage(conversationId: string, content: string): Promise<void> {
    console.warn('sendMessage not implemented in MCP backend');
    throw new Error('Not implemented');
  }

  async detectOpportunities(request: OpportunityDetectionRequest): Promise<OpportunityDetectionResponse> {
    console.warn('detectOpportunities not implemented in MCP backend');
    throw new Error('Not implemented');
  }

  async getMetrics(): Promise<any> {
    // Alias to getAnalytics for compatibility
    return this.getAnalytics();
  }

  async updateWorkflowConfig(workflow: string, config: any): Promise<void> {
    console.warn('updateWorkflowConfig not implemented in MCP backend');
    throw new Error('Not implemented');
  }

  async getWorkflowConfig(workflow: string): Promise<any> {
    console.warn('getWorkflowConfig not implemented in MCP backend');
    return {};
  }

  async getSystemStatus(): Promise<any> {
    // Use health check as system status
    const isHealthy = await this.healthCheck();
    return { status: isHealthy ? 'online' : 'offline' };
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
