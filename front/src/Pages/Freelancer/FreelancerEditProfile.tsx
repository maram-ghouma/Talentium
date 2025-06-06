import React, { useEffect, useState } from 'react';
import { Profile as ProfileType } from '../../types';
import { MainLayout } from '../../components/layout/MainLayout';
import Profile from '../../components/Freelancer/Profile';
import { getFreelancerMissions, getFreelancerProfile, getFreelancerReviews, getFreelancerStats } from '../../services/userService';
import { useNavigate, useParams } from 'react-router-dom';


interface ProfileProps {
    onEdit?: () => void;
  }
  
  const FreelancerProfile: React.FC<ProfileProps> = ({ onEdit }) => {
    
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
  const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mission, setMission] = useState<any>(null);
    const [Stats, setStats] = useState<any>(null);
    const navigate = useNavigate();
const { id } = useParams();
      const userId = Number(id);
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const data = await getFreelancerProfile(userId);
          setProfile(data);
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
    const [Reviews, setReviews] = useState<any>(null);
      useEffect(() => {
        const fetchReviews = async () => {
          try {
            const data = await getFreelancerReviews(userId);
            setReviews(data);
          } catch (err) {
            setError('Failed to load reviews');
          } finally {
            setLoading(false);
          }
        };
    
        fetchReviews();
    
      }, []);

    const handleSearch = (query: string) => {
      console.log('Search query:', query);
    };
   useEffect(() => {
      const fetchMissions = async () => {
        try {
          const data = await getFreelancerMissions(userId);
          setMission(data);
        } catch (err) {
          setError('Failed to load missions');
        } finally {
          setLoading(false);
        }
      };
  
      fetchMissions();
  
    }, []);
    useEffect(() => {
          const fetchStats = async () => {
            try {
              const data = await getFreelancerStats(userId);
              setStats(data);
            } catch (err) {
              setError('Failed to load Stats');
            } finally {
              setLoading(false);
            }
          };
    
          fetchStats();
    
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
        <Profile stats={Stats} reviews={Reviews} missions={mission} profile={profile} isEditable={true} />

    </MainLayout>
  );
};

export default FreelancerProfile;