import { useState, useCallback } from 'react';

export interface Notification {
  id: number;
  message: string;
  time: string;
  type: 'opportunity' | 'success' | 'message' | 'info' | 'warning' | 'error';
  read?: boolean;
}

export const useNotifications = (initialNotifications: Notification[] = []) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const addNotification = useCallback((
    message: string, 
    type: Notification['type'] = 'info'
  ) => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      time: 'ahora',
      type,
      read: false
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 99)]); // Máximo 100 notificaciones
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearRead = useCallback(() => {
    setNotifications(prev => prev.filter(n => !n.read));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    clearRead,
    unreadCount,
    setNotifications
  };
};
