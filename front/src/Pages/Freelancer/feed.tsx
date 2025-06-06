import { MainLayout } from '../../components/layout/MainLayout';
import { useState } from 'react';
import { Feed } from '../../components/Freelancer/freelancerfeed/feed';

const FreelancerFeed = () => {
     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
      const [isDarkMode, setIsDarkMode] = useState(false);
      
      const handleSearch = (query: string) => {
        console.log("Search query:", query);
      };
  return (
    <MainLayout
      isDarkMode={isDarkMode}
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      onSearch={handleSearch}
      usertype='client'
 
    >
      <Feed
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isSidebarOpen={isSidebarOpen} 
        
      />
    </MainLayout>
  )}
  export default FreelancerFeed ;
