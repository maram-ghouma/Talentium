// src/hooks/useNotifications.ts
import { useState, useCallback, useEffect } from 'react';
import { NotificationProps } from '../components/realtime_notification/notification';
import { NotificationService } from '../services/Notification/notification.service';

// Replace this with actual user auth context or prop
const userId = 123;

let service: NotificationService | null = null;

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  useEffect(() => {
    if (!service) {
      service = new NotificationService(userId);
    }

    const unsubscribe = service.onNotificationsUpdate(setNotifications);
    service.getUnreadNotifications();

    return () => {
      unsubscribe();
      service?.disconnect();
    };
  }, []);

  const removeNotification = useCallback((id: string) => {
    if (service) {
      service['handleDismiss'](id); // Ideally expose this via a public method
    } else {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  }, []);

  const addNotification = useCallback((input: Omit<NotificationProps, 'id' | 'onDismiss'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const notification: NotificationProps = {
      id,
      ...input,
      onDismiss: removeNotification
    };

    setNotifications(prev => [...prev, notification]);
    return id;
  }, [removeNotification]);

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
