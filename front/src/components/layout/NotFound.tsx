import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { getUser } from '../../services/userService';

interface User {
  currentRole: 'freelancer' | 'client' | 'admin';
}

const NotFoundPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
   
   useEffect(() => {
     const fetchProfile = async () => {
       try {
         const data = await getUser();
         setUser(data);
       } catch (err) {
         setError('Failed to load profile');
       } finally {
         setLoading(false);
       }
     };
 
     fetchProfile();
     console.log("User data:", user);
 
   }, []);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const redirectToHome = () => {
    if (!user) return navigate('/login');

    switch (user.currentRole) {
      case 'freelancer':
        navigate('/freelancer');
        break;
      case 'client':
        navigate('/client');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <MainLayout
      isDarkMode={isDarkMode}
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      onSearch={handleSearch}
      usertype="freelancer"
    >
      <section className="flex items-center h-full p-16 bg-[var(--navy-primary)] ">
        <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8" style={{ marginTop: '100px' }}>
          <div className="max-w-md text-center">
            <h2 className="mb-8 font-extrabold text-9xl text-[var(--rose)]">
              <span className="sr-only">Error</span>404
            </h2>
            <p className="text-2xl font-semibold md:text-3xl">
              Sorry, we couldn't find this page.
            </p>
        
            <button
              onClick={redirectToHome}
              className="px-8 py-3 font-semibold rounded"
              style={{ backgroundColor: 'var(--powder)', color: 'var(--navy-primary)' }}
            >
              Back to homepage
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default NotFoundPage;
