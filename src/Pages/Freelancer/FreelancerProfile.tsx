import React, { useState } from 'react';
import { Profile as ProfileType } from '../../types';
import { MainLayout } from '../../components/layout/MainLayout';
import Profile from '../../components/Freelancer/Profile';


interface ProfileProps {
    profile: ProfileType;
    onEdit?: () => void;
  }
  
  const FreelancerProfile: React.FC<ProfileProps> = ({ profile, onEdit }) => {
    const {
      name,
      title,
      avatar,
      location,
      email,
      phone,
      bio,
      skills,
      hourlyRate,
      availability,
      joinedDate,
      socialLinks
    } = profile;
  
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
  
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
         usertype="freelancer"
         profileName="Freelancer"
         profileRole=""
       >
        <Profile profile={profile} />
    
    </MainLayout>
  );
};

export default FreelancerProfile;