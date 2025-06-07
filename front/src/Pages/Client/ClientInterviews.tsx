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

  const [searchQuery, setSearchQuery] = useState(''); 
  const [filters, setFilters] = useState({
    status: '',
    dateRange: ''
  });
  const [sortOption, setSortOption] = useState('');
  const handleFilter = (newFilters: {status: string, dateRange: string}) => {
    setFilters(newFilters);
    console.log("Filter options:", newFilters);
  };

  const handleSort = (option: string) => {
    setSortOption(option);
    console.log("Sort option:", option);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query); 
  }



  return (
    <MainLayout
      isDarkMode={isDarkMode}
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      onSearch={handleSearch}
      onFilter={handleFilter}
      onSort={handleSort}
      usertype="client"
      
    >
      <InterviewScheduleContainer isDarkMode={isDarkMode} searchQuery={searchQuery}
        filters={filters}
        sortOption={sortOption}/>
    </MainLayout>
  );
};

export default ClientInterviewSchedule;