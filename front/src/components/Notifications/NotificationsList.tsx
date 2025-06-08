import React from 'react';
import { Bell } from 'lucide-react';
import NotificationItem from './NotificationItem';
import './NotificationsList.css';

interface Notification {
  id: string;
  title: string;
  description: string;
}

interface NotificationsListProps {
  notifications: Notification[];
  error?: string | null;
  onDismiss?: (id: string) => void; // Optional callback for dismiss action
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  error,
  onDismiss,
}) => {
  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <h1>Notifications</h1>
          <Bell size={32} color="var(--navy-primary)" />
        </div>

        {error && (
          <div className="error-state">
            <p style={{ color: 'red' }}>{error}</p>
          </div>
        )}

        <div className="notifications-list">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                {...notification}
                onDismiss={onDismiss || (() => {})}
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