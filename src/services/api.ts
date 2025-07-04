import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useAppStore } from '../store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

console.log('🔗 API Base URL:', API_BASE_URL); // Debug log

// Types - Updated to match real backend
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
  success: boolean;
  profile_id?: number;
  data?: {
    profile_id: number;
    username: string;
    full_name?: string;
    bio?: string;
    followers_count: number;
    following_count: number;
    posts_count: number;
    is_verified: boolean;
    is_private: boolean;
    profile_pic_url?: string;
    scraped_at: string;
  };
  error?: string;
}

export interface CompatibilityRequest {
  profile_id: number;
  enhanced_analysis?: boolean;
}

export interface CompatibilityResponse {
  success: boolean;
  data?: {
    profile_id: number;
    compatibility_score: number;
    tier_breakdown: {
      core_values: number;
      social_patterns: number;
      interests: number;
      communication: number;
    };
    success_prediction: {
      success_probability: number;
      confidence_level: 'high' | 'medium' | 'low';
      recommendation: {
        action: string;
        approach: string;
      };
    };
    analyzed_at: string;
  };
  error?: string;
}

export interface StrategyRequest {
  profile_id: number;
  objective?: string;
  enhanced_strategy?: boolean;
}

export interface StrategyResponse {
  success: boolean;
  data?: {
    profile_id: number;
    objective: string;
    conversation_plan: {
      phase_1: ConversationPhase;
      phase_2: ConversationPhase;
      phase_3: ConversationPhase;
      phase_4: ConversationPhase;
    };
    timing_strategy: {
      initial_message: string;
      follow_up: string;
      escalation: string;
    };
    success_indicators: string[];
    red_flags: string[];
    generated_at: string;
  };
  error?: string;
}

interface ConversationPhase {
  name: string;
  duration: string;
  objective: string;
  sample_messages: string[];
}

export interface ProfileListResponse {
  success: boolean;
  profiles?: Array<{
    profile_id: number;
    username: string;
    compatibility_score: number;
    status: string;
    last_updated: string;
  }>;
  total_count?: number;
  error?: string;
}

export interface AnalyticsResponse {
  success: boolean;
  data?: {
    summary: {
      total_profiles_analyzed: number;
      avg_compatibility_score: number;
      successful_conversations: number;
      active_strategies: number;
    };
    compatibility_distribution: {
      high_compatibility: number;
      medium_compatibility: number;
      low_compatibility: number;
    };
    recent_activity: Array<{
      action: string;
      target: string;
      score?: number;
      timestamp: string;
    }>;
    system_health: {
      api_status: string;
      database_status: string;
      scraping_status: string;
      last_check: string;
    };
  };
  error?: string;
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
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Response Error:', error);
        
