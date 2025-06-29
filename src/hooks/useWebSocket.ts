import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store';

// Remove ImportMeta/ImportMetaEnv declarations from here; they are now in vite-env.d.ts

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8001';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const store = useAppStore();

  const connect = () => {
    try {
      const ws = new WebSocket(WS_URL);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        store.setConnectionStatus(true);
        reconnectAttemptsRef.current = 0;
        
        // Send authentication if needed
        const token = localStorage.getItem('auth_token');
        if (token) {
          ws.send(JSON.stringify({
            type: 'auth',
            token,
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        store.setConnectionStatus(false);
        
        // Attempt to reconnect if not closed intentionally
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            console.log(`Reconnecting... Attempt ${reconnectAttemptsRef.current}`);
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        store.addNotification({
          type: 'error',
          title: 'Connection Error',
          message: 'WebSocket connection failed. Real-time updates may not work.',
        });
      };

      setSocket(ws);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (socket) {
      socket.close(1000, 'User disconnected');
    }
    setSocket(null);
    setIsConnected(false);
  };

  const sendMessage = (message: Omit<WebSocketMessage, 'timestamp'>) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        ...message,
        timestamp: new Date().toISOString(),
      }));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  };

  const handleMessage = (message: WebSocketMessage) => {
    console.log('WebSocket message received:', message);

    switch (message.type) {
      case 'new_profile_discovered':
        store.addProfile(message.data);
        store.addNotification({
          type: 'info',
          title: 'New Profile',
          message: `Discovered new profile: ${message.data.name}`,
        });
        break;

      case 'conversation_state_changed':
        store.updateConversation(message.data.id, message.data);
        break;

      case 'new_message_received':
        store.addMessage(message.data.conversation_id, message.data);
        store.addNotification({
          type: 'info',
          title: 'New Message',
          message: `New message from ${message.data.sender_name}`,
        });
        break;

      case 'opportunity_detected':
        store.addOpportunity(message.data);
        store.addNotification({
          type: 'success',
          title: 'New Opportunity',
          message: `${message.data.type} opportunity detected for ${message.data.profile_name}`,
        });
        break;

      case 'message_generated':
        store.addPendingMessage(message.data);
        store.addNotification({
          type: 'info',
          title: 'Message Ready',
          message: `New message generated for ${message.data.profile_name}`,
        });
        break;

      case 'message_sent_success':
        store.addNotification({
          type: 'success',
          title: 'Message Sent',
          message: `Message sent successfully to ${message.data.profile_name}`,
        });
        break;

      case 'message_sent_failed':
        store.addNotification({
          type: 'error',
          title: 'Message Failed',
          message: `Failed to send message to ${message.data.profile_name}: ${message.data.error}`,
        });
        break;

      case 'workflow_status_changed':
        if (message.data.workflow === 'discovery_pipeline') {
          store.updateConfig('discoveryPipeline', { enabled: message.data.enabled });
        } else if (message.data.workflow === 'conversation_manager') {
          store.updateConfig('conversationManager', { enabled: message.data.enabled });
        } else if (message.data.workflow === 'opportunity_detector') {
          store.updateConfig('opportunityDetector', { enabled: message.data.enabled });
        } else if (message.data.workflow === 'auto_response_system') {
          store.updateConfig('autoResponseSystem', { enabled: message.data.enabled });
        }
        break;

      case 'metrics_updated':
        store.updateMetrics(message.data);
        break;

      case 'system_status_changed':
        store.setSystemStatus(message.data.status);
        if (message.data.status === 'error') {
          store.addNotification({
            type: 'error',
            title: 'System Error',
            message: message.data.message || 'System encountered an error',
          });
        }
        break;

      case 'error':
        store.addNotification({
          type: 'error',
          title: 'Error',
          message: message.data.message || 'An error occurred',
        });
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  };

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    socket,
    sendMessage,
    connect,
    disconnect,
  };
};

// Hook for specific message subscriptions
export const useWebSocketSubscription = (messageTypes: string[], callback: (message: WebSocketMessage) => void) => {
  const { socket, isConnected } = useWebSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        if (messageTypes.includes(message.type)) {
          callback(message);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    socket.addEventListener('message', handleMessage);
    
    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket, isConnected, messageTypes, callback]);

  return { isConnected };
};
