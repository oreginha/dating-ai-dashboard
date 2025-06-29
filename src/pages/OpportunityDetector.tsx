import { useState } from 'react';
import { useAppStore, useOpportunities, useConfig } from '../store';
import { useApi } from '../services/api';
import { useNotifications } from '../components/Notifications';

interface OpportunityCardProps {
  opportunity: any;
  onGenerateResponse: (opportunity: any) => void;
  onDismiss: (opportunity: any) => void;
  onTakeAction: (opportunity: any) => void;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onGenerateResponse,
  onDismiss,
  onTakeAction,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'story_reaction':
        return '❤️';
      case 'online_status':
        return '🟢';
      case 'similar_interests':
        return '🎯';
      case 'time_pattern':
        return '⏰';
      case 'engagement_spike':
        return '📈';
      default:
        return '✨';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getPriorityColor(opportunity.priority)} hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getTypeIcon(opportunity.type)}</span>
            <img
              src={opportunity.profilePhoto || '/default-avatar.png'}
              alt={opportunity.profileName}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {opportunity.profileName}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {opportunity.type.replace('_', ' ')} opportunity
            </p>
            <p className="text-sm text-gray-700 mt-1">
              {opportunity.description}
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <span className="text-xs text-gray-500">Confidence:</span>
                <span className={`ml-1 text-sm font-medium ${getConfidenceColor(opportunity.confidence)}`}>
                  {opportunity.confidence}%
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(opportunity.detectedAt)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(opportunity.priority)}`}>
            {opportunity.priority}
          </span>
          {opportunity.actionTaken && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              Action Taken
            </span>
          )}
        </div>
      </div>
      
      {opportunity.suggestedResponse && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">Suggested Response:</p>
          <p className="text-sm text-blue-700 mt-1">{opportunity.suggestedResponse}</p>
        </div>
      )}
      
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onDismiss(opportunity)}
          className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          Dismiss
        </button>
        <button
          onClick={() => onGenerateResponse(opportunity)}
          className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
        >
          Generate Response
        </button>
        <button
          onClick={() => onTakeAction(opportunity)}
          disabled={opportunity.actionTaken}
          className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Take Action
        </button>
      </div>
    </div>
  );
};

export const OpportunityDetectorDashboard: React.FC = () => {
  const opportunities = useOpportunities();
  const config = useConfig();
  const { apiService } = useApi();
  const { showSuccess, showError } = useNotifications();
  const { updateOpportunity, dismissOpportunity, updateConfig } = useAppStore();
  
  const [filters, setFilters] = useState({
    priority: '',
    type: '',
    actionTaken: '',
    confidence: 0,
    sortBy: 'detectedAt',
  });

  const filteredOpportunities = opportunities
    .filter(opp => {
      if (filters.priority && opp.priority !== filters.priority) return false;
      if (filters.type && opp.type !== filters.type) return false;
      if (filters.actionTaken === 'taken' && !opp.actionTaken) return false;
      if (filters.actionTaken === 'pending' && opp.actionTaken) return false;
      if (filters.confidence > 0 && opp.confidence < filters.confidence) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'detectedAt':
          return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime();
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                 (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        case 'confidence':
          return b.confidence - a.confidence;
        default:
          return 0;
      }
    });

  const handleGenerateResponse = async (opportunity: any) => {
    try {
      const response = await apiService.generateMessage({
        conversation_id: opportunity.conversationId,
        context: opportunity.description,
        message_type: 'opportunity_response',
        tone: 'friendly',
      });
      
      updateOpportunity(opportunity.id, {
        suggestedResponse: response.variants[0]?.content,
      });
      
      showSuccess('Response Generated', `Generated response for ${opportunity.profileName}`);
    } catch (error) {
      showError('Generation Failed', 'Failed to generate response');
    }
  };

  const handleDismissOpportunity = (opportunity: any) => {
    dismissOpportunity(opportunity.id);
    showSuccess('Opportunity Dismissed', `Dismissed opportunity for ${opportunity.profileName}`);
  };

  const handleTakeAction = async (opportunity: any) => {
    if (opportunity.suggestedResponse) {
      try {
        await apiService.sendMessage(opportunity.conversationId, opportunity.suggestedResponse);
        updateOpportunity(opportunity.id, { actionTaken: true });
        showSuccess('Action Taken', `Message sent to ${opportunity.profileName}`);
      } catch (error) {
        showError('Action Failed', 'Failed to send message');
      }
    } else {
      showError('No Response', 'Generate a response first');
    }
  };

  const handleConfigUpdate = (key: string, value: any) => {
    updateConfig('opportunityDetector', { [key]: value });
    showSuccess('Configuration Updated', `Opportunity detector ${key} updated`);
  };

  const opportunityStats = {
    total: opportunities.length,
    urgent: opportunities.filter(o => o.priority === 'urgent').length,
    pending: opportunities.filter(o => !o.actionTaken).length,
    actionTaken: opportunities.filter(o => o.actionTaken).length,
    avgConfidence: opportunities.length > 0 
      ? Math.round(opportunities.reduce((sum, o) => sum + o.confidence, 0) / opportunities.length)
      : 0,
  };

  const opportunityTypes = [
    { key: 'story_reaction', label: 'Story Reactions', count: opportunities.filter(o => o.type === 'story_reaction').length },
    { key: 'online_status', label: 'Online Status', count: opportunities.filter(o => o.type === 'online_status').length },
    { key: 'similar_interests', label: 'Similar Interests', count: opportunities.filter(o => o.type === 'similar_interests').length },
    { key: 'time_pattern', label: 'Time Patterns', count: opportunities.filter(o => o.type === 'time_pattern').length },
    { key: 'engagement_spike', label: 'Engagement Spikes', count: opportunities.filter(o => o.type === 'engagement_spike').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Opportunity Detector</h1>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            config.opportunityDetector.enabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {config.opportunityDetector.enabled ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{opportunityStats.total}</div>
          <div className="text-sm text-gray-600">Total Opportunities</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{opportunityStats.urgent}</div>
          <div className="text-sm text-gray-600">Urgent</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{opportunityStats.pending}</div>
          <div className="text-sm text-gray-600">Pending Action</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{opportunityStats.actionTaken}</div>
          <div className="text-sm text-gray-600">Action Taken</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{opportunityStats.avgConfidence}%</div>
          <div className="text-sm text-gray-600">Avg Confidence</div>
        </div>
      </div>

      {/* Opportunity Types */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Opportunity Types</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {opportunityTypes.map((type) => (
            <div key={type.key} className="text-center">
              <div className="text-xl font-bold text-indigo-600">{type.count}</div>
              <div className="text-sm text-gray-600">{type.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Detection Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sensitivity Level
            </label>
            <select
              value={config.opportunityDetector.sensitivityLevel}
              onChange={(e) => handleConfigUpdate('sensitivityLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confidence Threshold (%)
            </label>
            <input
              type="number"
              value={config.opportunityDetector.confidenceThreshold}
              onChange={(e) => handleConfigUpdate('confidenceThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Real-time Alerts
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.opportunityDetector.realTimeAlerts}
                onChange={(e) => handleConfigUpdate('realTimeAlerts', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Enable real-time alerts</span>
            </label>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters & Sorting</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="story_reaction">Story Reaction</option>
              <option value="online_status">Online Status</option>
              <option value="similar_interests">Similar Interests</option>
              <option value="time_pattern">Time Pattern</option>
              <option value="engagement_spike">Engagement Spike</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Status
            </label>
            <select
              value={filters.actionTaken}
              onChange={(e) => setFilters({...filters, actionTaken: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="taken">Action Taken</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Confidence (%)
            </label>
            <select
              value={filters.confidence}
              onChange={(e) => setFilters({...filters, confidence: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>All</option>
              <option value={50}>50%+</option>
              <option value={70}>70%+</option>
              <option value={80}>80%+</option>
              <option value={90}>90%+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="detectedAt">Detection Time</option>
              <option value="priority">Priority</option>
              <option value="confidence">Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities Feed */}
      <div className="space-y-4">
        {filteredOpportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            onGenerateResponse={handleGenerateResponse}
            onDismiss={handleDismissOpportunity}
            onTakeAction={handleTakeAction}
          />
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No opportunities found</div>
          <p className="text-gray-400 mt-2">Try adjusting your filters or check back later for new opportunities</p>
        </div>
      )}
    </div>
  );
};
