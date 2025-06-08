import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import { useParams } from 'react-router-dom';

const ClientKanban: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { id: missionId } = useParams<{ id: string }>();

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  if (!missionId) {
    return <div>Error: Mission ID is missing</div>;
  }

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
      <KanbanBoard missionId={missionId} />
    </MainLayout>
  );
};

export default ClientKanban;