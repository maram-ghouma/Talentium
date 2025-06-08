import React, { JSX, useState } from 'react';
import { Star, Calendar } from 'lucide-react';
import { WorkHistoryItem } from '../../types';
import '../../Styles/Freelancer/history.css';
import { MainLayout } from '../layout/MainLayout';

interface HistoryProps {
  historyItems: WorkHistoryItem[];
}

const History: React.FC<HistoryProps> = ({ historyItems }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getDateRange = (startDate: string, endDate: string | null) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const renderStars = (rating: number) => {
    const stars: JSX.Element[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i}
          size={14}
          className={i <= rating ? 'star-filled' : 'star-empty'}
        />
      );
    }
    return stars;
  };
  
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
  
    const handleSearch = (query: string) => {
      console.log('Search query:', query);
    };
  
    return (
     
    <div className="history-container">
      <div className="timeline">
      {historyItems && historyItems.length > 0 ? (
          historyItems.map((item) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-date">
              <Calendar size={14} /> {getDateRange(item.date, item.deadline || null)}
            </div>
            <div className="timeline-content">
              <h3 className="timeline-title">{item.title}</h3>
              
              
              <p className="timeline-description">{item.description}</p>
              
              <div className="timeline-skills">
                {item.requiredSkills?.map((skill, index) => (
                  <span key={index} className="timeline-skill">{skill}</span>
                ))}
              </div>
              
              {item.review && (
                <div className="timeline-testimonial">
                  <p className="testimonial-text">{item.review.comment}</p>
                  <div className="testimonial-author">- {item.review.reviewer.username}</div>
                  <div className="testimonial-rating">
                    <div className="mb-2">
                     {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={item.review && i < item.review.stars ? 'text-warning' : 'text-muted'}
                        fill={item.review && i < item.review.stars ? 'currentColor' : 'none'}
                      />
                    ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
            ))
        ) : (
          <div className="no-missions-message" style={{ margin: '100px 0 200px ', padding: '10px', textAlign: 'center', color: 'var(--navy-primary)', fontWeight: 'bold' }}>No missions yet</div>
        )}
      </div>
    </div>
  
  );
};

export default History;
