import { MainLayout } from '../../components/layout/MainLayout';
import { useState } from 'react';
import { Feed } from '../../components/Freelancer/freelancerfeed/feed';

const FreelancerFeed = () => {
     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
      const [isDarkMode, setIsDarkMode] = useState(false);
      

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
      usertype='client'
 
    >
      <Feed
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isSidebarOpen={isSidebarOpen}
        searchQuery={searchQuery}
        filters={filters}
        sortOption={sortOption} 
        
      />
    </MainLayout>
  )}
  export default FreelancerFeed ;
