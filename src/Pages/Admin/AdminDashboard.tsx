
import '../../Styles/admin.css';
import Stats from '../../components/admin/stats';
import Rankings from '../../components/admin/rankings';
import { MainLayout } from '../../components/layout/MainLayout';
import { useState } from 'react';

const AdminDashboard = () => {
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
      usertype='admin'
      profileName = "Admin"
      profileRole = ""
    >
       <Stats  isDarkMode={isDarkMode} />
       <Rankings  isDarkMode={isDarkMode} />
    </MainLayout>
   
    

     
  );
};

export default AdminDashboard;