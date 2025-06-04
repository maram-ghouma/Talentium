import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { MissionStatus } from '../../types';
import '../../Styles/Freelancer/status.css';

interface StatusBadgeProps {
  status: MissionStatus;
  count?: number;
  variant?: 'badge' | 'pill';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  count,
  variant = 'badge' 
}) => {
        

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'in_progress':
        return <Clock size={16} />;
      case 'not_assigned':
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  const statusClass = status.toLowerCase().replace(' ', '-');
  const variantClass = variant === 'pill' ? 'status-pill' : 'status-badge';
  const className = `${variantClass} ${statusClass}`;

  return (
    <span className={className}>
      {variant === 'badge' && getStatusIcon()}
      {status}
      {count !== undefined && variant === 'badge' && (
        <span className="status-count">{count}</span>
      )}
    </span>
  );
};

export default StatusBadge;