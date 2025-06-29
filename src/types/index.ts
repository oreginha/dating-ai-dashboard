// Types para el Dating AI Agent Dashboard

export interface Profile {
  id: string;
  username: string;
  displayName?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
  isPrivate: boolean;
  profileImageUrl?: string;
  url: string;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter';
  scrapedAt: string;
  inferredInterests: string[];
  estimatedAgeRange?: string;
  activityLevel: 'inactive' | 'low' | 'medium' | 'high' | 'very_high';
}

export interface CompatibilityAnalysis {
  profileId: string;
  score: number;
  factors: {
    interests: number;
    lifestyle: number;
    activity: number;
    demographics: number;
  };
  redFlags: string[];
  strengths: string[];
  recommendations: string[];
  analysisDate: string;
}

export interface Conversation {
  id: string;
  profileId: string;
  platform: string;
  state: 'initial' | 'engaged' | 'warming' | 'active' | 'stale' | 'closed';
  lastMessageAt?: string;
  messagesCount: number;
  responseRate: number;
  engagementScore: number;
  nextActionAt?: string;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  profileId: string;
  type: 'story_interaction' | 'profile_view' | 'mutual_friend' | 'activity_spike' | 'engagement_window';
  confidence: number;
  detectedAt: string;
  status: 'pending' | 'responded' | 'dismissed' | 'expired';
  signals: string[];
  recommendedAction: string;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  variants?: Array<{ text: string; score: number }>;
  confidence: number;
  status: 'pending' | 'approved' | 'sent' | 'rejected';
  approvedAt?: string;
  sentAt?: string;
  createdAt: string;
}

export interface SystemStatus {
  discoveryRunning: boolean;
  conversationManagerActive: boolean;
  opportunityDetectorActive: boolean;
  autoResponseActive: boolean;
  lastUpdateAt: string;
}

export interface DashboardMetrics {
  today: {
    profilesAnalyzed: number;
    messagesSent: number;
    opportunitiesDetected: number;
    responsesReceived: number;
    newMatches: number;
  };
  trends: {
    profilesChange: number;
    messagesChange: number;
    opportunitiesChange: number;
    responsesChange: number;
    matchesChange: number;
  };
  totals: {
    totalProfiles: number;
    totalConversations: number;
    totalMatches: number;
    successRate: number;
  };
}

export interface WorkflowConfig {
  discoveryPipeline: {
    schedule: string;
    searchCriteria: string[];
    dailyLimit: number;
    minCompatibility: number;
    enabled: boolean;
  };
  conversationManager: {
    checkInterval: number;
    responseTimeThreshold: number;
    inactivityThreshold: number;
    enabled: boolean;
  };
  opportunityDetector: {
    sensitivityLevel: 'low' | 'medium' | 'high';
    enabledOpportunityTypes: string[];
    confidenceThreshold: number;
    enabled: boolean;
  };
  autoResponseSystem: {
    autoSendEnabled: boolean;
    autoSendThreshold: number;
    approvalTimeoutHours: number;
    generateVariantCount: number;
    enabled: boolean;
  };
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface DistributionData {
  range: string;
  count: number;
  percentage: number;
  color?: string;
}

export interface FunnelData {
  stage: string;
  count: number;
  percentage: number;
  conversionRate?: number;
}

// Notification types
export interface Notification {
  id: string;
  type: 'opportunity' | 'message' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
