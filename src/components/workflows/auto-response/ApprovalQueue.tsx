import React, { useState } from 'react';
import { 
  CheckCircleIcon, 
  XMarkIcon, 
  PencilIcon,
  ClockIcon,
  StarIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface MessageVariant {
  id: string;
  text: string;
  confidence: number;
  tone: 'casual' | 'flirty' | 'friendly' | 'humorous';
  reasoning: string;
}

interface PendingMessage {
  id: string;
  conversationId: string;
  profileName: string;
  profileAvatar: string;
  trigger: string;
  context: string;
  variants: MessageVariant[];
  recommendedVariant: string;
  timestamp: string;
  expiresAt: string;
  platform: 'instagram' | 'tinder' | 'bumble';
  priority: 'high' | 'medium' | 'low';
}

interface ApprovalQueueProps {
  pendingMessages: PendingMessage[];
  onApprove: (messageId: string, variantId: string) => void;
  onReject: (messageId: string) => void;
  onEdit: (messageId: string, variantId: string, newText: string) => void;
  isProcessing?: string; // ID of message being processed
}

export const ApprovalQueue: React.FC<ApprovalQueueProps> = ({
  pendingMessages,
  onApprove,
  onReject,
  onEdit,
  isProcessing
}) => {
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [editingVariant, setEditingVariant] = useState<{messageId: string, variantId: string} | null>(null);
  const [editText, setEditText] = useState('');

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'casual': return 'bg-blue-100 text-blue-800';
      case 'flirty': return 'bg-pink-100 text-pink-800';
      case 'friendly': return 'bg-green-100 text-green-800';
      case 'humorous': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '📝';
      default: return '';
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const remaining = new Date(expiresAt).getTime() - Date.now();
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (remaining <= 0) return 'Expirado';
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleStartEdit = (messageId: string, variantId: string, currentText: string) => {
    setEditingVariant({ messageId, variantId });
    setEditText(currentText);
  };

  const handleSaveEdit = () => {
    if (editingVariant) {
      onEdit(editingVariant.messageId, editingVariant.variantId, editText);
      setEditingVariant(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingVariant(null);
    setEditText('');
  };

  const sortedMessages = pendingMessages.sort((a, b) => {
    // Ordenar por prioridad y luego por tiempo de expiración
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
  });

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Cola de Aprobación
            </h3>
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
              {pendingMessages.length}
            </span>
          </div>
          
          <div className="text-sm text-gray-600">
            {pendingMessages.filter(m => new Date(m.expiresAt).getTime() - Date.now() < 60 * 60 * 1000).length} expiran pronto
          </div>
        </div>
      </div>

      {/* Lista de mensajes pendientes */}
      <div className="divide-y divide-gray-200">
        {sortedMessages.length === 0 ? (
          <div className="p-8 text-center">
            <ChatBubbleLeftIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay mensajes pendientes de aprobación</p>
            <p className="text-sm text-gray-400 mt-1">Los nuevos mensajes aparecerán aquí</p>
          </div>
        ) : (
          sortedMessages.map((message) => (
            <div key={message.id} className="p-6">
              {/* Header del mensaje */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={message.profileAvatar}
                    alt={message.profileName}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${message.profileName}&background=random`;
                    }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <span>{message.profileName}</span>
                      <span>{getPriorityIcon(message.priority)}</span>
                    </h4>
                    <div className="text-sm text-gray-500">
                      Trigger: {message.trigger} • Expira en: {formatTimeRemaining(message.expiresAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setExpandedMessage(
                      expandedMessage === message.id ? null : message.id
                    )}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {expandedMessage === message.id ? 'Ocultar' : 'Ver'} contexto
                  </button>
                </div>
              </div>

              {/* Contexto expandible */}
              {expandedMessage === message.id && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h5 className="font-medium text-gray-900 mb-2">Contexto de la conversación:</h5>
                  <p className="text-sm text-gray-700">{message.context}</p>
                </div>
              )}

              {/* Variantes de mensaje */}
              <div className="space-y-3">
                <h5 className="font-medium text-gray-900 flex items-center">
                  Variantes de respuesta
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {message.variants.length} opciones
                  </span>
                </h5>

                {message.variants.map((variant, index) => {
                  const isRecommended = variant.id === message.recommendedVariant;
                  const isEditing = editingVariant?.messageId === message.id && editingVariant?.variantId === variant.id;
                  
                  return (
                    <div
                      key={variant.id}
                      className={`border rounded-lg p-4 ${
                        isRecommended ? 'border-green-300 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            Opción {index + 1}
                          </span>
                          {isRecommended && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full flex items-center">
                              <StarIcon className="w-3 h-3 mr-1" />
                              Recomendada
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full ${getToneColor(variant.tone)}`}>
                            {variant.tone}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getConfidenceColor(variant.confidence)}`}>
                            {variant.confidence}%
                          </span>
                          <button
                            onClick={() => handleStartEdit(message.id, variant.id, variant.text)}
                            className="text-gray-400 hover:text-blue-600"
                            title="Editar mensaje"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Texto del mensaje */}
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white p-3 rounded border">
                          <p className="text-gray-800">{variant.text}</p>
                        </div>
                      )}

                      {/* Reasoning */}
                      <div className="mt-2 text-xs text-gray-600">
                        <strong>Razonamiento:</strong> {variant.reasoning}
                      </div>

                      {/* Acciones para cada variante */}
                      {!isEditing && (
                        <div className="flex space-x-2 mt-3">
                          <button
                            onClick={() => onApprove(message.id, variant.id)}
                            disabled={isProcessing === message.id}
                            className={`flex-1 text-sm px-4 py-2 rounded-md font-medium transition-colors ${
                              isRecommended
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                          >
                            {isProcessing === message.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Enviando...
                              </>
                            ) : (
                              <>
                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                Aprobar y Enviar
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Acciones generales del mensaje */}
              <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => onReject(message.id)}
                  disabled={isProcessing === message.id}
                  className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <XMarkIcon className="w-4 h-4 mr-1" />
                  Rechazar Todo
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer con estadísticas */}
      {pendingMessages.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex space-x-4">
              <span>🔥 Alta: {pendingMessages.filter(m => m.priority === 'high').length}</span>
              <span>⚡ Media: {pendingMessages.filter(m => m.priority === 'medium').length}</span>
              <span>📝 Baja: {pendingMessages.filter(m => m.priority === 'low').length}</span>
            </div>
            <div>
              Tiempo promedio de respuesta: 2.5 min
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
