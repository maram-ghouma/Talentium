import React, { useState, useEffect, useRef } from 'react';
import NotificationsList from '../../components/Notifications/NotificationsList';
import { NotificationService } from '../../services/Notification/notification.service';
import { NotificationProps } from '../../components/realtime_notification/notification';
// Assuming your existing CSS is applied to the root element of this component,
// or via the NotificationsList component itself.
// import '../../Styles/NotificationsPage.css'; // Keep this if it's applying styles to existing elements

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  // Use useRef to hold the NotificationService instance to prevent re-instantiation
  // and manage its lifecycle for WebSocket connections.
  const notificationServiceRef = useRef<NotificationService | null>(null);

  useEffect(() => {
    // 1. Get the authentication token from localStorage
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      setError('Authentication required. Please log in to view notifications.');
      setLoading(false);
      return; // Exit if no token is available
    }

    // 2. Initialize notification service if it hasn't been already
    // This ensures only one instance is created and its socket connection is maintained.
    if (!notificationServiceRef.current) {
      notificationServiceRef.current = new NotificationService(authToken); // Correct: Pass the string token
    }

    const service = notificationServiceRef.current; // Get the current service instance

    // 3. Define the asynchronous function to fetch initial unread notifications
    const fetchInitialNotifications = async () => {
      try {
        setLoading(true); // Indicate loading starts
        const initialNotifications = await service.getUnreadNotifications();
        setNotifications(initialNotifications);
        setError(null); // Clear any previous errors on successful fetch
      } catch (err) {
        console.error('Failed to fetch initial notifications:', err);
        setError('Failed to load notifications. Please try again later.');
      } finally {
        setLoading(false); // Indicate loading ends
      }
    };

    fetchInitialNotifications(); // Call the function to fetch notifications on mount

    // 4. Subscribe to real-time updates from the NotificationService
    const unsubscribe = service.onNotificationsUpdate((updatedNotifications) => {
      console.log('Real-time notifications updated:', updatedNotifications);
      setNotifications(updatedNotifications); // Update state with latest notifications
    });

    // 5. Cleanup function: runs when the component unmounts
    return () => {
      unsubscribe(); // Unsubscribe from real-time updates to prevent memory leaks
      service.disconnect(); // Disconnect the WebSocket to close the connection gracefully
    };
  }, []); // The empty dependency array ensures this effect runs only once after the initial render

  // Map NotificationProps to the shape expected by NotificationsList
  // Ensure the keys and types match what your NotificationsList expects for each item
  const mappedNotifications = notifications.map((n) => ({
    id: n.id,
    title: n.title || 'Notification', // Provide a default title if n.title is undefined
    description: n.content || 'No content provided.', // Provide default content if n.content is undefined
    // Add other properties that NotificationsList expects, e.g., 'date', 'readStatus', etc.
  }));

  // Handle the dismiss action, delegating to the NotificationService's method
  const handleDismiss = (id: string) => {
    const notificationToDismiss = notifications.find((n) => n.id === id);
    if (notificationToDismiss && notificationToDismiss.onDismiss) {
      // Call the specific onDismiss function provided by the NotificationService
      // which will handle marking the notification as read and updating the server.
      notificationToDismiss.onDismiss(id);
    } else {
      console.warn(`Attempted to dismiss notification ${id}, but no valid onDismiss handler was found.`);
      // Optionally, manually filter from local state if the service's onDismiss is missing
      setNotifications((prevNotifications) => prevNotifications.filter((n) => n.id !== id));
    }
  };

  // Render content based on loading and error states
  if (loading) {
    return <p>Loading notifications...</p>; // Simple loading message to avoid complex CSS changes
  }

  // Pass error to NotificationsList or display it here
  return (
    // Assuming your main page content div or a similar existing element is outside this component,
    // or that NotificationsList itself is responsible for overall layout.
    // Avoid adding new top-level divs with new class names here.
    <NotificationsList
      notifications={mappedNotifications}
      error={error} // Pass the error so NotificationsList can display it
      onDismiss={handleDismiss}
    />
  );
};

export default NotificationsPage;