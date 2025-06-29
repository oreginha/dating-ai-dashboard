import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  EyeIcon, 
  XMarkIcon, 
  StarIcon,
  HeartIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface DiscoveredProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  avatarUrl: string;
  instagramUrl: string;
  compatibilityScore: number;
  interests: string[];
  lastSeen: string;
  discoveryDate: string;
  status: 'new' | 'analyzed' | 'contacted' | 'responded' | 'skipped';
  highlights: string[];
}

interface DiscoveryResultsTableProps {
  profiles: DiscoveredProfile[];
  onAnalyzeProfile: (profileId: string) => void;
  onSkipProfile: (profileId: string) => void;
  onPrioritizeProfile: (profileId: string) => void;
  onViewProfile: (profileId: string) => void;
  isLoading?: boolean;
}

export const DiscoveryResultsTable: React.FC<DiscoveryResultsTableProps> = ({
  profiles,
  onAnalyzeProfile,
  onSkipProfile,
  onPrioritizeProfile,
  onViewProfile,
  isLoading = false
}) => {
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'name'>('score');
  const [filterByStatus, setFilterByStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return '🆕';
      case 'analyzed': return '🔍';
      case 'contacted': return '💬';
      case 'responded': return '✅';
      case 'skipped': return '⏭️';
      default: return '❓';
    }
  };

  const filteredAndSortedProfiles = profiles
    .filter(profile => {
      const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           profile.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterByStatus === 'all' || profile.status === filterByStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.compatibilityScore - a.compatibilityScore;
        case 'date':
          return new Date(b.discoveryDate).getTime() - new Date(a.discoveryDate).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header con controles */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Perfiles Descubiertos</h3>
            <p className="text-sm text-gray-600">
              {filteredAndSortedProfiles.length} de {profiles.length} perfiles
            </p>
          </div>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            {/* Búsqueda */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar perfiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filtro por estado */}
            <select
              value={filterByStatus}
              onChange={(e) => setFilterByStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="new">Nuevos</option>
              <option value="analyzed">Analizados</option>
              <option value="contacted">Contactados</option>
              <option value="responded">Respondieron</option>
              <option value="skipped">Omitidos</option>
            </select>

            {/* Ordenar por */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'score' | 'date' | 'name')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="score">Compatibilidad</option>
              <option value="date">Fecha de descubrimiento</option>
              <option value="name">Nombre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando perfiles...</p>
          </div>
        ) : filteredAndSortedProfiles.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No se encontraron perfiles que coincidan con los criterios.</p>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compatibilidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Highlights
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50">
                  {/* Perfil Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${profile.name}&background=random`;
                        }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {profile.name}, {profile.age}
                        </div>
                        <div className="text-sm text-gray-500">
                          📍 {profile.location}
                        </div>
                        <div className="text-xs text-gray-400">
                          Descubierto: {new Date(profile.discoveryDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Compatibilidad */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(profile.compatibilityScore)}`}>
                      {profile.compatibilityScore}%
                    </span>
                    <div className="mt-1 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(profile.compatibilityScore / 20)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getStatusIcon(profile.status)}</span>
                      <span className="text-sm text-gray-600 capitalize">
                        {profile.status}
                      </span>
                    </div>
                    {profile.lastSeen && (
                      <div className="text-xs text-gray-400">
                        Última vez: {profile.lastSeen}
                      </div>
                    )}
                  </td>

                  {/* Highlights */}
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      {profile.highlights.slice(0, 2).map((highlight, index) => (
                        <div key={index} className="text-xs text-gray-600 mb-1">
                          • {highlight}
                        </div>
                      ))}
                      {profile.highlights.length > 2 && (
                        <div className="text-xs text-blue-600">
                          +{profile.highlights.length - 2} más...
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onViewProfile(profile.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Ver perfil completo"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      
                      {profile.status === 'new' && (
                        <>
                          <button
                            onClick={() => onAnalyzeProfile(profile.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Analizar perfil"
                          >
                            <ChatBubbleLeftIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onPrioritizeProfile(profile.id)}
                            className="text-yellow-600 hover:text-yellow-800"
                            title="Priorizar"
                          >
                            <HeartIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onSkipProfile(profile.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Omitir"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer con estadísticas */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex space-x-6">
            <span>🆕 Nuevos: {profiles.filter(p => p.status === 'new').length}</span>
            <span>🔍 Analizados: {profiles.filter(p => p.status === 'analyzed').length}</span>
            <span>💬 Contactados: {profiles.filter(p => p.status === 'contacted').length}</span>
            <span>✅ Respondieron: {profiles.filter(p => p.status === 'responded').length}</span>
          </div>
          <div>
            Promedio compatibilidad: {Math.round(profiles.reduce((acc, p) => acc + p.compatibilityScore, 0) / profiles.length)}%
          </div>
        </div>
      </div>
    </div>
  );
};
