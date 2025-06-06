import { useState, useCallback } from 'react';
import { NotificationProps } from '../components/realtime_notification/notification';

export interface NotificationInput {
  title: string;
  content: string;
  type?: 'default' | 'success' | 'warning' | 'error';
  autoHide?: boolean;
  duration?: number;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = useCallback((input: NotificationInput) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const notification: NotificationProps = {
      id,
      title: input.title,
      content: input.content,
      type: input.type || 'default',
      autoHide: input.autoHide !== undefined ? input.autoHide : true,
      duration: input.duration || 5000,
      onDismiss: removeNotification
    };

    setNotifications(prev => [...prev, notification]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };
};