        const store = useAppStore.getState();
        
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          store.setConnectionStatus(false);
        } else if (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR') {
          store.setSystemStatus('offline');
          store.addNotification({
            type: 'error',
            title: 'Error de Conexión',
            message: 'No se pudo conectar al servidor. Verificá tu conexión a internet.',
          });
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Profile Analysis - Using real MCP endpoints
  async analyzeProfile(request: ProfileAnalysisRequest): Promise<ProfileAnalysisResponse> {
    try {
      console.log('🎯 Analyzing profile:', request.instagram_url);
      
      const response = await this.api.post<ProfileAnalysisResponse>(
        '/mcp/profile/analyze',
        {
          instagram_url: request.instagram_url,
          enhanced_analysis: request.enhanced_analysis || true
        }
      );
      
      console.log('✅ Profile analysis response:', response.data);
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Profile analysis error:', error);
      
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Error analizando el perfil';
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Compatibility Analysis
  async analyzeCompatibility(request: CompatibilityRequest): Promise<CompatibilityResponse> {
    try {
      console.log('💕 Analyzing compatibility for profile:', request.profile_id);
      
      const response = await this.api.post<CompatibilityResponse>(
        '/mcp/compatibility/analyze',
        {
          profile_id: request.profile_id,
          enhanced_analysis: request.enhanced_analysis || true
        }
      );
      
      console.log('✅ Compatibility analysis response:', response.data);
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Compatibility analysis error:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Error calculando compatibilidad'
      };
    }
  }

  // Strategy Generation
  async generateStrategy(request: StrategyRequest): Promise<StrategyResponse> {
    try {
      console.log('🧠 Generating strategy for profile:', request.profile_id);
      
      const response = await this.api.post<StrategyResponse>(
        '/mcp/strategy/generate',
        {
          profile_id: request.profile_id,
          objective: request.objective || 'romantic_connection',
          enhanced_strategy: request.enhanced_strategy || true
        }
      );
      
      console.log('✅ Strategy generation response:', response.data);
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Strategy generation error:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Error generando estrategia'
      };
    }
  }

  // Get Profiles List
  async getProfiles(): Promise<ProfileListResponse> {
    try {
      console.log('📋 Fetching profiles list');
      
      const response = await this.api.get<ProfileListResponse>('/mcp/profiles');
      
      console.log('✅ Profiles list response:', response.data);
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Get profiles error:', error);
      
      return {
        success: false,
        profiles: [],
        total_count: 0,
        error: error.response?.data?.error || 'Error obteniendo perfiles'
      };
    }
  }

  // Get Analytics
  async getAnalytics(): Promise<AnalyticsResponse> {
    try {
      console.log('📊 Fetching analytics');
      
      const response = await this.api.get<AnalyticsResponse>('/mcp/analytics');
      
      console.log('✅ Analytics response:', response.data);
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Get analytics error:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Error obteniendo analytics'
      };
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      console.log('🏥 Health check');
      
      const response = await this.api.get('/health');
      const isHealthy = response.data.status === 'healthy';
      
      console.log('✅ Health check result:', isHealthy);
      return isHealthy;
      
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return false;
    }
  }

  // System status
  async getSystemStatus(): Promise<any> {
    try {
      const response = await this.api.get('/mcp/status');
      return response.data;
    } catch (error) {
      console.error('❌ System status error:', error);
      return { mcp_system: 'error' };
    }
  }

  // Legacy methods - marked as not implemented
  async getConversations(): Promise<any[]> {
    console.warn('getConversations: Funcionalidad próximamente');
    return [];
  }

  async getConversationHistory(_conversationId: string): Promise<any[]> {
    console.warn('getConversationHistory: Funcionalidad próximamente');
    return [];
  }

  async generateMessage(_request: any): Promise<any> {
    console.warn('generateMessage: Funcionalidad próximamente');
    throw new Error('Funcionalidad próximamente');
  }

  async sendMessage(_conversationId: string, _content: string): Promise<void> {
    console.warn('sendMessage: Funcionalidad próximamente');
    throw new Error('Funcionalidad próximamente');
  }

  async detectOpportunities(_request: any): Promise<any> {
    console.warn('detectOpportunities: Funcionalidad próximamente');
    throw new Error('Funcionalidad próximamente');
  }

  async getMetrics(): Promise<any> {
    // Alias to getAnalytics
    return this.getAnalytics();
  }

  async updateWorkflowConfig(_workflow: string, _config: any): Promise<void> {
    console.warn('updateWorkflowConfig: Funcionalidad próximamente');
    throw new Error('Funcionalidad próximamente');
  }

  async getWorkflowConfig(_workflow: string): Promise<any> {
    console.warn('getWorkflowConfig: Funcionalidad próximamente');
    return {};
  }
}

export const apiService = new ApiService();

// Custom hooks for API calls with Spanish error messages
export const useApi = () => {
  const store = useAppStore();

  const handleApiError = (error: any, defaultMessage: string = 'Error inesperado') => {
    let message = defaultMessage;
    
    if (error.response?.data?.error) {
      message = error.response.data.error;
    } else if (error.message) {
      message = error.message;
    }
    
    // Traducir mensajes de error comunes
    if (message.includes('Network Error')) {
      message = 'Error de red. Verificá tu conexión a internet.';
    } else if (message.includes('timeout')) {
      message = 'La solicitud tardó demasiado. Intentá de nuevo.';
    } else if (message.includes('404')) {
      message = 'Recurso no encontrado.';
    } else if (message.includes('500')) {
      message = 'Error interno del servidor.';
    }
    
    store.addNotification({
      type: 'error',
      title: 'Error',
      message,
    });
  };

  const handleApiSuccess = (message: string) => {
    store.addNotification({
      type: 'success',
      title: 'Éxito',
      message,
    });
  };

  return {
    apiService,
    handleApiError,
    handleApiSuccess,
  };
};

export default apiService;