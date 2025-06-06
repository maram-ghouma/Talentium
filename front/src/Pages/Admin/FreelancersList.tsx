import '../../Styles/admin/admin.css';
import { MainLayout } from '../../components/layout/MainLayout';
import { useEffect, useState } from 'react';
import FreelancerTable from '../../components/admin/FreelancerTable';
import {Freelancer} from '../../types'
import { getAllFreelancers } from '../../services/adminService';
const FreelancersList = () => {
     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
      const [isDarkMode, setIsDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
          const [Freelancers, setFreelancers] = useState<any[]>([]);
                  useEffect(() => {
                    const fetchFreelancers = async () => {
                      try {
                        const data = await getAllFreelancers();
                        setFreelancers(data);
                      } catch (err) {
                        setError('Failed to load stats');
                      } finally {
                        setLoading(false);
                      }
                    };

                    fetchFreelancers();

                  }, []);
    
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
      
    >
       <FreelancerTable  freelancers={Freelancers} />
    </MainLayout>
   
  

     
  );
}


export default FreelancersList;