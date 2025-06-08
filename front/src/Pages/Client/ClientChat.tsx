import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import Chat from '../../components/Chat/chat';

const ClientChat: React.FC = () => {
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
      usertype="client"
      //profileName="Client"
      //profileRole=""
    >
      <Chat />
    </MainLayout>
  );
};

export default ClientChat;
