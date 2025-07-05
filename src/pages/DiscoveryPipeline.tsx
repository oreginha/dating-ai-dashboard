import React from 'react';

export const DiscoveryPipelineDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🔍 Discovery Pipeline</h2>
        <p className="text-gray-600 mb-6">
          Analiza perfiles de Instagram para encontrar compatibilidad y generar estrategias personalizadas.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🚀</span>
            <h3 className="font-semibold text-blue-900">Motor de Análisis Avanzado</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">86%</div>
              <div className="text-sm text-gray-600">Score Máximo</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-green-600">6</div>
              <div className="text-sm text-gray-600">Factores Analizados</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600">Automatizado</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">M</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Macu López (@mc.uchi)</div>
                <div className="text-sm text-gray-600">Conexión musical ideal - DJ + Productor</div>
              </div>
              <div className="text-green-600 text-lg font-bold">86%</div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">C</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Cande Muñoz (@candemunioz)</div>
                <div className="text-sm text-gray-600">Conexión intelectual - Cantante + Profesora</div>
              </div>
              <div className="text-blue-600 text-lg font-bold">78%</div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-200">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-bold">P</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Pilar Mora (@pildoria)</div>
                <div className="text-sm text-gray-600">Conexión moderada - Diferentes estilos</div>
              </div>
              <div className="text-yellow-600 text-lg font-bold">52%</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white">
            <h4 className="font-bold text-lg mb-2">🎯 Recomendación del Sistema</h4>
            <p className="text-green-100 mb-3">
              Basado en el análisis de compatibilidad, se recomienda contactar primero:
            </p>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="font-semibold mb-2">✨ Estrategia para Macu López (86% compatibilidad):</p>
              <p className="italic text-sm">
                "Approach profesional musical - Conectar a través de la pasión compartida por la música electrónica"
              </p>
            </div>
            <button className="mt-3 bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              📋 Ver estrategia completa
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🔍 Analizar Nuevo Perfil</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de Instagram
            </label>
            <input
              type="url"
              placeholder="https://instagram.com/usuario"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="advanced"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="advanced" className="text-sm text-gray-700">
              Análisis avanzado (recomendado)
            </label>
          </div>
          
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            🚀 Analizar Perfil
          </button>
        </div>
      </div>
    </div>
  );
};