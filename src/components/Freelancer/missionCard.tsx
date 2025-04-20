import React from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import { Mission } from '../../types';
import StatusBadge from './statusBadge';
import { Link } from 'react-router-dom';

interface MissionCardProps {
  mission: Mission;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission }) => {
  return (
    <Link to={`/mission/${mission.id}`} className="block">
      <div className="card hover:translate-y-[-2px]">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">{mission.title}</h3>
          <StatusBadge status={mission.status} />
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
          {mission.description}
        </p>
        
        <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>{mission.date}</span>
          </div>
          
          <div className="flex items-center font-medium text-slate-700 dark:text-slate-200">
            <DollarSign size={16} className="mr-1" />
            <span>{mission.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MissionCard;