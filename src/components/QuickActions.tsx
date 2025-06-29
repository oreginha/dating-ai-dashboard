import React from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  EyeIcon, 
  PaperAirplaneIcon,
  HeartIcon,
  XMarkIcon,
  CheckIcon,
  PencilIcon,
  ArrowPathIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

// Tipos para las acciones rápidas
interface QuickActionProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  tooltip?: string;
}

const variants = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  success: 'bg-green-500 hover:bg-green-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
};

const sizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

// Componente base para botones de acción rápida
export const QuickActionButton: React.FC<QuickActionProps> = ({
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  children,
  icon,
  tooltip,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      title={tooltip}
      className={clsx(
        'inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size]
      )}
    >
      {loading ? (
        <ArrowPathIcon className="w-4 h-4 animate-spin" />
      ) : (
        icon && <span className="w-4 h-4">{icon}</span>
      )}
      {children}
    </button>
  );
};

// Acciones específicas para Discovery Pipeline
interface DiscoveryActionsProps {
  onAnalyzeProfile: (profileUrl: string) => void;
  onSkipProfile: (profileId: string) => void;
  onPrioritizeProfile: (profileId: string) => void;
  profileId?: string;
  profileUrl?: string;
  loading?: boolean;
}

export const DiscoveryActions: React.FC<DiscoveryActionsProps> = ({
  onAnalyzeProfile,
  onSkipProfile,
  onPrioritizeProfile,
  profileId,
  profileUrl,
  loading = false,
}) => {
  return (
    <div className="flex gap-2">
      <QuickActionButton
        onClick={() => profileUrl && onAnalyzeProfile(profileUrl)}
        disabled={!profileUrl}
        loading={loading}
        variant="primary"
        size="sm"
        icon={<ChartBarIcon />}
        tooltip="Analizar perfil completo"
      >
        Analizar
      </QuickActionButton>
      
      <QuickActionButton
        onClick={() => profileId && onSkipProfile(profileId)}
        disabled={!profileId}
        variant="secondary"
        size="sm"
        icon={<XMarkIcon />}
        tooltip="Saltar este perfil"
      >
        Saltar
      </QuickActionButton>
      
      <QuickActionButton
        onClick={() => profileId && onPrioritizeProfile(profileId)}
        disabled={!profileId}
        variant="warning"
        size="sm"
        icon={<HeartIcon />}
        tooltip="Marcar como prioritario"
      >
        Priorizar
      </QuickActionButton>
    </div>
  );
};

// Acciones para Conversation Manager
interface ConversationActionsProps {
  onSendMessage: (conversationId: string, message: string) => void;
  onEscalateConversation: (conversationId: string) => void;
  onMarkInactive: (conversationId: string) => void;
  onViewHistory: (conversationId: string) => void;
  conversationId: string;
  loading?: boolean;
}

export const ConversationActions: React.FC<ConversationActionsProps> = ({
  onSendMessage,
  onEscalateConversation,
  onMarkInactive,
  onViewHistory,
  conversationId,
  loading = false,
}) => {
  const handleSendMessage = () => {
    // En una implementación real, esto abriría un modal o formulario
    const message = prompt('Mensaje a enviar:');
    if (message) {
      onSendMessage(conversationId, message);
    }
  };

  return (
    <div className="flex gap-2">
      <QuickActionButton
        onClick={() => onViewHistory(conversationId)}
        variant="secondary"
        size="sm"
        icon={<EyeIcon />}
        tooltip="Ver historial completo"
      >
        Ver
      </QuickActionButton>
      
      <QuickActionButton
        onClick={handleSendMessage}
        variant="primary"
        size="sm"
        icon={<PaperAirplaneIcon />}
        tooltip="Enviar mensaje"
        loading={loading}
      >
        Mensaje
      </QuickActionButton>
      
      <QuickActionButton
        onClick={() => onEscalateConversation(conversationId)}
        variant="warning"
        size="sm"
        icon={<ArrowPathIcon />}
        tooltip="Escalar conversación"
      >
        Escalar
      </QuickActionButton>
      
      <QuickActionButton
        onClick={() => onMarkInactive(conversationId)}
        variant="danger"
        size="sm"
        icon={<PauseIcon />}
        tooltip="Marcar como inactiva"
      >
        Pausar
      </QuickActionButton>
    </div>
  );
};

// Acciones para Opportunity Detector
interface OpportunityActionsProps {
  onGenerateResponse: (opportunityId: string) => void;
  onDismissOpportunity: (opportunityId: string) => void;
  onManualTrigger: (profileId: string) => void;
  opportunityId: string;
  profileId?: string;
  loading?: boolean;
}

