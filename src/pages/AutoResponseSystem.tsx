import React, { useState } from 'react';
import { useAppStore, usePendingMessages, useConfig } from '../store';
import { useApi } from '../services/api';
import { useNotifications } from '../components/Notifications';

interface PendingMessageCardProps {
  message: any;
  onApprove: (message: any, variantIndex: number) => void;
  onReject: (message: any) => void;
  onEdit: (message: any, editedContent: string) => void;
}

const PendingMessageCard: React.FC<PendingMessageCardProps> = ({
  message,
  onApprove,
  onReject,
  onEdit,
}) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(message.variants[0]?.content || '');

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff <= 0) return 'Expired';
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const isExpired = new Date() > message.expiresAt;

  const handleEditSave = () => {
    onEdit(message, editedContent);
    setEditMode(false);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
      isExpired ? 'border-red-500 bg-red-50' : 'border-blue-500'
    } hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <img
            src={message.profilePhoto || '/default-avatar.png'}
            alt={message.profileName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {message.profileName}
            </h3>
            <p className="text-sm text-gray-600">
              Generated: {new Date(message.generatedAt).toLocaleString()}
            </p>
            <div className={`text-sm font-medium ${
              isExpired ? 'text-red-600' : 'text-blue-600'
            }`}>
              {formatTimeRemaining(message.expiresAt)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            {message.variants.length} variants
          </div>
        </div>
      </div>

      {/* Context */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Context:</span> {message.context}
        </p>
      </div>

      {/* Message Variants */}
      <div className="mb-4">
        <div className="flex space-x-2 mb-3">
          {message.variants.map((variant: any, index: number) => (
            <button
              key={index}
              onClick={() => {
                setSelectedVariant(index);
                setEditedContent(variant.content);
              }}
              className={`px-3 py-1 rounded text-sm ${
                selectedVariant === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Variant {index + 1}
              <span className={`ml-1 px-1 py-0.5 rounded text-xs ${
                getConfidenceColor(variant.confidence)
              }`}>
                {variant.confidence}%
              </span>
            </button>
          ))}
        </div>

        {editMode ? (
          <div className="space-y-3">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditMode(false)}
                className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
              >
                Save & Send
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-800 whitespace-pre-wrap">
              {message.variants[selectedVariant]?.content}
            </p>
            <div className="flex items-center justify-between mt-2 text-xs text-blue-600">
              <span>Tone: {message.variants[selectedVariant]?.tone}</span>
              <span className={`px-2 py-1 rounded ${
                getConfidenceColor(message.variants[selectedVariant]?.confidence)
              }`}>
                Confidence: {message.variants[selectedVariant]?.confidence}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onReject(message)}
          disabled={isExpired}
          className="px-4 py-2 text-sm text-red-600 bg-red-100 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reject
        </button>
        <button
          onClick={() => setEditMode(true)}
          disabled={isExpired || editMode}
          className="px-4 py-2 text-sm text-yellow-600 bg-yellow-100 rounded hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Edit
        </button>
        <button
          onClick={() => onApprove(message, selectedVariant)}
          disabled={isExpired}
          className="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Approve & Send
        </button>
      </div>
    </div>
  );
};

export const AutoResponseSystemDashboard: React.FC = () => {
  const pendingMessages = usePendingMessages();
  const config = useConfig();
  const { apiService } = useApi();
  const { showSuccess, showError } = useNotifications();
  const { approvePendingMessage, rejectPendingMessage, editAndSendMessage, updateConfig } = useAppStore();
  
  const [filters, setFilters] = useState({
    confidence: 0,
    tone: '',
    timeRange: 'all',
    sortBy: 'generatedAt',
  });

  const filteredMessages = pendingMessages
    .filter(msg => {
      if (filters.confidence > 0) {
        const maxConfidence = Math.max(...msg.variants.map((v: any) => v.confidence));
        if (maxConfidence < filters.confidence) return false;
      }
      if (filters.tone && !msg.variants.some((v: any) => v.tone === filters.tone)) return false;
      
      if (filters.timeRange !== 'all') {
        const now = new Date();
        const msgDate = new Date(msg.generatedAt);
        const hours = (now.getTime() - msgDate.getTime()) / (1000 * 60 * 60);
        
        switch (filters.timeRange) {
          case '1h': if (hours > 1) return false; break;
          case '6h': if (hours > 6) return false; break;
          case '24h': if (hours > 24) return false; break;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'generatedAt':
          return new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime();
        case 'expiresAt':
          return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
        case 'confidence':
          const aMax = Math.max(...a.variants.map((v: any) => v.confidence));
          const bMax = Math.max(...b.variants.map((v: any) => v.confidence));
          return bMax - aMax;
        default:
          return 0;
      }
    });

  const handleApprove = async (message: any, variantIndex: number) => {
    try {
      await apiService.sendMessage(
        message.conversationId,
        message.variants[variantIndex].content
      );
      
      approvePendingMessage(message.id, variantIndex);
      showSuccess('Message Approved', `Message sent to ${message.profileName}`);
    } catch (error) {
      showError('Send Failed', 'Failed to send approved message');
    }
  };

  const handleReject = (message: any) => {
    rejectPendingMessage(message.id);
    showSuccess('Message Rejected', `Message for ${message.profileName} has been rejected`);
  };

  const handleEdit = async (message: any, editedContent: string) => {
    try {
      await apiService.sendMessage(message.conversationId, editedContent);
      
      editAndSendMessage(message.id, editedContent);
      showSuccess('Message Edited & Sent', `Custom message sent to ${message.profileName}`);
    } catch (error) {
      showError('Send Failed', 'Failed to send edited message');
    }
  };

  const handleConfigUpdate = (key: string, value: any) => {
    updateConfig('autoResponseSystem', { [key]: value });
    showSuccess('Configuration Updated', `Auto response system ${key} updated`);
  };

  const handleBulkApprove = async () => {
    const highConfidenceMessages = filteredMessages.filter(msg => {
      const maxConfidence = Math.max(...msg.variants.map((v: any) => v.confidence));
      return maxConfidence >= config.autoResponseSystem.autoSendThreshold;
    });

    for (const message of highConfidenceMessages) {
      const bestVariantIndex = message.variants.findIndex((v: any) => 
        v.confidence === Math.max(...message.variants.map((variant: any) => variant.confidence))
      );
      await handleApprove(message, bestVariantIndex);
    }
  };

  const responseStats = {
    total: pendingMessages.length,
    highConfidence: pendingMessages.filter(msg => 
      Math.max(...msg.variants.map((v: any) => v.confidence)) >= 80
    ).length,
    expired: pendingMessages.filter(msg => new Date() > msg.expiresAt).length,
    needsReview: pendingMessages.filter(msg => 
      Math.max(...msg.variants.map((v: any) => v.confidence)) < config.autoResponseSystem.autoSendThreshold
    ).length,
  };

  const toneDistribution = {
    casual: pendingMessages.filter(msg => msg.variants.some((v: any) => v.tone === 'casual')).length,
    flirty: pendingMessages.filter(msg => msg.variants.some((v: any) => v.tone === 'flirty')).length,
    friendly: pendingMessages.filter(msg => msg.variants.some((v: any) => v.tone === 'friendly')).length,
    humorous: pendingMessages.filter(msg => msg.variants.some((v: any) => v.tone === 'humorous')).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Auto-Response System</h1>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            config.autoResponseSystem.enabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {config.autoResponseSystem.enabled ? 'Active' : 'Inactive'}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            config.autoResponseSystem.autoSendEnabled 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            Auto-Send: {config.autoResponseSystem.autoSendEnabled ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{responseStats.total}</div>
          <div className="text-sm text-gray-600">Pending Approval</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{responseStats.highConfidence}</div>
          <div className="text-sm text-gray-600">High Confidence</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{responseStats.expired}</div>
          <div className="text-sm text-gray-600">Expired</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{responseStats.needsReview}</div>
          <div className="text-sm text-gray-600">Needs Review</div>
        </div>
      </div>

      {/* Tone Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Message Tone Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">{toneDistribution.casual}</div>
            <div className="text-sm text-gray-600">Casual</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-pink-600">{toneDistribution.flirty}</div>
            <div className="text-sm text-gray-600">Flirty</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{toneDistribution.friendly}</div>
            <div className="text-sm text-gray-600">Friendly</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-600">{toneDistribution.humorous}</div>
            <div className="text-sm text-gray-600">Humorous</div>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Auto-Response Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-Send Threshold (%)
            </label>
            <input
              type="number"
              value={config.autoResponseSystem.autoSendThreshold}
              onChange={(e) => handleConfigUpdate('autoSendThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approval Timeout (hours)
            </label>
            <input
              type="number"
              value={config.autoResponseSystem.approvalTimeoutHours}
              onChange={(e) => handleConfigUpdate('approvalTimeoutHours', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variant Count
            </label>
            <input
              type="number"
              value={config.autoResponseSystem.generateVariantCount}
              onChange={(e) => handleConfigUpdate('generateVariantCount', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-Send Enabled
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.autoResponseSystem.autoSendEnabled}
                onChange={(e) => handleConfigUpdate('autoSendEnabled', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Enable automatic sending</span>
            </label>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Pending Messages</h2>
          <button
            onClick={handleBulkApprove}
            disabled={responseStats.highConfidence === 0}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bulk Approve High Confidence ({responseStats.highConfidence})
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              <option value={60}>60%+</option>
              <option value={70}>70%+</option>
              <option value={80}>80%+</option>
              <option value={90}>90%+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <select
              value={filters.tone}
              onChange={(e) => setFilters({...filters, tone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="casual">Casual</option>
              <option value="flirty">Flirty</option>
              <option value="friendly">Friendly</option>
              <option value="humorous">Humorous</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Range
            </label>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters({...filters, timeRange: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
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
              <option value="generatedAt">Generated Time</option>
              <option value="expiresAt">Expires Soon</option>
              <option value="confidence">Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pending Messages */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <PendingMessageCard
            key={message.id}
            message={message}
            onApprove={handleApprove}
            onReject={handleReject}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No pending messages</div>
          <p className="text-gray-400 mt-2">All messages have been processed or no new messages generated</p>
        </div>
      )}
    </div>
  );
};
