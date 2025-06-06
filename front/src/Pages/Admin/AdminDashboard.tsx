
import '../../Styles/admin/admin.css';
import Stats from '../../components/admin/stats';
import Rankings from '../../components/admin/rankings';
import { MainLayout } from '../../components/layout/MainLayout';
import { useEffect, useState } from 'react';
import { getAdminStats, getTopRatedClients, getTopRatedFreelancers } from '../../services/adminService';

const AdminDashboard = () => {
     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const handleSearch = (query: string) => {
        console.log("Search query:", query);
      };
    const [AdminStats, setAdminStats] = useState<any>(null);
        useEffect(() => {
          const fetchStats = async () => {
            try {
              const data = await getAdminStats();
              setAdminStats(data);
            } catch (err) {
              setError('Failed to load stats');
            } finally {
              setLoading(false);
            }
          };

          fetchStats();

        }, []);
        const [RatedClients, setRatedClients] = useState<any[]>([]); 
        useEffect(() => {
          const fetchStats = async () => {
            try {
              const data = await getTopRatedClients();
              setRatedClients(data);
            } catch (err) {
              setError('Failed to load top rated clients');
            } finally {
              setLoading(false);
            }
          };

          fetchStats();

        }, []);
        const [RatedFreelancers, setRatedFreelancers] = useState<any[]>([]); ;
        useEffect(() => {
          const fetchStats = async () => {
            try {
              const data = await getTopRatedFreelancers();
              setRatedFreelancers(data);
            } catch (err) {
              setError('Failed to load top rated freelancers');
            } finally {
              setLoading(false);
            }
          };

          fetchStats();

        }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
<MainLayout
      isDarkMode={isDarkMode}
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      onSearch={handleSearch}
      usertype='admin'
    >
       <Stats  Adminstats={AdminStats} isDarkMode={isDarkMode} />
       <Rankings  rankedClients={RatedClients} rankedFreelancers={RatedFreelancers} isDarkMode={isDarkMode} />
    </MainLayout>
   
    

     
  );
};

export default AdminDashboard;