import React from 'react';
import { X } from 'lucide-react';
import './NotificationItem.css';

interface NotificationItemProps {
  id: string;
  title: string;
  description: string;
  onDismiss: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  title,
  description,
  onDismiss,
}) => {
  return (
    <div className="notification-item">
      <div className="notification-header">
        <h3 className="notification-title">{title}</h3>
        <button
          className="dismiss-button"
          onClick={() => onDismiss(id)}
          aria-label="Dismiss notification"
        >
          <X size={18} />
        </button>
      </div>
      <p className="notification-description">{description}</p>
    </div>
  );
};

export default NotificationItem;