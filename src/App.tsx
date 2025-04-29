import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { CreateMission } from './components/CreateMission';
import { MissionCard } from './components/MissionCard';
import { Mission } from './types';
import { Route, Routes } from 'react-router-dom';

import { useEffect } from 'react';

import SignUpPage from './Pages/SignUpPage/SignUpPage';
import SignInPage from './Pages/SignInPage/SignInPage';
import PaymentPage from './Pages/PaymentPage/PaymentPage';
import NotificationsPage from './Pages/NotificationsPage/NotificationsPage';



function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCreateMission, setShowCreateMission] = useState(false);
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Need a complete redesign of our e-commerce website with modern UI/UX principles.',
      status: 'not_assigned',
      price: 2500,
      date: '2024-03-15',
      clientId: 'client1',
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'Looking for a developer to create an iOS/Android app for our service.',
      status: 'in_progress',
      price: 5000,
      date: '2024-03-14',
      clientId: 'client1',
    },
  ]);

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isDarkMode={isDarkMode} />

      <main style={{ 
        marginLeft: isSidebarOpen ? '260px' : '80px',
        padding: '2rem',
        transition: 'margin-left 0.3s ease',
        filter: showCreateMission ? 'blur(4px)' : 'none'
      }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <SearchBar onSearch={(query) => console.log(query)} isDarkMode={isDarkMode} />
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="search-button ms-3"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={() => setShowCreateMission(true)}
            className="search-button w-100"
          >
            + Create New Mission
          </button>
        </div>

        <div className="row g-4">
          {missions.map((mission) => (
            <div key={mission.id} className="col-12 col-md-6 col-lg-4">
              <MissionCard mission={mission} isDarkMode={isDarkMode} />
            </div>
          ))}
        </div>
  <Route path="/signup" element={<SignUpPage />} />
  <Route path="/signin" element={<SignInPage />} />
  <Route path="/payment" element={<PaymentPage />} />
  <Route path="/notifications" element={<NotificationsPage />} />


        {showCreateMission && (
          <CreateMission
            onClose={() => setShowCreateMission(false)}
            onSubmit={(newMission) => {
              setMissions([
                ...missions,
                {
                  ...newMission,
                  id: String(missions.length + 1),
                  clientId: 'client1',
                } as Mission,
              ]);
              setShowCreateMission(false);
            }}
            isDarkMode={isDarkMode}
          />
        )}
      </main>
    </div>
  );
}

export default App;