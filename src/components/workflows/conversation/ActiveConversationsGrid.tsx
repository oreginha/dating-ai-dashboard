import React, { useState } from 'react';
import { 
  ChatBubbleLeftIcon, 
  ClockIcon, 
  FireIcon,
  ArrowTopRightOnSquareIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Conversation {
  id: string;
  profileName: string;
  profileAvatar: string;
  lastMessage: {
    text: string;
    timestamp: string;
    isFromUser: boolean;
  };
  messageCount: number;
  engagementScore: number;
  status: 'active' | 'warming' | 'cold' | 'needs_attention' | 'paused';
  responseTime: number; // hours
  nextScheduledAction?: string;
  platform: 'instagram' | 'tinder' | 'bumble';
  tags: string[];
}

interface ActiveConversationsGridProps {
  conversations: Conversation[];
  onViewHistory: (conversationId: string) => void;
  onSendMessage: (conversationId: string) => void;
  onEscalate: (conversationId: string) => void;
  onPause: (conversationId: string) => void;
  isLoading?: boolean;
}

export const ActiveConversationsGrid: React.FC<ActiveConversationsGridProps> = ({
  conversations,
  onViewHistory,
  onSendMessage,
  onEscalate,
  onPause: _onPause,
  isLoading = false
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'engagement' | 'response_time'>('recent');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'warming': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cold': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'needs_attention': return 'bg-red-100 text-red-800 border-red-200';
      case 'paused': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEngagementIcon = (score: number) => {
    if (score >= 80) return <FireIcon className="w-4 h-4 text-red-500" />;
    if (score >= 60) return <FireIcon className="w-4 h-4 text-orange-500" />;
    if (score >= 40) return <FireIcon className="w-4 h-4 text-yellow-500" />;
    return <FireIcon className="w-4 h-4 text-gray-400" />;
  };

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case 'instagram': return '📸';
      case 'tinder': return '🔥';
      case 'bumble': return '🐝';
      default: return '💬';
    }
  };

  const filteredAndSortedConversations = conversations
    .filter(conv => filterStatus === 'all' || conv.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
        case 'engagement':
          return b.engagementScore - a.engagementScore;
        case 'response_time':
          return a.responseTime - b.responseTime;
        default:
          return 0;
      }
    });

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return 'Ahora';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header con filtros */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ChatBubbleLeftIcon className="w-6 h-6 mr-2 text-blue-600" />
              Conversaciones Activas
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {filteredAndSortedConversations.length} de {conversations.length} conversaciones
            </p>
          </div>

          <div className="flex space-x-4">
            {/* Filtro por estado */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="warming">Calentando</option>
              <option value="cold">Frías</option>
              <option value="needs_attention">Necesitan atención</option>
              <option value="paused">Pausadas</option>
            </select>

            {/* Ordenar por */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'engagement' | 'response_time')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="recent">Más recientes</option>
              <option value="engagement">Engagement</option>
              <option value="response_time">Tiempo respuesta</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de conversaciones */}
      <div className="p-6">
        {filteredAndSortedConversations.length === 0 ? (
          <div className="text-center py-8">
            <ChatBubbleLeftIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay conversaciones que coincidan con los filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Header de la card */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={conversation.profileAvatar}
                      alt={conversation.profileName}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${conversation.profileName}&background=random`;
                      }}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">
                        {conversation.profileName}
                      </h4>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <span>{getPlatformEmoji(conversation.platform)}</span>
                        <span>{conversation.messageCount} mensajes</span>
                      </div>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(conversation.status)}`}>
                    {conversation.status}
                  </span>
                </div>

                {/* Último mensaje */}
                <div className="mb-3">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {conversation.lastMessage.isFromUser ? '📤 ' : '📥 '}
                    {conversation.lastMessage.text}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {formatTimeAgo(conversation.lastMessage.timestamp)}
                    </span>
                    <span>Respuesta: {conversation.responseTime}h</span>
                  </div>
                </div>

                {/* Engagement score */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getEngagementIcon(conversation.engagementScore)}
                    <span className="text-sm font-medium">
                      {conversation.engagementScore}% engagement
                    </span>
                  </div>
                  
                  {conversation.status === 'needs_attention' && (
                    <div className="flex items-center text-red-600">
                      <ExclamationTriangleIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Tags */}
                {conversation.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {conversation.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {conversation.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{conversation.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Próxima acción programada */}
                {conversation.nextScheduledAction && (
                  <div className="text-xs text-blue-600 mb-3 bg-blue-50 p-2 rounded">
                    📅 {conversation.nextScheduledAction}
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewHistory(conversation.id)}
                    className="flex-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                    title="Ver historial completo"
                  >
                    <ArrowTopRightOnSquareIcon className="w-3 h-3 inline mr-1" />
                    Ver
                  </button>
                  
                  <button
                    onClick={() => onSendMessage(conversation.id)}
                    className="flex-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    title="Enviar mensaje"
                  >
                    <PaperAirplaneIcon className="w-3 h-3 inline mr-1" />
                    Enviar
                  </button>
                  
                  {conversation.status === 'needs_attention' && (
                    <button
                      onClick={() => onEscalate(conversation.id)}
                      className="flex-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                      title="Escalar atención"
                    >
                      ⚠️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer con stats rápidas */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex space-x-6">
            <span>🟢 Activas: {conversations.filter(c => c.status === 'active').length}</span>
            <span>🟡 Calentando: {conversations.filter(c => c.status === 'warming').length}</span>
            <span>🔴 Atención: {conversations.filter(c => c.status === 'needs_attention').length}</span>
          </div>
          <div>
            Engagement promedio: {Math.round(conversations.reduce((acc, c) => acc + c.engagementScore, 0) / conversations.length)}%
          </div>
        </div>
      </div>
    </div>
  );
};
