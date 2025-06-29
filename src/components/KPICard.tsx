import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number; // percentage change
  timeframe: string;
  trend: 'up' | 'down' | 'neutral';
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink';
  icon?: React.ReactNode;
  loading?: boolean;
}

const colorVariants = {
  blue: 'border-blue-500 bg-blue-50',
  green: 'border-green-500 bg-green-50',
  yellow: 'border-yellow-500 bg-yellow-50',
  red: 'border-red-500 bg-red-50',
  purple: 'border-purple-500 bg-purple-50',
  pink: 'border-pink-500 bg-pink-50',
};

const trendColors = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-gray-600',
};

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'neutral' }) => {
  const iconClass = "w-4 h-4";
  
  switch (trend) {
    case 'up':
      return <ArrowTrendingUpIcon className={iconClass} />;
    case 'down':
      return <ArrowTrendingDownIcon className={iconClass} />;
    default:
      return <MinusIcon className={iconClass} />;
  }
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  timeframe,
  trend,
  color,
  icon,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-200 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-1/3 mt-2"></div>
      </div>
    );
  }

  return (
    <div className={clsx(
      'bg-white rounded-lg shadow p-6 border-l-4 hover:shadow-lg transition-shadow duration-200',
      colorVariants[color]
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {icon && <div className="text-gray-500">{icon}</div>}
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={clsx(
          'flex items-center text-sm font-medium',
          trendColors[trend]
        )}>
          <TrendIcon trend={trend} />
          <span className="ml-1">{Math.abs(change)}%</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">{timeframe}</p>
    </div>
  );
};

// Componente especializado para métricas de dating
interface DatingKPICardProps {
  type: 'profiles' | 'messages' | 'opportunities' | 'matches' | 'responses';
  value: number;
  change: number;
  timeframe?: string;
  loading?: boolean;
}

export const DatingKPICard: React.FC<DatingKPICardProps> = ({
  type,
  value,
  change,
  timeframe = 'vs. última semana',
  loading = false
}) => {
  const configs = {
    profiles: {
      title: 'Perfiles Analizados',
      color: 'blue' as const,
      icon: '👤',
    },
    messages: {
      title: 'Mensajes Enviados',
      color: 'purple' as const,
      icon: '💬',
    },
    opportunities: {
      title: 'Oportunidades Detectadas',
      color: 'yellow' as const,
      icon: '✨',
    },
    matches: {
      title: 'Matches Conseguidos',
      color: 'pink' as const,
      icon: '❤️',
    },
    responses: {
      title: 'Tasa de Respuesta',
      color: 'green' as const,
      icon: '📈',
    },
  };

  const config = configs[type];
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
  
  const formatValue = () => {
    if (type === 'responses') {
      return `${value}%`;
    }
    return value.toLocaleString();
  };

  return (
    <KPICard
      title={config.title}
      value={formatValue()}
      change={change}
      timeframe={timeframe}
      trend={trend}
      color={config.color}
      icon={<span className="text-lg">{config.icon}</span>}
      loading={loading}
    />
  );
};
