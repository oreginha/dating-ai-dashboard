import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  ChartBarIcon,
  UserIcon,
  HeartIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useTranslation, SectionWithHelp, HelpTooltip } from '../hooks/useTranslation';
import { useApi, ProfileAnalysisRequest, ProfileAnalysisResponse, CompatibilityResponse, StrategyResponse } from '../services/api';

interface AnalysisResult {
  profile?: ProfileAnalysisResponse['data'];
  compatibility?: CompatibilityResponse['data'];
  strategy?: StrategyResponse['data'];
}

export const DiscoveryPipelineDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { apiService, handleApiError, handleApiSuccess } = useApi();
  
  const [instagramUrl, setInstagramUrl] = useState('');
  const [enhancedAnalysis, setEnhancedAnalysis] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState<'idle' | 'profile' | 'compatibility' | 'strategy' | 'complete'>('idle');

  const isValidInstagramUrl = (url: string): boolean => {
    const patterns = [
      /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/,
      /^instagram\.com\/[a-zA-Z0-9._]+\/?$/,
      /^[a-zA-Z0-9._]+$/
    ];
    
    return patterns.some(pattern => pattern.test(url));
  };

  const normalizeInstagramUrl = (url: string): string => {
    // Si es solo el username, agregar el dominio completo
    if (!/^https?:\/\//.test(url) && !url.includes('instagram.com')) {
      return `https://instagram.com/${url.replace('@', '')}`;
    }
    
    // Si empieza con instagram.com, agregar https://
    if (url.startsWith('instagram.com')) {
      return `https://${url}`;
    }
    
    return url;
  };

  const handleAnalyzeProfile = async () => {
    if (!instagramUrl.trim()) {
      handleApiError({ message: 'Por favor ingresá una URL de Instagram' }, 'URL requerida');
      return;
    }

    const normalizedUrl = normalizeInstagramUrl(instagramUrl.trim());
    
    if (!isValidInstagramUrl(normalizedUrl)) {
      handleApiError({ message: 'URL de Instagram inválida' }, 'Formato incorrecto');
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);
    setCurrentStep('profile');

    try {
      console.log('🎯 Starting full analysis for:', normalizedUrl);

      // Paso 1: Análisis del perfil
      setCurrentStep('profile');
      const profileRequest: ProfileAnalysisRequest = {
        instagram_url: normalizedUrl,
        enhanced_analysis: enhancedAnalysis
      };

      const profileResponse = await apiService.analyzeProfile(profileRequest);
      
      if (!profileResponse.success || !profileResponse.data) {
        throw new Error(profileResponse.error || 'Error analizando perfil');
      }

      const profileData = profileResponse.data;
      console.log('✅ Profile analysis completed:', profileData);

      // Paso 2: Análisis de compatibilidad
      setCurrentStep('compatibility');
      const compatibilityResponse = await apiService.analyzeCompatibility({
        profile_id: profileData.profile_id,
        enhanced_analysis: enhancedAnalysis
      });

      if (!compatibilityResponse.success || !compatibilityResponse.data) {
        throw new Error(compatibilityResponse.error || 'Error calculando compatibilidad');
      }

      const compatibilityData = compatibilityResponse.data;
      console.log('✅ Compatibility analysis completed:', compatibilityData);

      // Paso 3: Generación de estrategia
      setCurrentStep('strategy');
      const strategyResponse = await apiService.generateStrategy({
        profile_id: profileData.profile_id,
        objective: 'romantic_connection',
        enhanced_strategy: enhancedAnalysis
      });

      if (!strategyResponse.success || !strategyResponse.data) {
        throw new Error(strategyResponse.error || 'Error generando estrategia');
      }

      const strategyData = strategyResponse.data;
      console.log('✅ Strategy generation completed:', strategyData);

      // Completar análisis
      setCurrentStep('complete');
      setAnalysisResult({
        profile: profileData,
        compatibility: compatibilityData,
        strategy: strategyData
      });

      handleApiSuccess('¡Análisis completo exitoso!');

    } catch (error: any) {
      console.error('❌ Analysis failed:', error);
      handleApiError(error, 'Error durante el análisis');
      setCurrentStep('idle');
    } finally {
      setAnalyzing(false);
    }
  };

  const getStepStatus = (step: string) => {
    if (currentStep === 'idle') return 'pending';
    
    const steps = ['profile', 'compatibility', 'strategy', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCompatibilityLabel = (score: number) => {
    if (score >= 0.8) return 'Alta Compatibilidad';
    if (score >= 0.6) return 'Compatibilidad Media';
    return 'Baja Compatibilidad';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('discovery.title')}</h1>
        <p className="text-gray-600">{t('discovery.subtitle')}</p>
      </div>

      {/* Formulario de análisis */}
      <SectionWithHelp title="Analizar Nuevo Perfil" helpKey="enhancedAnalysis">
        <div className="space-y-4">
          <div>
            <label htmlFor="instagram-url" className="block text-sm font-medium text-gray-700 mb-1">
              URL de Instagram
            </label>
            <div className="relative">
              <input
                id="instagram-url"
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder={t('discovery.form.urlPlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={analyzing}
              />
              <UserIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Podés usar: https://instagram.com/usuario, instagram.com/usuario, o solo el @usuario
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="enhanced-analysis"
              type="checkbox"
              checked={enhancedAnalysis}
              onChange={(e) => setEnhancedAnalysis(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={analyzing}
            />
            <label htmlFor="enhanced-analysis" className="text-sm text-gray-700">
              {t('discovery.form.enhancedAnalysis')}
            </label>
            <HelpTooltip helpKey="enhancedAnalysis" />
          </div>

          <button
            onClick={handleAnalyzeProfile}
            disabled={analyzing || !instagramUrl.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Analizando...
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="h-4 w-4" />
                {t('discovery.form.analyzeButton')}
              </>
            )}
          </button>
        </div>
      </SectionWithHelp>

      {/* Progress Steps */}
      {analyzing && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Progreso del Análisis</h3>
          <div className="space-y-3">
            {[
              { key: 'profile', label: 'Analizando perfil', icon: UserIcon },
              { key: 'compatibility', label: 'Calculando compatibilidad', icon: HeartIcon },
              { key: 'strategy', label: 'Generando estrategia', icon: ChartBarIcon },
              { key: 'complete', label: 'Análisis completo', icon: CheckCircleIcon }
            ].map(({ key, label, icon: Icon }) => {
              const status = getStepStatus(key);
              return (
                <div key={key} className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${status === 'completed' ? 'bg-green-500' : 
                      status === 'current' ? 'bg-blue-500' : 'bg-gray-300'}
                  `}>
                    {status === 'completed' ? (
                      <CheckCircleIcon className="h-4 w-4 text-white" />
                    ) : status === 'current' ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Icon className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <span className={`
                    ${status === 'completed' ? 'text-green-600 font-medium' :
                      status === 'current' ? 'text-blue-600 font-medium' : 'text-gray-500'}
                  `}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resultados del análisis */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Información del perfil */}
          {analysisResult.profile && (
            <SectionWithHelp title="Información del Perfil">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Username:</span>
                    <p className="text-lg font-semibold">@{analysisResult.profile.username}</p>
                  </div>
                  {analysisResult.profile.full_name && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Nombre:</span>
                      <p className="text-lg">{analysisResult.profile.full_name}</p>
                    </div>
                  )}
                  {analysisResult.profile.bio && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Bio:</span>
                      <p className="text-gray-700">{analysisResult.profile.bio}</p>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{analysisResult.profile.followers_count}</p>
                    <p className="text-sm text-gray-600">Seguidores</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{analysisResult.profile.following_count}</p>
                    <p className="text-sm text-gray-600">Siguiendo</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{analysisResult.profile.posts_count}</p>
                    <p className="text-sm text-gray-600">Posts</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold">
                      {analysisResult.profile.is_verified ? '✅' : '❌'}
                    </p>
                    <p className="text-sm text-gray-600">Verificado</p>
                  </div>
                </div>
              </div>
            </SectionWithHelp>
          )}

          {/* Score de compatibilidad */}
          {analysisResult.compatibility && (
            <SectionWithHelp title="Análisis de Compatibilidad" helpKey="compatibilityScore">
              <div className="space-y-6">
                {/* Score principal */}
                <div className="text-center">
                  <div className={`inline-flex items-center px-6 py-3 rounded-full ${getCompatibilityColor(analysisResult.compatibility.compatibility_score)}`}>
                    <HeartIcon className="h-6 w-6 mr-2" />
                    <span className="text-2xl font-bold">
                      {Math.round(analysisResult.compatibility.compatibility_score * 100)}%
                    </span>
                  </div>
                  <p className="text-lg font-medium text-gray-700 mt-2">
                    {getCompatibilityLabel(analysisResult.compatibility.compatibility_score)}
                  </p>
                </div>

                {/* Desglose por categorías */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(analysisResult.compatibility.tier_breakdown).map(([key, value]) => {
                    const labels: Record<string, string> = {
                      core_values: 'Valores Centrales',
                      social_patterns: 'Patrones Sociales',
                      interests: 'Intereses',
                      communication: 'Comunicación'
                    };
                    
                    return (
                      <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{Math.round(value * 100)}%</p>
                        <p className="text-sm text-gray-600">{labels[key]}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Predicción de éxito */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Predicción de Éxito</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-blue-700">Probabilidad:</span>
                      <p className="text-lg font-bold text-blue-900">
                        {Math.round(analysisResult.compatibility.success_prediction.success_probability * 100)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-blue-700">Confianza:</span>
                      <p className="text-lg font-bold text-blue-900 capitalize">
                        {analysisResult.compatibility.success_prediction.confidence_level}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-blue-700">Recomendación:</span>
                      <p className="text-lg font-bold text-blue-900">
                        {analysisResult.compatibility.success_prediction.recommendation.action.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SectionWithHelp>
          )}

          {/* Estrategia de conversación */}
          {analysisResult.strategy && (
            <SectionWithHelp title="Estrategia de Conversación" helpKey="responseGenerator">
              <div className="space-y-6">
                {/* Plan de conversación por fases */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(analysisResult.strategy.conversation_plan).map(([phaseKey, phase]) => (
                    <div key={phaseKey} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{phase.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">Duración: {phase.duration}</p>
                      <p className="text-sm text-gray-700 mb-3">{phase.objective}</p>
                      
                      <div className="space-y-2">
                        <span className="text-xs font-medium text-gray-500 uppercase">Mensajes de ejemplo:</span>
                        {phase.sample_messages.map((message, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded text-sm text-gray-700">
                            "{message}"
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Timing y señales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-3">✅ Indicadores de Éxito</h4>
                    <ul className="space-y-1">
                      {analysisResult.strategy.success_indicators.map((indicator, index) => (
                        <li key={index} className="text-sm text-green-800">• {indicator}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-3">🚨 Señales de Alerta</h4>
                    <ul className="space-y-1">
                      {analysisResult.strategy.red_flags.map((flag, index) => (
                        <li key={index} className="text-sm text-red-800">• {flag}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Estrategia de timing */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-3">⏰ Estrategia de Timing</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium text-yellow-800">Mensaje inicial:</span>
                      <p className="text-sm text-yellow-700">{analysisResult.strategy.timing_strategy.initial_message}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-yellow-800">Seguimiento:</span>
                      <p className="text-sm text-yellow-700">{analysisResult.strategy.timing_strategy.follow_up}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-yellow-800">Escalación:</span>
                      <p className="text-sm text-yellow-700">{analysisResult.strategy.timing_strategy.escalation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </SectionWithHelp>
          )}
        </div>
      )}

      {/* Tips de ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">{t('discovery.tips.title')}</h3>
        <ul className="space-y-2 text-blue-800">
          <li>• {t('discovery.tips.publicProfile')}</li>
          <li>• {t('discovery.tips.completeUrl')}</li>
          <li>• {t('discovery.tips.waitAnalysis')}</li>
          <li>• {t('discovery.tips.enhancedMode')}</li>
        </ul>
      </div>
    </div>
  );
};