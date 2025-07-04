import React, { useState, useEffect } from 'react';
import { 
  UserPlusIcon, 
  ChartBarIcon,
  ChatBubbleLeftRightIcon, 
  SparklesIcon,
  ClockIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
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
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Cargar datos del dashboard
  useEffect(() => {
    loadDashboardData();
    checkSystemStatus();
    checkIfFirstTime();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      loadDashboardData();
      checkSystemStatus();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const checkIfFirstTime = () => {
    const hasVisited = localStorage.getItem('dating-ai-visited');
    if (!hasVisited) {
      setShowOnboarding(true);
      localStorage.setItem('dating-ai-visited', 'true');
    }
  };

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

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusText = () => {
    switch (systemStatus) {
      case 'online': return t('common.online');
      case 'offline': return t('common.offline');
      default: return t('common.connecting');
    }
  };

  // Componente de Onboarding
  const OnboardingModal = () => {
    if (!showOnboarding) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🎉</span>
              <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido a Dating AI Agent!</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p>Tu asistente personal de IA para optimizar tu vida romántica. Aquí tienes una guía rápida:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <UserPlusIcon className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">1. Analizar Perfiles</h3>
                  </div>
                  <p className="text-sm">Ve a "Descubrimiento" para analizar perfiles de Instagram y obtener scores de compatibilidad.</p>
                </div>
                
                <div className="border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">2. Gestionar Chats</h3>
                  </div>
                  <p className="text-sm">En "Conversaciones" podrás gestionar todas tus conversaciones activas.</p>
                </div>
                
                <div className="border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <SparklesIcon className="h-5 w-5 text-yellow-600" />
                    <h3 className="font-semibold">3. Detectar Oportunidades</h3>
                  </div>
                  <p className="text-sm">"Oportunidades" te alerta de momentos perfectos para avanzar tus conversaciones.</p>
                </div>
                
                <div className="border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ChartBarIcon className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold">4. Ver Analytics</h3>
                  </div>
                  <p className="text-sm">Revisa tus métricas de éxito y mejora continuamente.</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Consejo para empezar:</h4>
                <p className="text-blue-800 text-sm">
                  Comienza analizando un perfil de Instagram en la sección "Descubrimiento". 
                  El sistema te dará un score de compatibilidad y estrategias personalizadas.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowOnboarding(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowOnboarding(false);
                  handleQuickAction('discovery');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Comenzar Análisis
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
      {/* Onboarding Modal */}
      <OnboardingModal />

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

      {/* Quick Access Banner si no hay actividad */}
      {recentActivity.length === 0 && (
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">🚀 ¿Listo para empezar?</h2>
              <p className="text-green-100 mt-1">Analiza tu primer perfil y comienza a optimizar tu dating game</p>
            </div>
            <button
              onClick={() => handleQuickAction('discovery')}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Analizar Perfil
            </button>
          </div>
        </div>
      )}

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
              <p className="text-sm mt-2">Comienza analizando un perfil para ver actividad aquí</p>
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
            <button
              onClick={() => setShowOnboarding(true)}
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Ver guía completa nuevamente
            </button>
          </div>
        </div>
      </div>

      {/* Alerts section para mostrar problemas del sistema */}
      {systemStatus === 'offline' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            <div>
              <h4 className="font-semibold text-red-900">Sistema Desconectado</h4>
              <p className="text-red-800 text-sm">
                El sistema está experimentando problemas de conectividad. 
                Algunas funciones pueden estar limitadas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success messages */}
      {systemStatus === 'online' && stats.profilesAnalyzed > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-900">¡Sistema funcionando perfectamente!</h4>
              <p className="text-green-800 text-sm">
                Ya analizaste {stats.profilesAnalyzed} perfiles. 
                Tu compatibilidad promedio es {stats.avgCompatibility}%.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};