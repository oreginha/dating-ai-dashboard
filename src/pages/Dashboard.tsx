import React, { useState, useEffect } from 'react';
import { 
  UserPlusIcon, 
  ChatBubbleLeftRightIcon, 
  SparklesIcon,
  ClockIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { useTranslation, MetricWithHelp, SectionWithHelp } from '../hooks/useTranslation';
import { useApi } from '../services/api';
import { useAppStore } from '../store';

interface DashboardStats {
  profilesAnalyzed: number;
  avgCompatibility: number;
  activeConversations: number;
  successRate: number;
}

interface RecentActivity {
  id: string;
  action: string;
  target: string;
  score?: number;
  timestamp: string;
}

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { apiService, handleApiError } = useApi();
  const { addNotification } = useAppStore();
  
  const [stats, setStats] = useState<DashboardStats>({
    profilesAnalyzed: 0,
    avgCompatibility: 0,
    activeConversations: 0,
    successRate: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<'online' | 'offline' | 'connecting'>('connecting');

  // Cargar datos del dashboard
  useEffect(() => {
    loadDashboardData();
    checkSystemStatus();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      loadDashboardData();
      checkSystemStatus();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('📊 Loading dashboard data...');
      
      const [analyticsResponse] = await Promise.all([
        apiService.getAnalytics(),
        apiService.getProfiles()
      ]);
      
      if (analyticsResponse.success && analyticsResponse.data) {
        const data = analyticsResponse.data;
        
        setStats({
          profilesAnalyzed: data.summary.total_profiles_analyzed,
          avgCompatibility: Math.round(data.summary.avg_compatibility_score * 100),
          activeConversations: data.summary.successful_conversations,
          successRate: data.summary.active_strategies
        });
        
        // Convertir actividad reciente al formato esperado
        const activities: RecentActivity[] = data.recent_activity.map((activity, index) => ({
          id: `activity-${index}`,
          action: translateActivity(activity.action),
          target: activity.target,
          score: activity.score,
          timestamp: activity.timestamp
        }));
        
        setRecentActivity(activities);
      }
      
      setLoading(false);
      console.log('✅ Dashboard data loaded successfully');
      
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      handleApiError(error, 'Error cargando datos del dashboard');
      setLoading(false);
    }
  };

  const checkSystemStatus = async () => {
    try {
      const isHealthy = await apiService.healthCheck();
      setSystemStatus(isHealthy ? 'online' : 'offline');
    } catch (error) {
      setSystemStatus('offline');
    }
  };

  const translateActivity = (action: string): string => {
    const translations: Record<string, string> = {
      'profile_analyzed': 'Perfil analizado',
      'strategy_generated': 'Estrategia generada',
      'compatibility_calculated': 'Compatibilidad calculada',
      'message_sent': 'Mensaje enviado'
    };
    
    return translations[action] || action;
  };

  const handleQuickAction = (action: string) => {
    console.log(`🎯 Quick action: ${action}`);
    addNotification({
      type: 'info',
      title: 'Navegando...',
      message: `Dirigiendo a ${action}`
    });
    
    // Aquí se navegaría a la sección correspondiente
    // window.location.href = `/${action}`;
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('common.now');
    if (diffInMinutes < 60) return t('common.minutesAgo', [diffInMinutes.toString()]);
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return t('common.hoursAgo', [diffInHours.toString()]);
    
    const diffInDays = Math.floor(diffInHours / 24);
    return t('common.daysAgo', [diffInDays.toString()]);
  };

  const getStatusText = () => {
    switch (systemStatus) {
      case 'online': return t('common.online');
      case 'offline': return t('common.offline');
      default: return t('common.connecting');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">{t('common.loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
            <p className="text-blue-100 mt-1">{t('dashboard.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${systemStatus === 'online' ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm">{getStatusText()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricWithHelp
          label={t('dashboard.stats.profilesAnalyzed')}
          value={stats.profilesAnalyzed}
          helpKey="profilesAnalyzed"
          trend="up"
          trendValue="+2"
        />
        
        <MetricWithHelp
          label={t('dashboard.stats.avgCompatibility')}
          value={`${stats.avgCompatibility}%`}
          helpKey="compatibilityScore"
          trend="up"
          trendValue="+5%"
        />
        
        <MetricWithHelp
          label={t('dashboard.stats.activeConversations')}
          value={stats.activeConversations}
          helpKey="activeConversations"
          trend="neutral"
          trendValue="0"
        />
        
        <MetricWithHelp
          label={t('dashboard.stats.successRate')}
          value={`${stats.successRate}%`}
          helpKey="successRate"
          trend="up"
          trendValue="+12%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <SectionWithHelp 
          title={t('dashboard.quickActions.title')}
          className="lg:col-span-1"
        >
          <div className="space-y-3">
            <button
              onClick={() => handleQuickAction('discovery')}
              className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <UserPlusIcon className="h-5 w-5 text-blue-600" />
              <div>
                <span className="font-medium text-gray-900">{t('dashboard.quickActions.analyzeProfile')}</span>
                <p className="text-sm text-gray-500">Analiza un nuevo perfil de Instagram</p>
              </div>
            </button>
            
            <button
              onClick={() => handleQuickAction('profiles')}
              className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <HeartIcon className="h-5 w-5 text-green-600" />
              <div>
                <span className="font-medium text-gray-900">{t('dashboard.quickActions.viewProfiles')}</span>
                <p className="text-sm text-gray-500">Revisa perfiles analizados</p>
              </div>
            </button>
            
            <button
              onClick={() => handleQuickAction('opportunities')}
              className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
            >
              <SparklesIcon className="h-5 w-5 text-yellow-600" />
              <div>
                <span className="font-medium text-gray-900">{t('dashboard.quickActions.checkOpportunities')}</span>
                <p className="text-sm text-gray-500">Ve oportunidades detectadas</p>
              </div>
            </button>
            
            <button
              onClick={() => handleQuickAction('strategies')}
              className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-600" />
              <div>
                <span className="font-medium text-gray-900">{t('dashboard.quickActions.generateStrategy')}</span>
                <p className="text-sm text-gray-500">Crea estrategias de conversación</p>
              </div>
            </button>
          </div>
        </SectionWithHelp>

        {/* Recent Activity */}
        <SectionWithHelp 
          title={t('dashboard.recentActivity.title')}
          className="lg:col-span-2"
        >
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ClockIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>{t('dashboard.recentActivity.noActivity')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <span className="font-medium text-gray-900">{activity.action}</span>
                      <span className="text-gray-600 ml-2">{activity.target}</span>
                      {activity.score && (
                        <span className="text-sm text-green-600 ml-2">
                          ({Math.round(activity.score * 100)}% compatibilidad)
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionWithHelp>
      </div>

      {/* Tips para nuevos usuarios */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <SparklesIcon className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">🚀 ¿Nuevo en Dating AI Agent?</h3>
            <div className="text-blue-800 space-y-1">
              <p>• <strong>Empezá analizando un perfil:</strong> Usa "Analizar Perfil" para empezar</p>
              <p>• <strong>Revisá la compatibilidad:</strong> El sistema calcula automáticamente scores de compatibilidad</p>
              <p>• <strong>Generá estrategias:</strong> Obtén mensajes personalizados para cada perfil</p>
              <p>• <strong>Seguí oportunidades:</strong> El sistema detecta momentos perfectos para actuar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};