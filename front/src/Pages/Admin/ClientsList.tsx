
import '../../Styles/admin/admin.css';
import { MainLayout } from '../../components/layout/MainLayout';
import { useState } from 'react';
import ClientTable from '../../components/admin/ClientTable';
import {Client} from '../../types'
  
const ClientsList = () => {
     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
      const [isDarkMode, setIsDarkMode] = useState(false);
      const [clients] = useState<Client[]>([
          {
            id: '1',
            name: 'Sarah Johnson',
            rating: 4.9,
            postedmissions: 156,
            interaction: 45,
            joinedDate: '2023-01-15'
          },
          {
            id: '2',
            name: 'Michael Chen',
            rating: 4.9,
            postedmissions: 156,
            interaction: 45,
            joinedDate: '2023-01-15'
          },
          {
            id: '3',
            name: 'Emma Wilson',
            rating: 4.9,
            postedmissions: 156,
            interaction: 45,
            joinedDate: '2023-01-15'
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
      
    >
       <ClientTable  clients={clients} />
    </MainLayout>
   
  

     
  );
}


export default ClientsList;