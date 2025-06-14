import '../../Styles/Freelancer/home.css';
import FreelancerHomePage from './FreelancerHomePage';
import { MainLayout } from '../../components/layout/MainLayout';
import { useState } from 'react';

const FreelancerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };
  const missions = [];

  return (
    <MainLayout
      isDarkMode={isDarkMode}
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      onSearch={handleSearch}
      usertype="freelancer"
  
    >
       <FreelancerHomePage 
                freelancerName="John Doe" 
                stats={{ completedMissions: 10, totalEarnings: 5000, activeClients: 3, not_assignedMissions: 2 }} 
                missions={missions} 
              />
        
    </MainLayout>
  );
};

export default FreelancerDashboard;
