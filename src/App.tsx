import React, { useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './components/client/home page/homePage';

function App() {
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
    >
      <HomePage 
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isSidebarOpen={isSidebarOpen} 
      />
    </MainLayout>
  );
}

export default App;