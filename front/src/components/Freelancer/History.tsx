import React, { JSX, useState } from 'react';
import { Star, Calendar } from 'lucide-react';
import { WorkHistoryItem } from '../../types';
import '../../Styles/Freelancer/history.css';
import { MainLayout } from '../layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { create } from 'domain';
import { CreateReportFreelancer } from '../../services/userService';
interface HistoryProps {
  historyItems: WorkHistoryItem[];
}

const History: React.FC<HistoryProps> = ({ historyItems }) => {
    const [showModal, setShowModal] = useState(false);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
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
const handleReportClick = () => {
handleOpenModal();
}
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
  const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => {
      setShowModal(false);
      setReason('');
    };

    const handleSubmitReport = async (itemId: number) => {
      if (!reason.trim()) {
        alert('Please enter a reason');
        return;
      }
  
      setIsSubmitting(true);
      try {
        await CreateReportFreelancer({ missionId: itemId, reason: reason });
        alert('Report submitted successfully');
        handleCloseModal();
        window.location.reload();
      } catch (error) {
        console.error('Failed to submit report:', error);
        alert('Error submitting report');
      } finally {
        setIsSubmitting(false);
      }
    };
  
  
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
  
    const handleSearch = (query: string) => {
      console.log('Search query:', query);
    };
  const navigate = useNavigate();
  const handleClick = (id: number) => {
    navigate(`/kanban/${id}`);
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
              <div className='flex justify-between align-center'>
              <button
                className="review-btn"
                style={{marginTop: '10px', backgroundColor: 'var(--navy-primary)', color: 'white', padding: '8px 12px', borderRadius: '4px', border: 'none'}}
                onClick={() => handleClick(item.id)}
              >
                Kanban 
              </button>

              <button className="report-button" style={{marginLeft: '10px'}} onClick={handleReportClick}>
                Report
              </button>
              
              </div>
            </div>
            {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '8px',
              minWidth: '400px',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              borderBottom: '1px solid #eee'
            }}>
              <h3 style={{ margin: 0 }}>Enter your reason</h3>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Write resolution details here..."
                style={{
                  width: '100%',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '10px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              padding: '20px',
              borderTop: '1px solid #eee'
            }}>
              <button
                onClick={() => handleSubmitReport(item.id)}
                disabled={isSubmitting}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontWeight: 500,
                  backgroundColor: isSubmitting ? '#6c757d' : '#28a745',
                  color: 'white'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                  backgroundColor: '#6c757d',
                  color: 'white'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
