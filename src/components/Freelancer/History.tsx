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
      <MainLayout
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onSearch={handleSearch}
        usertype="freelancer"
        profileName="Freelancer"
        profileRole=""
      >
    <div className="history-container">
      <div className="timeline">
        {historyItems.map((item) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-date">
              <Calendar size={14} /> {getDateRange(item.date, item.endDate)}
            </div>
            <div className="timeline-content">
              <h3 className="timeline-title">{item.title}</h3>
              
              <div className="timeline-client">
                {item.clientLogo && <img src={item.clientLogo} alt={item.client} className="client-logo" />}
                <span className="client-name">{item.client}</span>
              </div>
              
              <p className="timeline-description">{item.description}</p>
              
              <div className="timeline-skills">
                {item.skills.map((skill, index) => (
                  <span key={index} className="timeline-skill">{skill}</span>
                ))}
              </div>
              
              {item.testimonial && (
                <div className="timeline-testimonial">
                  <p className="testimonial-text">{item.testimonial.text}</p>
                  <div className="testimonial-author">- {item.testimonial.author}</div>
                  <div className="testimonial-rating">
                    {renderStars(item.testimonial.rating)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </MainLayout>
  );
};

export default History;
