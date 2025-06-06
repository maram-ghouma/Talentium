import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import { useParams } from 'react-router-dom';

const FreelancerKanban: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const { id: missionId } = useParams<{ id: string }>();

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
      <KanbanBoard missionId={missionId ?? ''} />
    </MainLayout>
  );
};

export default FreelancerKanban;
