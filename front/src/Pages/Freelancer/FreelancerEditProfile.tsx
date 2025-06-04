import React, { useEffect, useState } from 'react';
import { Profile as ProfileType } from '../../types';
import { MainLayout } from '../../components/layout/MainLayout';
import Profile from '../../components/Freelancer/Profile';
import { getFreelancerMissions, getFreelancerProfile, getFreelancerReviews } from '../../services/userService';


interface ProfileProps {
    onEdit?: () => void;
  }
  
  const FreelancerProfile: React.FC<ProfileProps> = ({ onEdit }) => {
    
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
  const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const[mission, setMission] = useState<any>(null);
  
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const data = await getFreelancerProfile();
          setProfile(data);
        } catch (err) {
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
            const data = await getFreelancerReviews();
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
          const data = await getFreelancerMissions();
          setMission(data);
        } catch (err) {
          setError('Failed to load missions');
        } finally {
          setLoading(false);
        }
      };
  
      fetchMissions();
  
    }, []);




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
        <Profile reviews={Reviews} missions={mission} profile={profile} isEditable={true} />

    </MainLayout>
  );
};

export default FreelancerProfile;