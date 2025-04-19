import '../../Styles/admin/admin.css';
import { MainLayout } from '../../components/layout/MainLayout';
import { useState } from 'react';
import FreelancerTable from '../../components/admin/FreelancerTable';
interface Freelancer {
    id: string;
    name: string;
    rating: number;
    completedJobs: number;
    field: string;
    hourlyRate: number;
    joinedDate: string;
  }
  
const FreelancersList = () => {
     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
      const [isDarkMode, setIsDarkMode] = useState(false);
      const [freelancers] = useState<Freelancer[]>([
          {
            id: '1',
            name: 'Sarah Johnson',
            rating: 4.9,
            completedJobs: 156,
            field: 'Web Development',
            hourlyRate: 45,
            joinedDate: '2023-01-15'
          },
          {
            id: '2',
            name: 'Michael Chen',
            rating: 4.8,
            completedJobs: 143,
            field: 'UI/UX Design',
            hourlyRate: 55,
            joinedDate: '2023-02-20'
          },
          {
            id: '3',
            name: 'Emma Wilson',
            rating: 4.8,
            completedJobs: 128,
            field: 'Content Writing',
            hourlyRate: 35,
            joinedDate: '2023-03-10'
          }
        ]);
    
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
       <FreelancerTable  freelancers={freelancers} />
    </MainLayout>
   
  

     
  );
}


export default FreelancersList;