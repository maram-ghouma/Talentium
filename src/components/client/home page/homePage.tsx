import React, { useState } from 'react';
import { CreateMission } from './CreateMission';
import { MissionCard } from './MissionCard';
import { Mission } from '../../../types';

interface HomePageProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSidebarOpen: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ isDarkMode, toggleDarkMode, isSidebarOpen }) => {
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
    <div style={{ 
      height: '100%'
    }}>
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
    </div>
  );
};