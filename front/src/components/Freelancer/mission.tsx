import React from 'react';
import { Calendar, DollarSign, Clock, MoreVertical, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { Mission as MissionType } from '../../types';
import StatusBadge from './statusBadge';
import '../../Styles/Freelancer/mission.css';

interface MissionProps {
  mission: MissionType;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

const MissionDetails: React.FC<MissionProps> = ({
  mission,
  onEdit,
  onDelete,
  onView
}) => {
  const { 
    id, 
    title, 
    client, 
    clientLogo, 
    description, 
    date, 
    deadline, 
    status, 
    price, 
    paymentStatus, 
    priority, 
    progress,
    tasks
  } = mission;

  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  

  const getPriorityClass = () => {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const statusClass = status.toLowerCase().replace(' ', '-');

  return (
    <div className={`mission-card ${statusClass}`}>
      <div className="mission-header">
        <div>
          <h3 className="mission-title">{title}</h3>
          <div className="mission-client">
            {clientLogo && <img src={clientLogo} alt={client} />}
            <span>{client}</span>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>
      
      <p className="mission-description">{description}</p>
      
      <div className="mission-meta">
        <div className="mission-meta-item">
          <span className="mission-meta-label">
            <Calendar size={12} /> Start Date
          </span>
          <span className="mission-meta-value">{formatDate(date)}</span>
        </div>
        
        <div className="mission-meta-item">
          <span className="mission-meta-label">
            <Clock size={12} /> Due Date
          </span>
          <span className="mission-meta-value">{deadline ? formatDate(deadline) : 'N/A'}</span>
        </div>
        
        <div className="mission-meta-item">
          <span className="mission-meta-label">
            <DollarSign size={12} /> Payment
          </span>
          <span className="mission-meta-value">
            ${price.toLocaleString()} • {paymentStatus}
          </span>
        </div>
        
        <div className="mission-meta-item">
          <span className="mission-meta-label">
            <Clock size={12} /> Tasks
          </span>
          <span className="mission-meta-value">
            {tasks.completed} of {tasks.total} completed
          </span>
        </div>
      </div>
      
      <div className="mission-progress">
        <div className="progress-label">
          <span className="progress-text">Progress</span>
          <span className="progress-percentage">{progress}%</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mission-footer">
        <div className={`mission-priority ${getPriorityClass()}`}>
          {priority} Priority
        </div>
        
        <div className="mission-actions">
          {onView && (
            <button 
              className="mission-action-btn" 
              onClick={() => onView(id)}
              aria-label="View mission details"
            >
              <ExternalLink size={16} />
            </button>
          )}
          
          {onEdit && (
            <button 
              className="mission-action-btn" 
              onClick={() => onEdit(id)}
              aria-label="Edit mission"
            >
              <Edit size={16} />
            </button>
          )}
          
          {onDelete && (
            <button 
              className="mission-action-btn" 
              onClick={() => onDelete(id)}
              aria-label="Delete mission"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionDetails;