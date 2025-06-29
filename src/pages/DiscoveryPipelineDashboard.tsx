import { useState } from 'react';
import { 
  SearchConfigurationPanel, 
  DiscoveryResultsTable, 
  DiscoveryAnalytics, 
  ManualDiscovery 
} from '../components/workflows/discovery';

// Types for this component
interface DiscoveryProfile {
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
  status: 'new' | 'analyzed' | 'contacted' | 'skipped';
  highlights: string[];
}

// Mock data - En producción esto vendría del MCP server
const mockSearchCriteria = {
  location: 'Madrid, España',
  ageRange: [25, 35] as [number, number],
  interests: ['viajes', 'fotografía', 'música', 'fitness'],
  schedule: '0 */3 * * *',
  dailyLimit: 20,
  minCompatibility: 70
};

const mockProfiles: DiscoveryProfile[] = [
  {
    id: '1',
    name: 'Ana García',
    age: 28,
    location: 'Madrid, España',
    avatarUrl: 'https://ui-avatars.com/api/?name=Ana+Garcia&background=random',
    instagramUrl: 'https://instagram.com/ana_garcia',
    compatibilityScore: 87,
    interests: ['viajes', 'fotografía', 'yoga'],
    lastSeen: '2 horas',
    discoveryDate: '2024-06-29T10:30:00Z',
    status: 'new' as const,
    highlights: [
      'Comparte interés en fotografía de viajes',
      'Perfil muy activo con contenido auténtico',
      'Similar grupo demográfico'
    ]
  },
  {
    id: '2',
    name: 'María López',
    age: 32,
    location: 'Barcelona, España',
    avatarUrl: 'https://ui-avatars.com/api/?name=Maria+Lopez&background=random',
    instagramUrl: 'https://instagram.com/maria_lopez',
    compatibilityScore: 72,
    interests: ['música', 'arte', 'cocina'],
    lastSeen: '1 día',
    discoveryDate: '2024-06-28T15:45:00Z',
    status: 'analyzed' as const,
    highlights: [
      'Músico profesional',
      'Intereses creativos compatibles',
      'Engagement alto en posts'
    ]
  },
  {
    id: '3',
    name: 'Carmen Ruiz',
    age: 26,
    location: 'Valencia, España',
    avatarUrl: 'https://ui-avatars.com/api/?name=Carmen+Ruiz&background=random',
    instagramUrl: 'https://instagram.com/carmen_ruiz',
    compatibilityScore: 94,
    interests: ['fitness', 'nutrición', 'viajes'],
    lastSeen: '3 horas',
    discoveryDate: '2024-06-29T08:15:00Z',
    status: 'contacted' as const,
    highlights: [
      'Match perfecto en lifestyle saludable',
      'Viaja frecuentemente por trabajo',
      'Stories muy auténticas'
    ]
  }
];

const mockAnalyticsData = {
  dailyDiscoveryData: [
    { date: '2024-06-23', profilesFound: 15, profilesAnalyzed: 12, profilesContacted: 3 },
    { date: '2024-06-24', profilesFound: 18, profilesAnalyzed: 15, profilesContacted: 4 },
    { date: '2024-06-25', profilesFound: 22, profilesAnalyzed: 18, profilesContacted: 6 },
    { date: '2024-06-26', profilesFound: 19, profilesAnalyzed: 16, profilesContacted: 5 },
    { date: '2024-06-27', profilesFound: 25, profilesAnalyzed: 20, profilesContacted: 7 },
    { date: '2024-06-28', profilesFound: 21, profilesAnalyzed: 17, profilesContacted: 4 },
    { date: '2024-06-29', profilesFound: 16, profilesAnalyzed: 14, profilesContacted: 3 }
  ],
  compatibilityDistribution: [
    { range: '90-100%', count: 8 },
    { range: '80-89%', count: 15 },
    { range: '70-79%', count: 23 },
    { range: '60-69%', count: 12 },
    { range: '50-59%', count: 5 }
  ],
  successRateData: [
    { criteria: 'Madrid + Viajes', successRate: 85, attempts: 20 },
    { criteria: 'Barcelona + Arte', successRate: 72, attempts: 18 },
    { criteria: 'Valencia + Fitness', successRate: 91, attempts: 15 },
    { criteria: 'Sevilla + Música', successRate: 68, attempts: 12 },
    { criteria: 'Bilbao + Tech', successRate: 58, attempts: 10 }
  ],
  totalStats: {
    totalProfiles: 127,
    avgCompatibility: 76,
    successRate: 22,
    activeSearches: 3
  }
};

