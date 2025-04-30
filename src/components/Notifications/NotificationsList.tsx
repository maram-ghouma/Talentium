import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import NotificationItem from './NotificationItem';
import './NotificationsList.css';

interface Notification {
  id: string;
  title: string;
  description: string;
}

const NotificationsList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Message Received',
      description: 'You have received a new message from John Doe regarding your recent project.',
    },
    {
      id: '2',
      title: 'Payment Successful',
      description: 'Your payment of $500 has been successfully processed.',
    },
    {
      id: '3',
      title: 'Project Update',
      description: 'The project "Website Redesign" has been updated with new requirements.',
    },
  ]);

  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <h1>Notifications</h1>
          <Bell size={32} color="var(--navy-primary)" />
        </div>
        
        <div className="notifications-list">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                {...notification}
                onDismiss={handleDismiss}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsList;