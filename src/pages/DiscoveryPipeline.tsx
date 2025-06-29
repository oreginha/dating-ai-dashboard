import { useState } from 'react';
import { useAppStore, useProfiles, useConfig } from '../store';
import { useApi } from '../services/api';
import { useNotifications } from '../components/Notifications';

interface DiscoveryFilters {
  compatibility: number;
  location: string;
  ageRange: [number, number];
  status: string;
  dateRange: string;
}

interface ProfileCardProps {
  profile: any;
  onAnalyze: (profile: any) => void;
  onSkip: (profile: any) => void;
  onPrioritize: (profile: any) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onAnalyze, onSkip, onPrioritize }) => {
  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'discovered': return 'bg-blue-100 text-blue-800';
      case 'analyzed': return 'bg-purple-100 text-purple-800';
      case 'contacted': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <img
            src={profile.photos[0] || '/default-avatar.png'}
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
            <p className="text-sm text-gray-600">
              {profile.age && `${profile.age} years old`}
              {profile.location && ` • ${profile.location}`}
            </p>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {profile.bio || 'No bio available'}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {profile.interests?.slice(0, 3).map((interest: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                  {interest}
                </span>
              ))}
              {profile.interests?.length > 3 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                  +{profile.interests.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCompatibilityColor(profile.compatibilityScore)}`}>
            {profile.compatibilityScore}%
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(profile.status)}`}>
            {profile.status}
          </span>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onSkip(profile)}
          className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          Skip
        </button>
        <button
          onClick={() => onPrioritize(profile)}
          className="px-3 py-1 text-sm text-yellow-600 bg-yellow-100 rounded hover:bg-yellow-200 transition-colors"
        >
          Prioritize
        </button>
        <button
          onClick={() => onAnalyze(profile)}
          className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        >
          Analyze
        </button>
      </div>
    </div>
  );
};

export const DiscoveryPipelineDashboard: React.FC = () => {
  const profiles = useProfiles();
  const config = useConfig();
  const { apiService } = useApi();
  const { showSuccess, showError } = useNotifications();
  const { updateProfile, updateConfig } = useAppStore();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [filters, setFilters] = useState<DiscoveryFilters>({
    compatibility: 0,
    location: '',
    ageRange: [18, 50],
    status: '',
    dateRange: 'all',
  });

  const filteredProfiles = profiles.filter(profile => {
    if (filters.compatibility > 0 && profile.compatibilityScore < filters.compatibility) return false;
    if (filters.location && profile.location && !profile.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.status && profile.status !== filters.status) return false;
    if (profile.age && (profile.age < filters.ageRange[0] || profile.age > filters.ageRange[1])) return false;
    return true;
  });

  const handleAnalyzeProfile = async (profile: any) => {
    try {
      setIsAnalyzing(true);
      const result = await apiService.analyzeProfile({
        instagram_url: profile.instagramUrl,
        detailed_analysis: true,
      });
      
      updateProfile(profile.id, {
        ...result,
        status: 'analyzed',
      });
      
      showSuccess('Profile Analyzed', `Successfully analyzed ${profile.name}`);
    } catch (error) {
      showError('Analysis Failed', `Failed to analyze ${profile.name}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSkipProfile = (profile: any) => {
    updateProfile(profile.id, { status: 'inactive' });
    showSuccess('Profile Skipped', `${profile.name} has been skipped`);
  };

  const handlePrioritizeProfile = (profile: any) => {
    updateProfile(profile.id, { status: 'active' });
    showSuccess('Profile Prioritized', `${profile.name} has been prioritized`);
  };

  const handleManualAnalysis = async () => {
    if (!manualUrl.trim()) return;
    
    try {
      setIsAnalyzing(true);
      await apiService.analyzeProfile({
        instagram_url: manualUrl,
        detailed_analysis: true,
      });
      
      showSuccess('Manual Analysis Complete', `Successfully analyzed profile from ${manualUrl}`);
      setManualUrl('');
    } catch (error) {
      showError('Manual Analysis Failed', 'Failed to analyze the provided URL');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfigUpdate = (key: string, value: any) => {
    updateConfig('discoveryPipeline', { [key]: value });
    showSuccess('Configuration Updated', `Discovery pipeline ${key} updated`);
  };

  const discoveryStats = {
    total: profiles.length,
    discovered: profiles.filter(p => p.status === 'discovered').length,
    analyzed: profiles.filter(p => p.status === 'analyzed').length,
    contacted: profiles.filter(p => p.status === 'contacted').length,
    avgCompatibility: profiles.length > 0 
      ? Math.round(profiles.reduce((sum, p) => sum + p.compatibilityScore, 0) / profiles.length)
      : 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Discovery Pipeline</h1>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            config.discoveryPipeline.enabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {config.discoveryPipeline.enabled ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{discoveryStats.total}</div>
          <div className="text-sm text-gray-600">Total Profiles</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{discoveryStats.discovered}</div>
          <div className="text-sm text-gray-600">Discovered</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{discoveryStats.analyzed}</div>
          <div className="text-sm text-gray-600">Analyzed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-emerald-600">{discoveryStats.contacted}</div>
          <div className="text-sm text-gray-600">Contacted</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{discoveryStats.avgCompatibility}%</div>
          <div className="text-sm text-gray-600">Avg. Compatibility</div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Limit
            </label>
            <input
              type="number"
              value={config.discoveryPipeline.dailyLimit}
              onChange={(e) => handleConfigUpdate('dailyLimit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min. Compatibility (%)
            </label>
            <input
              type="number"
              value={config.discoveryPipeline.minCompatibility}
              onChange={(e) => handleConfigUpdate('minCompatibility', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule
            </label>
            <input
              type="text"
              value={config.discoveryPipeline.schedule}
              onChange={(e) => handleConfigUpdate('schedule', e.target.value)}
              placeholder="0 9,15,21 * * *"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Manual Discovery */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Manual Discovery</h2>
        <div className="flex space-x-4">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://instagram.com/username"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleManualAnalysis}
            disabled={isAnalyzing || !manualUrl.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min. Compatibility
            </label>
            <select
              value={filters.compatibility}
              onChange={(e) => setFilters({...filters, compatibility: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>All</option>
              <option value={60}>60%+</option>
              <option value={70}>70%+</option>
              <option value={80}>80%+</option>
              <option value={90}>90%+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              placeholder="Filter by location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="discovered">Discovered</option>
              <option value="analyzed">Analyzed</option>
              <option value="contacted">Contacted</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={filters.ageRange[0]}
                onChange={(e) => setFilters({...filters, ageRange: [parseInt(e.target.value), filters.ageRange[1]]})}
                className="w-1/2 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="18"
                max="100"
              />
              <input
                type="number"
                value={filters.ageRange[1]}
                onChange={(e) => setFilters({...filters, ageRange: [filters.ageRange[0], parseInt(e.target.value)]})}
                className="w-1/2 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="18"
                max="100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onAnalyze={handleAnalyzeProfile}
            onSkip={handleSkipProfile}
            onPrioritize={handlePrioritizeProfile}
          />
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No profiles found matching your filters</div>
          <p className="text-gray-400 mt-2">Try adjusting your filters or run a new discovery</p>
        </div>
      )}
    </div>
  );
};
