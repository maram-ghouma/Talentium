import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout component
import {MainLayout} from '../../components/layout/MainLayout';

import Profile from '../../components/Freelancer/Profile';
import MissionDetails from '../../components/Freelancer/mission';
import Chat from '../../components/Freelancer/chat'; 
import History from '../../components/Freelancer/History'; 

import { useState } from 'react';


const FreelancerHomePage=()=>{
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
              *
            </MainLayout>
           
            
        
             
          );
        };
export default FreelancerHomePage;



    