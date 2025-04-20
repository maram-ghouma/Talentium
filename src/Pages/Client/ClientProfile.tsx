import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout'; // Ensure MainLayout is correctly imported
import ClientProfile from '../../components/client/profile/ClientProfile';


const ClientProfilePage: React.FC = () => {
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
      usertype="client"
      profileName="Sarah Anderson"
      profileRole="Client"
    >
      {/* Pass darkMode state to the ClientProfile component */}
      <ClientProfile darkMode={isDarkMode} />
    </MainLayout>
  );
};

export default ClientProfilePage;
