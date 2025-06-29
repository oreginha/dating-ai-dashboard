import { useState } from 'react';
import { 
  BoltIcon, 
  FireIcon, 
  ChatBubbleLeftIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Opportunity {
  id: string;
  profileName: string;
  profileAvatar: string;
  type: 'story_interaction' | 'post_like' | 'follow_back' | 'comment_received' | 'story_view';
  description: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  platform: 'instagram' | 'tinder' | 'bumble';
  timestamp: string;
  context: string;
  suggestedAction: string;
  responseGenerated?: boolean;
  status: 'new' | 'pending' | 'acted' | 'dismissed';
}

interface RealTimeOpportunitiesFeedProps {
  opportunities: Opportunity[];
  onGenerateResponse: (opportunityId: string) => void;
  onDismiss: (opportunityId: string) => void;
  onViewProfile: (opportunityId: string) => void;
  isGeneratingResponse?: string; // ID of opportunity being processed
}

export const RealTimeOpportunitiesFeed: React.FC<RealTimeOpportunitiesFeedProps> = ({
  opportunities,
  onGenerateResponse,
  onDismiss,
  onViewProfile,
  isGeneratingResponse
}) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [autoScroll, setAutoScroll] = useState(true);

  const getOpportunityIcon = (type: string) => {
    switch (type) {
      case 'story_interaction': return '👀';
      case 'post_like': return '❤️';
      case 'follow_back': return '👥';
      case 'comment_received': return '💬';
      case 'story_view': return '📱';
      default: return '⚡';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredOpportunities = opportunities
    .filter(opp => filter === 'all' || opp.priority === filter)
    .sort((a, b) => {
      // Primero por prioridad, luego por timestamp
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'Ahora';
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BoltIcon className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Oportunidades en Tiempo Real
            </h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600">Live</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Filtro de prioridad */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas</option>
              <option value="high">Alta prioridad</option>
              <option value="medium">Media prioridad</option>
              <option value="low">Baja prioridad</option>
            </select>

            {/* Toggle auto-scroll */}
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`text-xs px-2 py-1 rounded ${
                autoScroll 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Auto-scroll
            </button>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="flex space-x-4 mt-2 text-sm text-gray-600">
          <span>🔴 Alta: {opportunities.filter(o => o.priority === 'high').length}</span>
          <span>🟡 Media: {opportunities.filter(o => o.priority === 'medium').length}</span>
          <span>🟢 Baja: {opportunities.filter(o => o.priority === 'low').length}</span>
        </div>
      </div>

      {/* Feed de oportunidades */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-8">
            <BoltIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay oportunidades nuevas</p>
            <p className="text-xs text-gray-400 mt-1">Las nuevas aparecerán aquí en tiempo real</p>
          </div>
        ) : (
          filteredOpportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className={`border rounded-lg p-3 transition-all hover:shadow-md ${getPriorityColor(opportunity.priority)}`}
            >
              {/* Header de la oportunidad */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <img
                    src={opportunity.profileAvatar}
                    alt={opportunity.profileName}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${opportunity.profileName}&background=random`;
                    }}
                  />
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">
                      {opportunity.profileName}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{getOpportunityIcon(opportunity.type)}</span>
                      <span>{opportunity.type.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(opportunity.timestamp)}</span>
                    </div>
                  </div>
                </div>

                {/* Confidence badge */}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(opportunity.confidence)}`}>
                  {opportunity.confidence}%
                </span>
              </div>

              {/* Descripción */}
              <p className="text-sm text-gray-700 mb-2">
                {opportunity.description}
              </p>

              {/* Contexto */}
              <div className="bg-white bg-opacity-70 rounded p-2 mb-2">
                <p className="text-xs text-gray-600">
                  <strong>Contexto:</strong> {opportunity.context}
                </p>
              </div>

              {/* Acción sugerida */}
              <div className="bg-blue-50 rounded p-2 mb-3">
                <p className="text-xs text-blue-800">
                  <strong>💡 Sugerencia:</strong> {opportunity.suggestedAction}
                </p>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-2">
                {opportunity.status === 'new' && (
                  <>
                    <button
                      onClick={() => onGenerateResponse(opportunity.id)}
                      disabled={isGeneratingResponse === opportunity.id}
                      className="flex-1 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isGeneratingResponse === opportunity.id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                          Generando...
                        </>
                      ) : (
                        <>
                          <ChatBubbleLeftIcon className="w-3 h-3 mr-1" />
                          Generar Respuesta
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => onViewProfile(opportunity.id)}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Ver Perfil
                    </button>
                    
                    <button
                      onClick={() => onDismiss(opportunity.id)}
                      className="px-2 py-1 text-xs text-gray-500 hover:text-red-600"
                      title="Descartar"
                    >
                      ✕
                    </button>
                  </>
                )}

                {opportunity.status === 'pending' && (
                  <div className="flex-1 text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-center">
                    ⏳ Pendiente de aprobación
                  </div>
                )}

                {opportunity.status === 'acted' && (
                  <div className="flex-1 text-xs bg-green-100 text-green-800 px-3 py-1 rounded text-center flex items-center justify-center">
                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                    Acción completada
                  </div>
                )}

                {opportunity.status === 'dismissed' && (
                  <div className="flex-1 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded text-center">
                    Descartada
                  </div>
                )}
              </div>

              {/* Indicador de prioridad */}
              <div className="flex justify-end mt-2">
                {opportunity.priority === 'high' && (
                  <div className="flex items-center text-xs text-red-600">
                    <FireIcon className="w-3 h-3 mr-1" />
                    Alta prioridad
                  </div>
                )}
                {opportunity.priority === 'medium' && (
                  <div className="flex items-center text-xs text-yellow-600">
                    <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                    Media prioridad
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer con contador */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex-shrink-0">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>
            {filteredOpportunities.filter(o => o.status === 'new').length} nuevas oportunidades
          </span>
          <span>
            Últimas 24h: {opportunities.filter(o => 
              Date.now() - new Date(o.timestamp).getTime() < 24 * 60 * 60 * 1000
            ).length}
          </span>
        </div>
      </div>
    </div>
  );
};
