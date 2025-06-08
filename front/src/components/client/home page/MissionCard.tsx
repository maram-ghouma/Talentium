import React from 'react';
import { Clock, DollarSign, Circle } from 'lucide-react';
import { Mission } from '../../../types';
import '../../../Styles/client/missionCard.css';
import { useNavigate } from 'react-router-dom';


interface MissionCardProps {
  mission: Mission;
  isDarkMode: boolean;
  onClick?: () => void; // Add optional onClick handler
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, isDarkMode, onClick }) => {
  const navigate = useNavigate();
  const handleReviewClick = (e: React.MouseEvent) => {
  e.stopPropagation(); // Prevent triggering the card's onClick
  navigate(`/reviews/${mission.id}`);
};

  const statusColors = {
    not_assigned: '#F59E0B',
    in_progress: '#3B82F6',
    completed: '#10B981',
  };

  return (
    <div 
      className={`mission-card ${isDarkMode ? 'dark-mode' : ''}`}
      onClick={onClick} // Add the onClick handler
      style={{ cursor: onClick ? 'pointer' : 'default' }} // Add pointer cursor only if onClick is provided
    >
      <div className="mission-header">
        <h3 className="mission-title">{mission.title}</h3>
        <div className="mission-status">
          <Circle size={12} style={{ color: statusColors[mission.status] }} />
          <span>{mission.status.replace('_', ' ')}</span>
        </div>
      </div>

      <p className="mission-description">{mission.description}</p>

      <div className="mission-footer">
        <div className="d-flex align-items-center gap-2">
          <Clock size={16} />
          <span>{new Date(mission.date).toLocaleDateString()}</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <DollarSign size={16} />
          <span>{mission.price}</span>
        </div>
        <button 
  className="review-btn"
  onClick={handleReviewClick}
>
  Review
</button>
      </div>
    </div>
  );
};