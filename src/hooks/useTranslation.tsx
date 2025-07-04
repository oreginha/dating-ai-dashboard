/**
 * Hook de localización para el Dating AI Dashboard
 * Proporciona textos en español y funciones de ayuda
 */
import { useMemo } from 'react';
import es from '../locales/es';

type TranslationKey = string;

export const useTranslation = () => {
  const t = useMemo(() => {
    const getTranslation = (key: TranslationKey, params?: string[]): string => {
      // Navegar por el objeto de traducciones usando dot notation
      const keys = key.split('.');
      let value: any = es;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          console.warn(`Translation key not found: ${key}`);
          return key; // Retorna la key si no encuentra la traducción
        }
      }
      
      if (typeof value !== 'string') {
        console.warn(`Translation value is not a string: ${key}`);
        return key;
      }
      
      // Reemplazar parámetros {0}, {1}, etc.
      if (params && params.length > 0) {
        return params.reduce((str, param, index) => {
          return str.replace(`{${index}}`, param);
        }, value);
      }
      
      return value;
    };
    
    return getTranslation;
  }, []);

  return { t };
};

// Hook para tooltips y ayuda contextual
export const useHelp = () => {
  const { t } = useTranslation();
  
  const getHelpText = (helpKey: string): string => {
    return t(`help.${helpKey}`);
  };
  
  const getErrorMessage = (errorKey: string): string => {
    return t(`notifications.errors.${errorKey}`);
  };
  
  const getSuccessMessage = (successKey: string): string => {
    return t(`notifications.${successKey}`);
  };
  
  return {
    getHelpText,
    getErrorMessage,
    getSuccessMessage
  };
};

// Componente de ayuda contextual
import React from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface HelpTooltipProps {
  helpKey: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ 
  helpKey, 
  position = 'top',
  className = '' 
}) => {
  const { getHelpText } = useHelp();
  const helpText = getHelpText(helpKey);
  
  return (
    <div className={`relative inline-block ${className}`}>
      <div className="group">
        <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
        
        {/* Tooltip */}
        <div className={`
          invisible group-hover:visible
          absolute z-10 px-3 py-2 
          text-sm text-white bg-gray-900 rounded-lg shadow-lg
          max-w-xs break-words
          transition-opacity duration-200 opacity-0 group-hover:opacity-100
          ${position === 'top' ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-2' : ''}
          ${position === 'bottom' ? 'top-full left-1/2 transform -translate-x-1/2 mt-2' : ''}
          ${position === 'left' ? 'right-full top-1/2 transform -translate-y-1/2 mr-2' : ''}
          ${position === 'right' ? 'left-full top-1/2 transform -translate-y-1/2 ml-2' : ''}
        `}>
          {helpText}
          
          {/* Arrow */}
          <div className={`
            absolute w-2 h-2 bg-gray-900 transform rotate-45
            ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' : ''}
            ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' : ''}
            ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' : ''}
            ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1' : ''}
          `} />
        </div>
      </div>
    </div>
  );
};

// Componente de sección con ayuda
interface SectionWithHelpProps {
  title: string;
  helpKey?: string;
  children: React.ReactNode;
  className?: string;
}

export const SectionWithHelp: React.FC<SectionWithHelpProps> = ({
  title,
  helpKey,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {helpKey && <HelpTooltip helpKey={helpKey} />}
      </div>
      {children}
    </div>
  );
};

// Componente de métrica con ayuda
interface MetricWithHelpProps {
  label: string;
  value: string | number;
  helpKey?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export const MetricWithHelp: React.FC<MetricWithHelpProps> = ({
  label,
  value,
  helpKey,
  trend,
  trendValue,
  className = ''
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '➡️';
    }
  };
  
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  
  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">{label}</span>
          {helpKey && <HelpTooltip helpKey={helpKey} position="right" />}
        </div>
        {trend && trendValue && (
          <span className={`text-xs flex items-center gap-1 ${getTrendColor()}`}>
            <span>{getTrendIcon()}</span>
            {trendValue}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
};

// Componente de botón con confirmación
interface ConfirmButtonProps {
  children: React.ReactNode;
  onConfirm: () => void;
  confirmMessage?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

export const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  children,
  onConfirm,
  confirmMessage,
  variant = 'primary',
  disabled = false,
  className = ''
}) => {
  const { t } = useTranslation();
  
  const handleClick = () => {
    const message = confirmMessage || t('common.confirmDelete');
    if (window.confirm(message)) {
      onConfirm();
    }
  };
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-md font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default useTranslation;