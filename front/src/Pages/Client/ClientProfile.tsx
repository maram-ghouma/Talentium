import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout'; // Ensure MainLayout is correctly imported
import ClientProfile from '../../components/client/profile/ClientProfile';
import { getClientMissions, getClientProfile, getClientReviews, getClientStats } from '../../services/userService';
import { useNavigate, useParams } from 'react-router-dom';


const ClientProfilePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
const { id } = useParams();
      const userId = Number(id);
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };
  const [mission, setMission] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [Stats, setStats] = useState<any>(null);
  const navigate = useNavigate();
 useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getClientProfile(userId);
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
  }, [userId, navigate]);
    useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await getClientMissions(userId);
        setMission(data);
      } catch (err) {
        setError('Failed to load missions');
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();

  }, []);
    const [Reviews, setReviews] = useState<any>(null);
      useEffect(() => {
        const fetchReviews = async () => {
          try {
            const data = await getClientReviews(userId);
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
          const data = await getClientStats(userId);
          setStats(data);
        } catch (err) {
          setError('Failed to load Stats');
        } finally {
          setLoading(false);
        }
      };

      fetchStats();

    }, []);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!profile || !profile.user) {
    return <p>Loading profile...</p>;
  }

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
      <ClientProfile stats={Stats} reviews={Reviews} missions={mission} profile={profile} darkMode={isDarkMode} />
    </MainLayout>
  );
};

export default ClientProfilePage;
