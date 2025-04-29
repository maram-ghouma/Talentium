import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import InterviewScheduleContainer from '../../components/client/inteviews/InterviewPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const ClientInterviewSchedule = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

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
      profileName="Alex Morgan"
      profileRole="UI/UX Designer"
    >
      <InterviewScheduleContainer isDarkMode={isDarkMode} />
    </MainLayout>
  );
};

export default ClientInterviewSchedule;