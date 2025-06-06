import React, { JSX, useEffect, useState } from 'react';
import { Star, Calendar } from 'lucide-react';
import { WorkHistoryItem } from '../../types';

import History from '../../components/Freelancer/History';
import { MainLayout } from '../../components/layout/MainLayout';
import { getFreelancerMissionsWithReviews } from '../../services/userService';
import { useNavigate } from 'react-router-dom';

interface HistoryProps {
  historyItems: WorkHistoryItem[];
}

const FreelancerHistory: React.FC<HistoryProps> = ({ historyItems }) => {
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
    const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const navigate = useNavigate();
    const [data, setData] = useState<any[]>([]);
    useEffect(() => {
          const fetchProfile = async () => {
            try {
              const data = await getFreelancerMissionsWithReviews();
              setData(data);


            } catch (err: any) {
            if (err.response && err.response.status === 404) {
              navigate('/404', { replace: true });
              return;
            }
            setError('Failed to load profile');
            } finally {
              setLoading(false);
            }
          };
      
          fetchProfile();
      
        }, []);
    return (
      <MainLayout
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onSearch={handleSearch}
        usertype="freelancer"

      >
    <History historyItems={data} />
  </MainLayout>
  );
};

export default FreelancerHistory;
