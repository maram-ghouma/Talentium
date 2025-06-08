import React from 'react';
import { Clock, DollarSign, User } from 'lucide-react';
import { Mission } from '../../../types';
import '../../../Styles/client/missionCard2.css';
import { useNavigate } from 'react-router-dom';


interface MissionCardProps {
  mission: Mission;
  isDarkMode: boolean;
  onClick?: () => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, isDarkMode, onClick }) => {
  const navigate = useNavigate();
   const handleReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card's onClick
    navigate(`/reviews/${mission.id}`);
  };

  return (
    <div 
      className={`mission-card2 ${isDarkMode ? 'dark-mode' : ''}`}
      onClick={onClick} 
      style={{ cursor: onClick ? 'pointer' : 'default' }} 
    >
      <div className="mission-header2">
        <h3 className="mission-title2">{mission.title}</h3>
      </div>

      <p className="mission-description2">{mission.description}</p>

      <div className="client-info">
        {mission.clientLogo ? (
          <img
            src={mission.clientLogo}
            alt={`${mission.clientName} logo`}
            className="client-logo"
          />
        ) : (
          <User className="client-placeholder-icon" />
        )}
        <span
          className="client-name"
          onClick={(e) => {
            e.stopPropagation();
    navigate(`/client/profile/${mission.userId}`);
          }}
        >
          {mission.clientName}
        </span>
      </div>


      <div className="mission-footer2">
        <div className="d-flex align-items-center gap-2">
          <Clock size={16} />
          <span>{new Date(mission.date).toLocaleDateString()}</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <DollarSign size={16} />
          <span>{mission.price}</span>
        </div>
         {mission.status=="completed"&&(
            <button 
              className="review-btn"
              onClick={handleReviewClick}
            >
              Review
            </button>)}
      </div>
    </div>
  );
};
