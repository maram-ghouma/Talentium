import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export interface NotificationProps {
  id: string;
  title?: string; // Made optional
  content: string;
  type?: 'default' | 'success' | 'warning' | 'error';
  onDismiss: (id: string) => void;
  autoHide?: boolean;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  title = 'Notification', // Default title if not provided
  content,
  type = 'default',
  onDismiss,
  autoHide = true, // Changed to true for consistency
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Show animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    // Auto-hide functionality
    let hideTimer: NodeJS.Timeout;
    if (autoHide) {
      hideTimer = setTimeout(() => {
        handleDismiss();
      }, duration);
    }

    return () => {
      clearTimeout(showTimer);
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
  }, [autoHide, duration]);

  const handleDismiss = () => {
    setIsRemoving(true);
    setIsVisible(false);
    
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      onDismiss(id);
    }, 300);
  };

  const notificationClass = `notification ${type} ${isVisible && !isRemoving ? 'show' : ''} ${isRemoving ? 'hide' : ''}`;

  return (
    <div className={notificationClass}>
      <div className="notification-header">
        <h4 className="notification-title">{title}</h4>
        <button 
          className="notification-close"
          onClick={handleDismiss}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
      <p className="notification-content">{content}</p>
    </div>
  );
};

export default Notification;