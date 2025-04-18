import { MainLayout } from '../components/layout/MainLayout';
import { useState } from 'react';
import { HomePage } from '../components/client/home page/homePage';

const ClientHome= () => {
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
      profileName = "Alex Morgan"
      profileRole = "UI/UX Designer"
    >
      <HomePage 
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isSidebarOpen={isSidebarOpen} 
        
      />
    </MainLayout>
  )}
  export default ClientHome;
