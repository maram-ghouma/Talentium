import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout'; // Ensure MainLayout is correctly imported
import ClientProfile from '../../components/client/profile/ClientProfile';
import { getClientMissions, getClientProfile, getClientReviews, getClientStats, getMyStats } from '../../services/userService';
import { useNavigate } from 'react-router-dom';


const ClientProfilePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mission, setMission] = useState<any>(null);
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };
   const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [Reviews, setReviews] = useState<any>(null);
  const [Stats, setStats] = useState<any>(null);
const navigate = useNavigate();
    useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getClientProfile();
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
    useEffect(() => {

      const fetchMissions = async () => {
        try {
          const data = await getClientMissions();
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
      const fetchReviews = async () => {
        try {
          const data = await getClientReviews();
          setReviews(data);
        } catch (err) {
          setError('Failed to load reviews');
        } finally {
          setLoading(false);
        }
      };
  
      fetchReviews();
  
    }, []);
    useEffect(() => {
      const fetchStats = async () => {
        try {
          const data = await getMyStats();
          setStats(data);
        } catch (err) {
          setError('Failed to load Stats');
        } finally {
          setLoading(false);
        }
      };

      fetchStats();

    }, []);
if (!profile || !profile.user) {
  return <div>Loading profile...</div>; 
}

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <MainLayout
      isDarkMode={isDarkMode}
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      onSearch={handleSearch}
      usertype="client"
     
    >
      {/* Pass darkMode state to the ClientProfile component */}
      <ClientProfile stats={Stats} reviews={Reviews} missions={mission} profile={profile} isEditable={true} darkMode={isDarkMode}  />
    </MainLayout>
  );
};

export default ClientProfilePage;
