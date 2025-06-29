import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DiscoveryAnalyticsProps {
  dailyDiscoveryData: Array<{
    date: string;
    profilesFound: number;
    profilesAnalyzed: number;
    profilesContacted: number;
  }>;
  compatibilityDistribution: Array<{
    range: string;
    count: number;
  }>;
  successRateData: Array<{
    criteria: string;
    successRate: number;
    attempts: number;
  }>;
  totalStats: {
    totalProfiles: number;
    avgCompatibility: number;
    successRate: number;
    activeSearches: number;
  };
}

export const DiscoveryAnalytics: React.FC<DiscoveryAnalyticsProps> = ({
  dailyDiscoveryData,
  compatibilityDistribution,
  successRateData,
  totalStats
}) => {
  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Perfiles</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalProfiles}</p>
            </div>
            <div className="text-blue-500">
              <span className="text-2xl">🔍</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Perfiles descubiertos</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compatibilidad Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.avgCompatibility}%</p>
            </div>
            <div className="text-green-500">
              <span className="text-2xl">💕</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Score promedio</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.successRate}%</p>
            </div>
            <div className="text-yellow-500">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Contactos exitosos</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Búsquedas Activas</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.activeSearches}</p>
            </div>
            <div className="text-purple-500">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Procesos en curso</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Perfiles por Día */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Perfiles Encontrados por Día
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyDiscoveryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                formatter={(value, name) => {
                  const nameMap: {[key: string]: string} = {
                    profilesFound: 'Encontrados',
                    profilesAnalyzed: 'Analizados',
                    profilesContacted: 'Contactados'
                  };
                  return [value, nameMap[name] || name];
                }}
              />
              <Legend 
                formatter={(value) => {
                  const nameMap: {[key: string]: string} = {
                    profilesFound: 'Encontrados',
                    profilesAnalyzed: 'Analizados',
                    profilesContacted: 'Contactados'
                  };
                  return nameMap[value] || value;
                }}
              />
              <Bar dataKey="profilesFound" fill="#3B82F6" name="profilesFound" />
              <Bar dataKey="profilesAnalyzed" fill="#10B981" name="profilesAnalyzed" />
              <Bar dataKey="profilesContacted" fill="#F59E0B" name="profilesContacted" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de Compatibilidad */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 Distribución de Compatibilidad
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={compatibilityDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, percent }) => `${range}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {compatibilityDistribution.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} perfiles`, 'Cantidad']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tasa de Éxito por Criterios */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🚀 Tasa de Éxito por Criterios de Búsqueda
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={successRateData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis 
                dataKey="criteria" 
                type="category" 
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'successRate') return [`${value}%`, 'Tasa de Éxito'];
                  return [value, name];
                }}
              />
              <Bar dataKey="successRate" fill="#10B981">
                {successRateData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.successRate > 70 ? '#10B981' : entry.successRate > 50 ? '#F59E0B' : '#EF4444'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tendencia de Performance */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📈 Tendencia de Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyDiscoveryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                formatter={(value, name) => {
                  const nameMap: {[key: string]: string} = {
                    profilesFound: 'Encontrados',
                    profilesAnalyzed: 'Analizados',
                    profilesContacted: 'Contactados'
                  };
                  return [value, nameMap[name] || name];
                }}
              />
              <Legend 
                formatter={(value) => {
                  const nameMap: {[key: string]: string} = {
                    profilesFound: 'Encontrados',
                    profilesAnalyzed: 'Analizados', 
                    profilesContacted: 'Contactados'
                  };
                  return nameMap[value] || value;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="profilesFound" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="profilesFound"
              />
              <Line 
                type="monotone" 
                dataKey="profilesAnalyzed" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="profilesAnalyzed"
              />
              <Line 
                type="monotone" 
                dataKey="profilesContacted" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="profilesContacted"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights y Recomendaciones */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💡 Insights y Recomendaciones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">🔍 Optimización de Búsqueda</h4>
            <p className="text-sm text-blue-800">
              {totalStats.avgCompatibility > 75 
                ? "Excelente calidad de perfiles. Considera aumentar el límite diario."
                : totalStats.avgCompatibility > 60
                ? "Buena calidad promedio. Ajusta criterios para mejorar compatibilidad."
                : "Calidad baja. Revisa y refina los criterios de búsqueda."
              }
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">🎯 Tasa de Conversión</h4>
            <p className="text-sm text-green-800">
              {totalStats.successRate > 20
                ? "Excelente tasa de éxito. Mantén la estrategia actual."
                : totalStats.successRate > 10
                ? "Tasa promedio. Optimiza mensajes de apertura."
                : "Tasa baja. Revisa approach y timing de contacto."
              }
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">⚡ Actividad del Sistema</h4>
            <p className="text-sm text-yellow-800">
              {totalStats.activeSearches > 3
                ? "Sistema muy activo. Monitorea recursos y límites de API."
                : totalStats.activeSearches > 1
                ? "Actividad normal. Todo funcionando correctamente."
                : "Actividad baja. Considera ajustar horarios de búsqueda."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
