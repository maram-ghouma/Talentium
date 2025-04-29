import React, { useState, useRef, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import Chat from '../../components/Freelancer/chat';

const FreelancerChat: React.FC = () => {

 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

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
    <Chat />
    </MainLayout>
  );
};

export default FreelancerChat;