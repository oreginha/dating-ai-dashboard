import React, { useState } from 'react';
import { MagnifyingGlassIcon, PlayIcon } from '@heroicons/react/24/outline';

interface ManualDiscoveryProps {
  onAnalyzeProfile: (url: string) => void;
  isAnalyzing?: boolean;
  lastAnalysisResult?: {
    success: boolean;
    profileData?: any;
    error?: string;
  };
}

export const ManualDiscovery: React.FC<ManualDiscoveryProps> = ({
  onAnalyzeProfile,
  isAnalyzing = false,
  lastAnalysisResult
}) => {
  const [profileUrl, setProfileUrl] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateInstagramUrl = (url: string): boolean => {
    const instagramPattern = /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/;
    return instagramPattern.test(url);
  };

  const handleAnalyze = () => {
    if (!profileUrl.trim()) {
      setValidationError('Por favor ingresa una URL de Instagram');
      return;
    }

    if (!validateInstagramUrl(profileUrl)) {
      setValidationError('URL de Instagram inválida. Formato: https://instagram.com/username');
      return;
    }

    setValidationError('');
    onAnalyzeProfile(profileUrl);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setProfileUrl(url);
    
    if (validationError && url.trim() && validateInstagramUrl(url)) {
      setValidationError('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnalyzing) {
      handleAnalyze();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Análisis Manual de Perfil</h3>
      </div>

      <div className="space-y-4">
        {/* Input de URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de Instagram
          </label>
          <div className="flex space-x-2">
            <input
              type="url"
              value={profileUrl}
              onChange={handleUrlChange}
              onKeyPress={handleKeyPress}
              placeholder="https://instagram.com/username"
              className={`flex-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                validationError ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isAnalyzing}
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !profileUrl.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analizando...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4" />
                  <span>Analizar</span>
                </>
              )}
            </button>
          </div>
          
          {validationError && (
            <p className="mt-1 text-sm text-red-600">{validationError}</p>
          )}
          
          <p className="mt-1 text-xs text-gray-500">
            Ingresa una URL de Instagram para análisis inmediato
          </p>
        </div>

        {/* Ejemplos de URLs */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Ejemplos de URLs válidas:</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div>• https://instagram.com/username</div>
            <div>• https://www.instagram.com/username/</div>
            <div>• https://instagram.com/user.name_123</div>
          </div>
        </div>

        {/* Resultado del análisis */}
        {lastAnalysisResult && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Resultado del Último Análisis:</h4>
            
            {lastAnalysisResult.success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-green-800 mb-2">
                      Análisis Completado
                    </h5>
                    
                    {lastAnalysisResult.profileData && (
                      <div className="space-y-2 text-sm text-green-700">
                        <div className="flex justify-between">
                          <span>Nombre:</span>
                          <span className="font-medium">{lastAnalysisResult.profileData.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Compatibilidad:</span>
                          <span className={`font-medium ${
                            lastAnalysisResult.profileData.compatibilityScore > 75 
                              ? 'text-green-600' 
                              : lastAnalysisResult.profileData.compatibilityScore > 50 
                              ? 'text-yellow-600' 
                              : 'text-red-600'
                          }`}>
                            {lastAnalysisResult.profileData.compatibilityScore || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estado:</span>
                          <span className="font-medium">{lastAnalysisResult.profileData.status || 'Nuevo'}</span>
                        </div>
                        
                        {lastAnalysisResult.profileData.highlights && lastAnalysisResult.profileData.highlights.length > 0 && (
                          <div className="mt-3">
                            <span className="text-sm font-medium">Highlights:</span>
                            <ul className="mt-1 list-disc list-inside text-sm">
                              {lastAnalysisResult.profileData.highlights.slice(0, 3).map((highlight: string, index: number) => (
                                <li key={index}>{highlight}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-3 flex space-x-2">
                      <button className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200">
                        Ver Perfil Completo
                      </button>
                      <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200">
                        Agregar a Pipeline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">❌</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-red-800 mb-2">
                      Error en el Análisis
                    </h5>
                    <p className="text-sm text-red-700">
                      {lastAnalysisResult.error || 'Error desconocido durante el análisis'}
                    </p>
                    <div className="mt-3">
                      <button className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200">
                        Reintentar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tips y información */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tips para el Análisis Manual</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Asegúrate de que el perfil sea público o accesible</li>
            <li>• Los perfiles con más contenido generan mejores análisis</li>
            <li>• El análisis incluye bio, posts recientes y interacciones</li>
            <li>• Los resultados se guardan automáticamente en el sistema</li>
          </ul>
        </div>

        {/* Historial rápido */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Análisis Recientes</h4>
          <div className="space-y-2">
            {/* Aquí se podrían mostrar los últimos análisis manuales */}
            <div className="text-sm text-gray-500 italic">
              No hay análisis recientes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
