import React, { useState } from 'react';
import { useAppStore, useConversations, useConfig } from '../store';
import { useApi } from '../services/api';
import { useNotifications } from '../components/Notifications';

interface ConversationCardProps {
  conversation: any;
  onViewHistory: (conversation: any) => void;
  onSendMessage: (conversation: any) => void;
  onEscalate: (conversation: any) => void;
}

const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  onViewHistory,
  onSendMessage,
  onEscalate,
}) => {
  const getStateColor = (state: string) => {
    switch (state) {
      case 'initiated': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'engaged': return 'bg-purple-100 text-purple-800';
      case 'opportunity': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatLastMessage = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <img
            src={conversation.profilePhoto || '/default-avatar.png'}
            alt={conversation.profileName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {conversation.profileName}
            </h3>
            <p className="text-sm text-gray-600">
              Last message: {formatLastMessage(conversation.lastMessageTime)}
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Response Rate:</span>
                <span className="ml-1 text-sm font-medium text-blue-600">
                  {Math.round(conversation.responseRate * 100)}%
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Engagement:</span>
                <span className={`ml-1 text-sm font-medium ${getEngagementColor(conversation.engagementScore)}`}>
                  {conversation.engagementScore}/100
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStateColor(conversation.state)}`}>
            {conversation.state}
          </span>
          <div className="text-sm text-gray-500">
            {conversation.messages?.length || 0} messages
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onViewHistory(conversation)}
          className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          View History
        </button>
        <button
          onClick={() => onEscalate(conversation)}
          className="px-3 py-1 text-sm text-yellow-600 bg-yellow-100 rounded hover:bg-yellow-200 transition-colors"
        >
          Escalate
        </button>
        <button
          onClick={() => onSendMessage(conversation)}
          className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export const ConversationManagerDashboard: React.FC = () => {
  const conversations = useConversations();
  const config = useConfig();
  const { apiService } = useApi();
  const { showSuccess, showError } = useNotifications();
  const { updateConversation, updateConfig } = useAppStore();
  
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [filters, setFilters] = useState({
    state: '',
    responseRate: 0,
    engagement: 0,
    sortBy: 'lastMessageTime',
  });

  const filteredConversations = conversations
    .filter(conv => {
      if (filters.state && conv.state !== filters.state) return false;
      if (filters.responseRate > 0 && conv.responseRate * 100 < filters.responseRate) return false;
      if (filters.engagement > 0 && conv.engagementScore < filters.engagement) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'lastMessageTime':
          return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        case 'engagementScore':
          return b.engagementScore - a.engagementScore;
        case 'responseRate':
          return b.responseRate - a.responseRate;
        default:
          return 0;
      }
    });

  const handleViewHistory = (conversation: any) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async (conversation: any) => {
    setSelectedConversation(conversation);
  };

  const handleEscalate = (conversation: any) => {
    updateConversation(conversation.id, { state: 'opportunity' });
    showSuccess('Conversation Escalated', `${conversation.profileName} conversation has been escalated`);
  };

  const handleSendDirectMessage = async () => {
    if (!selectedConversation || !messageText.trim()) return;
    
    try {
      setIsSending(true);
      await apiService.sendMessage(selectedConversation.id, messageText);
      
      showSuccess('Message Sent', `Message sent to ${selectedConversation.profileName}`);
      setMessageText('');
      setSelectedConversation(null);
    } catch (error) {
      showError('Send Failed', 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleConfigUpdate = (key: string, value: any) => {
    updateConfig('conversationManager', { [key]: value });
    showSuccess('Configuration Updated', `Conversation manager ${key} updated`);
  };

  const conversationStats = {
    total: conversations.length,
    active: conversations.filter(c => c.state === 'active').length,
    engaged: conversations.filter(c => c.state === 'engaged').length,
    opportunities: conversations.filter(c => c.state === 'opportunity').length,
    avgResponseRate: conversations.length > 0 
      ? Math.round(conversations.reduce((sum, c) => sum + c.responseRate, 0) / conversations.length * 100)
      : 0,
    avgEngagement: conversations.length > 0 
      ? Math.round(conversations.reduce((sum, c) => sum + c.engagementScore, 0) / conversations.length)
      : 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Conversation Manager</h1>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            config.conversationManager.enabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {config.conversationManager.enabled ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{conversationStats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{conversationStats.active}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{conversationStats.engaged}</div>
          <div className="text-sm text-gray-600">Engaged</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{conversationStats.opportunities}</div>
          <div className="text-sm text-gray-600">Opportunities</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-emerald-600">{conversationStats.avgResponseRate}%</div>
          <div className="text-sm text-gray-600">Avg Response</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-indigo-600">{conversationStats.avgEngagement}</div>
          <div className="text-sm text-gray-600">Avg Engagement</div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check Interval (hours)
            </label>
            <input
              type="number"
              value={config.conversationManager.checkInterval}
              onChange={(e) => handleConfigUpdate('checkInterval', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Threshold (hours)
            </label>
            <input
              type="number"
              value={config.conversationManager.responseTimeThreshold}
              onChange={(e) => handleConfigUpdate('responseTimeThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inactivity Threshold (days)
            </label>
            <input
              type="number"
              value={config.conversationManager.inactivityThreshold}
              onChange={(e) => handleConfigUpdate('inactivityThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters & Sorting</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <select
              value={filters.state}
              onChange={(e) => setFilters({...filters, state: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="initiated">Initiated</option>
              <option value="active">Active</option>
              <option value="engaged">Engaged</option>
              <option value="opportunity">Opportunity</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Response Rate (%)
            </label>
            <select
              value={filters.responseRate}
              onChange={(e) => setFilters({...filters, responseRate: parseInt(e.target.value)})}
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
              Min Engagement
            </label>
            <select
              value={filters.engagement}
              onChange={(e) => setFilters({...filters, engagement: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>All</option>
              <option value={50}>50+</option>
              <option value={70}>70+</option>
              <option value={80}>80+</option>
              <option value={90}>90+</option>
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
              <option value="lastMessageTime">Last Message</option>
              <option value="engagementScore">Engagement Score</option>
              <option value="responseRate">Response Rate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conversations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredConversations.map((conversation) => (
          <ConversationCard
            key={conversation.id}
            conversation={conversation}
            onViewHistory={handleViewHistory}
            onSendMessage={handleSendMessage}
            onEscalate={handleEscalate}
          />
        ))}
      </div>

      {filteredConversations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No conversations found</div>
          <p className="text-gray-400 mt-2">Try adjusting your filters or start new conversations</p>
        </div>
      )}

      {/* Send Message Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">
              Send Message to {selectedConversation.profileName}
            </h3>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setSelectedConversation(null)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSendDirectMessage}
                disabled={isSending || !messageText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