export const OpportunityActions: React.FC<OpportunityActionsProps> = ({
  onGenerateResponse,
  onDismissOpportunity,
  onManualTrigger,
  opportunityId,
  profileId,
  loading = false,
}) => {
  return (
    <div className="flex gap-2">
      <QuickActionButton
        onClick={() => onGenerateResponse(opportunityId)}
        variant="success"
        size="sm"
        icon={<PencilIcon />}
        tooltip="Generar respuesta automática"
        loading={loading}
      >
        Responder
      </QuickActionButton>
      
      {profileId && (
        <QuickActionButton
          onClick={() => onManualTrigger(profileId)}
          variant="primary"
          size="sm"
          icon={<PlayIcon />}
          tooltip="Activar manualmente"
        >
          Activar
        </QuickActionButton>
      )}
      
      <QuickActionButton
        onClick={() => onDismissOpportunity(opportunityId)}
        variant="secondary"
        size="sm"
        icon={<XMarkIcon />}
        tooltip="Descartar oportunidad"
      >
        Descartar
      </QuickActionButton>
    </div>
  );
};

// Acciones para Auto-Response System
interface AutoResponseActionsProps {
  onApproveMessage: (messageId: string, variantIndex: number) => void;
  onEditAndSend: (messageId: string, editedText: string) => void;
  onRejectMessage: (messageId: string) => void;
  messageId: string;
  variants?: Array<{ text: string; score: number }>;
  loading?: boolean;
}

export const AutoResponseActions: React.FC<AutoResponseActionsProps> = ({
  onApproveMessage,
  onEditAndSend,
  onRejectMessage,
  messageId,
  variants = [],
  loading = false,
}) => {
  const handleEditAndSend = () => {
    const bestVariant = variants.length > 0 ? variants[0].text : '';
    const editedText = prompt('Editar mensaje:', bestVariant);
    if (editedText) {
      onEditAndSend(messageId, editedText);
    }
  };

  const handleApprove = () => {
    // Aprobar la mejor variante (índice 0)
    onApproveMessage(messageId, 0);
  };

  return (
    <div className="flex gap-2">
      <QuickActionButton
        onClick={handleApprove}
        variant="success"
        size="sm"
        icon={<CheckIcon />}
        tooltip="Aprobar y enviar"
        loading={loading}
        disabled={variants.length === 0}
      >
        Aprobar
      </QuickActionButton>
      
      <QuickActionButton
        onClick={handleEditAndSend}
        variant="primary"
        size="sm"
        icon={<PencilIcon />}
        tooltip="Editar antes de enviar"
      >
        Editar
      </QuickActionButton>
      
      <QuickActionButton
        onClick={() => onRejectMessage(messageId)}
        variant="danger"
        size="sm"
        icon={<XMarkIcon />}
        tooltip="Rechazar mensaje"
      >
        Rechazar
      </QuickActionButton>
    </div>
  );
};

// Panel de acciones rápidas globales
interface GlobalQuickActionsProps {
  onStartDiscovery: () => void;
  onStopDiscovery: () => void;
  onManualAnalysis: () => void;
  onRefreshData: () => void;
  discoveryRunning?: boolean;
  loading?: boolean;
}

export const GlobalQuickActions: React.FC<GlobalQuickActionsProps> = ({
  onStartDiscovery,
  onStopDiscovery,
  onManualAnalysis,
  onRefreshData,
  discoveryRunning = false,
  loading = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <QuickActionButton
          onClick={discoveryRunning ? onStopDiscovery : onStartDiscovery}
          variant={discoveryRunning ? 'danger' : 'success'}
          size="md"
          icon={discoveryRunning ? <PauseIcon /> : <PlayIcon />}
          loading={loading}
        >
          {discoveryRunning ? 'Detener Discovery' : 'Iniciar Discovery'}
        </QuickActionButton>
        
        <QuickActionButton
          onClick={onManualAnalysis}
          variant="primary"
          size="md"
          icon={<ChartBarIcon />}
        >
          Análisis Manual
        </QuickActionButton>
        
        <QuickActionButton
          onClick={onRefreshData}
          variant="secondary"
          size="md"
          icon={<ArrowPathIcon />}
        >
          Actualizar Datos
        </QuickActionButton>
        
        <QuickActionButton
          onClick={() => window.open('/analytics', '_blank')}
          variant="warning"
          size="md"
          icon={<ChartBarIcon />}
        >
          Ver Analytics
        </QuickActionButton>
      </div>
    </div>
  );
};
