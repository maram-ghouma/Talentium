
import '../../Styles/admin/admin.css';
import { MainLayout } from '../../components/layout/MainLayout';
import { useEffect, useState } from 'react';
import ClientTable from '../../components/admin/ClientTable';
import {Client} from '../../types'
import { getAllClients } from '../../services/adminService';
  
const ClientsList = () => {
     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
      const [isDarkMode, setIsDarkMode] = useState(false);
       const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
      const [Clients, setClients] = useState<any[]>([]);
              useEffect(() => {
                const fetchClients = async () => {
                  try {
                    const data = await getAllClients();
                    setClients(data);
                  } catch (err) {
                    setError('Failed to load stats');
                  } finally {
                    setLoading(false);
                  }
                };

                fetchClients();

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
       <ClientTable  clients={Clients} />
    </MainLayout>
   
  

     
  );
}


export default ClientsList;