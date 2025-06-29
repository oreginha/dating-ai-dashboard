import React, { useState, useEffect } from 'react';
import { DatingKPICard } from '../components/KPICard';
import { 
  CompatibilityDistribution, 
  ResponseRateTrend, 
  ConversationFunnel,
  ActivityHeatmap
} from '../components/Charts';
import { GlobalQuickActions } from '../components/QuickActions';
import { 
  ClockIcon
} from '@heroicons/react/24/outline';

// Simulación de datos para el dashboard
const dashboardData = {
  systemStatus: {
    discoveryRunning: true,
    conversationManagerActive: true,
    opportunityDetectorActive: true,
    autoResponseActive: false,
  },
  todayMetrics: {
    profilesAnalyzed: 24,
    messagesSent: 18,
    opportunitiesDetected: 7,
    responsesReceived: 12,
    newMatches: 3,
  },
  trends: {
    profilesChange: 15.2,
    messagesChange: -8.1,
    opportunitiesChange: 34.6,
    responsesChange: 22.3,
    matchesChange: 50.0,
  },
  recentOpportunities: [
    {
      id: '1',
      profileName: 'María López',
      opportunityType: 'story_interaction',
      confidence: 89,
      timeDetected: '2 min ago',
      status: 'pending'
    },
    {
      id: '2',
      profileName: 'Ana García',
      opportunityType: 'profile_view',
      confidence: 76,
      timeDetected: '15 min ago',
      status: 'responded'
    },
    {
      id: '3',
      profileName: 'Carmen Ruiz',
      opportunityType: 'mutual_friend',
      confidence: 92,
      timeDetected: '1 hora ago',
      status: 'pending'
    },
  ],
  pendingApprovals: [
    {
      id: '1',
      conversationWith: 'Laura Mendez',
      messagePreview: 'Hola Laura! Vi que también te gusta la fotografía...',
      confidence: 85,
      variants: 3
    },
    {
      id: '2',
      conversationWith: 'Patricia Silva',
      messagePreview: 'Qué tal Patricia! Me encantó tu último post sobre...',
      confidence: 78,
      variants: 3
    },
  ],
  nextActions: [
    {
      id: '1',
      action: 'Seguimiento con Ana García',
      scheduledFor: '2 horas',
      type: 'follow_up'
    },
    {
      id: '2',
      action: 'Discovery Pipeline - Nuevos perfiles',
      scheduledFor: '4 horas',
      type: 'discovery'
    },
    {
      id: '3',
      action: 'Revisión semanal de métricas',
      scheduledFor: '1 día',
      type: 'analytics'
    },
  ]
};

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(dashboardData);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleStartDiscovery = () => {
    console.log('Iniciando discovery pipeline...');
    setData(prev => ({
      ...prev,
      systemStatus: { ...prev.systemStatus, discoveryRunning: true }
    }));
  };

  const handleStopDiscovery = () => {
    console.log('Deteniendo discovery pipeline...');
    setData(prev => ({
      ...prev,
      systemStatus: { ...prev.systemStatus, discoveryRunning: false }
    }));
  };

  const handleManualAnalysis = () => {
    const url = prompt('URL de Instagram a analizar:');
    if (url) {
      console.log('Analizando:', url);
      // Aquí se integraría con el MCP server
    }
  };

  const handleRefreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simular actualización de datos
      setData(prev => ({
        ...prev,
        todayMetrics: {
          ...prev.todayMetrics,
          profilesAnalyzed: prev.todayMetrics.profilesAnalyzed + Math.floor(Math.random() * 5),
        }
      }));
    }, 1000);
  };

  return (
    <div>
      {/* Dashboard Overview */}
      <div className="space-y-6">
        {/* Header Stats Row */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <DatingKPICard
            type="profiles"
            value={data.todayMetrics.profilesAnalyzed}
            change={data.trends.profilesChange}
            loading={loading}
          />
          <DatingKPICard
            type="messages"
            value={data.todayMetrics.messagesSent}
            change={data.trends.messagesChange}
            loading={loading}
          />
          <DatingKPICard
            type="opportunities"
            value={data.todayMetrics.opportunitiesDetected}
            change={data.trends.opportunitiesChange}
            loading={loading}
          />
          <DatingKPICard
            type="responses"
            value={data.todayMetrics.responsesReceived}
            change={data.trends.responsesChange}
            loading={loading}
          />
          <DatingKPICard
            type="matches"
            value={data.todayMetrics.newMatches}
            change={data.trends.matchesChange}
            loading={loading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* System Status Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${
                      data.systemStatus.discoveryRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-300'
                    }`}></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Discovery Pipeline</h3>
                    <p className="text-sm text-gray-500">
                      {data.systemStatus.discoveryRunning ? 'Ejecutándose activamente' : 'Detenido'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${
                      data.systemStatus.autoResponseActive ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
                    }`}></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Auto-Response</h3>
                    <p className="text-sm text-gray-500">
                      {data.systemStatus.autoResponseActive ? 'Enviando automáticamente' : 'Requiere aprobación'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Compatibilidad</h3>
                <CompatibilityDistribution loading={loading} />
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasa de Respuesta (7 días)</h3>
                <ResponseRateTrend loading={loading} />
              </div>
            </div>

            {/* Conversation Funnel */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Embudo de Conversión</h3>
              <ConversationFunnel />
            </div>

            {/* Activity Heatmap */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Semanal</h3>
              <ActivityHeatmap />
            </div>
          </div>

          {/* Right Column - Quick Actions & Lists */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <GlobalQuickActions
              onStartDiscovery={handleStartDiscovery}
              onStopDiscovery={handleStopDiscovery}
              onManualAnalysis={handleManualAnalysis}
              onRefreshData={handleRefreshData}
              discoveryRunning={data.systemStatus.discoveryRunning}
              loading={loading}
            />

            {/* Recent Opportunities */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Oportunidades Recientes</h3>
              <div className="space-y-3">
                {data.recentOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{opportunity.profileName}</p>
                      <p className="text-xs text-gray-500">{opportunity.opportunityType}</p>
                      <p className="text-xs text-gray-400">{opportunity.timeDetected}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        opportunity.confidence > 80 ? 'bg-green-100 text-green-800' :
                        opportunity.confidence > 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {opportunity.confidence}%
                      </span>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Responder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mensajes Pendientes</h3>
              <div className="space-y-3">
                {data.pendingApprovals.map((approval) => (
                  <div key={approval.id} className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{approval.conversationWith}</p>
                    <p className="text-xs text-gray-600 mt-1">{approval.messagePreview}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-blue-600">{approval.variants} variantes</span>
                      <div className="flex space-x-2">
                        <button className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                          ✓ Aprobar
                        </button>
                        <button className="text-xs bg-gray-500 text-white px-2 py-1 rounded">
                          ✎ Editar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Acciones</h3>
              <div className="space-y-3">
                {data.nextActions.map((action) => (
                  <div key={action.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{action.action}</p>
                      <p className="text-xs text-gray-500">En {action.scheduledFor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
