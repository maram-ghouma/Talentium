import React from 'react';
import '../../Styles/Freelancer/status.css';


interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let statusClass = '';
  
  switch (status) {
    case 'not assigned':
      statusClass = 'status-not-assigned';
      break;
    case 'in progress':
      statusClass = 'status-in-progress';
      break;
    case 'completed':
      statusClass = 'status-completed';
      break;
    default:
      statusClass = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`status-badge ${statusClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;