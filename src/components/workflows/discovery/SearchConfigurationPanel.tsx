import React, { useState } from 'react';
import { Cog6ToothIcon, MapPinIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

interface SearchCriteria {
  location: string;
  ageRange: [number, number];
  interests: string[];
  schedule: string;
  dailyLimit: number;
  minCompatibility: number;
}

interface SearchConfigurationPanelProps {
  currentCriteria: SearchCriteria;
  onUpdateCriteria: (criteria: SearchCriteria) => void;
  isUpdating?: boolean;
}

export const SearchConfigurationPanel: React.FC<SearchConfigurationPanelProps> = ({
  currentCriteria,
  onUpdateCriteria,
  isUpdating = false
}) => {
  const [criteria, setCriteria] = useState<SearchCriteria>(currentCriteria);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSave = () => {
    onUpdateCriteria(criteria);
  };

  const addInterest = (interest: string) => {
    if (interest && !criteria.interests.includes(interest)) {
      setCriteria({
        ...criteria,
        interests: [...criteria.interests, interest]
      });
    }
  };

  const removeInterest = (interest: string) => {
    setCriteria({
      ...criteria,
      interests: criteria.interests.filter(i => i !== interest)
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Cog6ToothIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Configuración de Búsqueda</h3>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showAdvanced ? 'Ocultar' : 'Mostrar'} Avanzado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ubicación */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <MapPinIcon className="w-4 h-4 mr-1" />
            Ubicación
          </label>
          <input
            type="text"
            value={criteria.location}
            onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
            placeholder="Ej: Madrid, España"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Rango de Edad */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <UserIcon className="w-4 h-4 mr-1" />
            Rango de Edad
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={criteria.ageRange[0]}
              onChange={(e) => setCriteria({ 
                ...criteria, 
                ageRange: [parseInt(e.target.value), criteria.ageRange[1]] 
              })}
              min="18"
              max="65"
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="flex items-center text-gray-500">-</span>
            <input
              type="number"
              value={criteria.ageRange[1]}
              onChange={(e) => setCriteria({ 
                ...criteria, 
                ageRange: [criteria.ageRange[0], parseInt(e.target.value)] 
              })}
              min="18"
              max="65"
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Intereses */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Intereses (etiquetas)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {criteria.interests.map((interest, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {interest}
                <button
                  onClick={() => removeInterest(interest)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Agregar interés (presiona Enter)"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addInterest(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {showAdvanced && (
          <>
            {/* Horario */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Horario de Búsqueda
              </label>
              <input
                type="text"
                value={criteria.schedule}
                onChange={(e) => setCriteria({ ...criteria, schedule: e.target.value })}
                placeholder="0 */2 * * * (cada 2 horas)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Formato cron expression</p>
            </div>

            {/* Límite Diario */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Límite Diario de Perfiles
              </label>
              <input
                type="number"
                value={criteria.dailyLimit}
                onChange={(e) => setCriteria({ ...criteria, dailyLimit: parseInt(e.target.value) })}
                min="5"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Compatibilidad Mínima */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Compatibilidad Mínima: {criteria.minCompatibility}%
              </label>
              <input
                type="range"
                min="50"
                max="95"
                value={criteria.minCompatibility}
                onChange={(e) => setCriteria({ ...criteria, minCompatibility: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50%</span>
                <span>70%</span>
                <span>95%</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={() => setCriteria(currentCriteria)}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>

      {/* Estado Actual */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Estado Actual:</h4>
        <div className="text-sm text-blue-800">
          <p>📍 {currentCriteria.location}</p>
          <p>👥 {currentCriteria.ageRange[0]}-{currentCriteria.ageRange[1]} años</p>
          <p>🎯 Límite: {currentCriteria.dailyLimit} perfiles/día</p>
          <p>⚡ Compatibilidad mín: {currentCriteria.minCompatibility}%</p>
        </div>
      </div>
    </div>
  );
};
