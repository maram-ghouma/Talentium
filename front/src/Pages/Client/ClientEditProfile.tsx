import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout'; // Ensure MainLayout is correctly imported
import ClientProfile from '../../components/client/profile/ClientProfile';
import { getClientMissions, getClientProfile, getClientReviews, getClientStats } from '../../services/userService';


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
    const fetchProfile = async () => {
      try {
        const data = await getClientProfile();
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

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
          const data = await getClientStats();
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
      profileName={profile.user.username}
      profileRole="Client"
    >
      {/* Pass darkMode state to the ClientProfile component */}
      <ClientProfile stats={Stats} reviews={Reviews} missions={mission} profile={profile} isEditable={true} darkMode={isDarkMode}  />
    </MainLayout>
  );
};

export default ClientProfilePage;
