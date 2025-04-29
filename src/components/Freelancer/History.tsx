import React from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import '../../Styles/Freelancer/history.css';


export type WorkHistoryItem = {
    id: string;
    title: string;
    client: string;
    date: string;
    description: string;
    skills: string[];
    feedback?: string;
    rating?: number;
  };
interface WorkHistoryItemProps {
  historyItem: WorkHistoryItem;
}

const WorkHistoryItem: React.FC<WorkHistoryItemProps> = ({ historyItem }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  return (
    <div className="card">
      <div className="flex justify-between">
        <div>
          <h4 className="font-semibold text-lg">{historyItem.title}</h4>
          <p className="text-slate-600 dark:text-slate-300">
            {historyItem.client} • {historyItem.date}
          </p>
        </div>
        
        {historyItem.rating && (
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  size={16} 
                  className={i < Math.floor(historyItem.rating || 0) ? "text-yellow-500" : "text-slate-300"}
                  fill={i < Math.floor(historyItem.rating || 0) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="ml-1 font-medium">{historyItem.rating}</span>
          </div>
        )}
      </div>
      
      <div className={`mt-4 ${!isExpanded && 'line-clamp-2'}`}>
        <p className="text-slate-600 dark:text-slate-300">
          {historyItem.description}
        </p>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {historyItem.skills.map((skill, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs dark:bg-slate-700 dark:text-slate-200"
          >
            {skill}
          </span>
        ))}
      </div>
      
      {historyItem.feedback && (
        <div className={`mt-4 ${!isExpanded && 'hidden'}`}>
          <h5 className="font-medium mb-1">Client Feedback:</h5>
          <p className="text-slate-600 italic dark:text-slate-300">"{historyItem.feedback}"</p>
        </div>
      )}
      
      <button 
        className="mt-4 text-[#3A4B6D] flex items-center text-sm font-medium"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <>
            <ChevronUp size={16} className="mr-1" />
            Show less
          </>
        ) : (
          <>
            <ChevronDown size={16} className="mr-1" />
            Show more
          </>
        )}
      </button>
    </div>
  );
};

export default WorkHistoryItem;