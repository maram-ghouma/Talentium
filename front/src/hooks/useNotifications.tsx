import { useEffect, useState } from 'react';
import { NotificationService } from '../services/Notification/notification.service';
import { NotificationProps } from '../components/realtime_notification/notification';


let service: NotificationService | null = null; // Use a mutable variable to hold the service instance

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  useEffect(() => {
    // Get the auth token from localStorage (or your preferred auth context)
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      console.warn("No auth token found for NotificationService.");
      return; // Exit if no token is available
    }

    if (!service) {
      service = new NotificationService(authToken); // Pass the string token
    }

    const unsubscribe = service.onNotificationsUpdate((incoming) => {
      console.log("Incoming notifications in hook:", incoming);
      setNotifications(incoming);
    });

    // Also fetch initial notifications when the component mounts
    service.getUnreadNotifications().then((initialNotifications) => {
      setNotifications(initialNotifications);
    }).catch(error => {
      console.error("Error fetching initial notifications:", error);
    });

    return () => {
      unsubscribe();
      // Optionally, if you want to disconnect the socket when the last consumer
      // of this hook unmounts, you'd need a more sophisticated way to manage
      // the singleton `service` instance. For now, it remains connected.
      // If `service` is truly a singleton for the app's lifetime,
      // disconnecting it here might be premature.
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return notifications;
};