export const DiscoveryPipelineDashboard: React.FC = () => {
  const [searchCriteria, setSearchCriteria] = useState(mockSearchCriteria);
  const [profiles, setProfiles] = useState<DiscoveryProfile[]>(mockProfiles);
  const [isUpdatingCriteria, setIsUpdatingCriteria] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);

  // Handlers para las acciones
  const handleUpdateCriteria = async (newCriteria: typeof mockSearchCriteria) => {
    setIsUpdatingCriteria(true);
    try {
      // Aquí se haría la llamada al MCP server
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setSearchCriteria(newCriteria);
      console.log('Criterios actualizados:', newCriteria);
    } catch (error) {
      console.error('Error updating criteria:', error);
    } finally {
      setIsUpdatingCriteria(false);
    }
  };

  const handleAnalyzeProfile = async (profileId: string) => {
    try {
      // Simular análisis de perfil
      console.log('Analizando perfil:', profileId);
      
      // Actualizar estado del perfil
      setProfiles(prev => prev.map(p => 
        p.id === profileId 
          ? { ...p, status: 'analyzed' as const }
          : p
      ));
    } catch (error) {
      console.error('Error analyzing profile:', error);
    }
  };

  const handleSkipProfile = async (profileId: string) => {
    try {
      console.log('Omitiendo perfil:', profileId);
      
      setProfiles(prev => prev.map(p => 
        p.id === profileId 
          ? { ...p, status: 'skipped' as const }
          : p
      ));
    } catch (error) {
      console.error('Error skipping profile:', error);
    }
  };

  const handlePrioritizeProfile = async (profileId: string) => {
    try {
      console.log('Priorizando perfil:', profileId);
      
      // Mover perfil al principio de la lista
      setProfiles(prev => {
        const profile = prev.find(p => p.id === profileId);
        if (!profile) return prev;
        
        const otherProfiles = prev.filter(p => p.id !== profileId);
        return [profile, ...otherProfiles];
      });
    } catch (error) {
      console.error('Error prioritizing profile:', error);
    }
  };

  const handleViewProfile = (profileId: string) => {
    console.log('Viendo perfil completo:', profileId);
    // Aquí se abriría un modal o se navegaría a la página del perfil
  };

  const handleManualAnalysis = async (url: string) => {
    setIsAnalyzing(true);
    setLastAnalysisResult(null);
    
    try {
      // Simular análisis manual
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simular resultado exitoso
      const mockResult = {
        success: true,
        profileData: {
          name: 'Perfil Manual',
          compatibilityScore: Math.floor(Math.random() * 40) + 60,
          status: 'new',
          highlights: [
            'Perfil auténtico y activo',
            'Intereses compatibles detectados',
            'Buena calidad de contenido'
          ]
        }
      };
      
      setLastAnalysisResult(mockResult);
      console.log('Análisis manual completado:', url);
      
    } catch (error) {
      setLastAnalysisResult({
        success: false,
        error: 'Error al analizar el perfil. Verifica que la URL sea correcta y el perfil sea público.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🔍 Discovery Pipeline</h1>
        <p className="text-gray-600 mt-2">
          Gestiona la búsqueda y descubrimiento automático de perfiles compatibles
        </p>
      </div>

      {/* Grid Layout */}
      <div className="space-y-8">
        {/* Primera fila: Configuración y Análisis Manual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SearchConfigurationPanel
            currentCriteria={searchCriteria}
            onUpdateCriteria={handleUpdateCriteria}
            isUpdating={isUpdatingCriteria}
          />
          <ManualDiscovery
            onAnalyzeProfile={handleManualAnalysis}
            isAnalyzing={isAnalyzing}
            lastAnalysisResult={lastAnalysisResult}
          />
        </div>

        {/* Segunda fila: Tabla de Resultados */}
        <DiscoveryResultsTable
          profiles={profiles}
          onAnalyzeProfile={handleAnalyzeProfile}
          onSkipProfile={handleSkipProfile}
          onPrioritizeProfile={handlePrioritizeProfile}
          onViewProfile={handleViewProfile}
        />

        {/* Tercera fila: Analytics */}
        <DiscoveryAnalytics
          dailyDiscoveryData={mockAnalyticsData.dailyDiscoveryData}
          compatibilityDistribution={mockAnalyticsData.compatibilityDistribution}
          successRateData={mockAnalyticsData.successRateData}
          totalStats={mockAnalyticsData.totalStats}
        />
      </div>
    </div>
  );
};
