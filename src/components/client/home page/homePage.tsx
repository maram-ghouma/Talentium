import React, { useState } from 'react';
import { CreateMission } from './CreateMission';
import { MissionCard } from './MissionCard';
import MissionDetailsModal from './MissionDetailsModal';
import { Mission } from '../../../types';
import '../../../Styles/client/Interviews.css';
interface HomePageProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSidebarOpen: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ isDarkMode, toggleDarkMode, isSidebarOpen }) => {
  const [showCreateMission, setShowCreateMission] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Need a complete redesign of our e-commerce website with modern UI/UX principles.',
      status: 'not_assigned',
      price: 2500,
      date: '2024-03-15',
      clientId: 'client1',
      requiredSkills: ['UI/UX', 'HTML', 'CSS', 'JavaScript'],
      deadline: new Date('2024-04-15'),
      budget: '$2,500',
      createdAt: new Date('2024-03-15'),
      clientName: 'EcoShop Inc.',
    client:'EcoShop Inc.',
    paymentStatus: 'Unpaid',
    priority: 'High',
    progress: 0,
    tasks: { total: 0, completed: 0 },
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'Looking for a developer to create an iOS/Android app for our service.',
      status: 'in_progress',
      price: 5000,
      date: '2024-03-14',
      clientId: 'client1',
      requiredSkills: ['React Native', 'iOS', 'Android', 'API Integration'],
      deadline: new Date('2024-05-01'),
      budget: '$5,000',
      createdAt: new Date('2024-03-14'),
      clientName: 'TechStart Solutions',
      client:'Ecorefk Inc.',
      paymentStatus: 'Unpaid',
      priority: 'High',
      progress: 0,
      tasks: { total: 0, completed: 0 },
    },
  ]);

  const handleOpenDetails = (mission: Mission) => {
    setSelectedMission(mission);
  };

  const handleCloseDetails = () => {
    setSelectedMission(null);
  };

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
            <MissionCard 
              mission={mission} 
              isDarkMode={isDarkMode} 
              onClick={() => handleOpenDetails(mission)}
            />
          </div>
        ))}
      </div>

      {showCreateMission && (
        <CreateMission
          onClose={() => setShowCreateMission(false)}
          onSubmit={(newMission) => {
            const mission = {
              ...newMission,
              id: String(missions.length + 1),
              clientId: 'client1',
              requiredSkills: newMission.requiredSkills || [],
              deadline: newMission.date ? new Date(newMission.date) : new Date(),
              budget: `$${newMission.price || 0}`,
              createdAt: new Date()
            } as Mission;
            
            setMissions([...missions, mission]);
            setShowCreateMission(false);
          }}
          isDarkMode={isDarkMode}
        />
      )}

      {selectedMission && (
        <MissionDetailsModal
        show={!!selectedMission}
        onHide={handleCloseDetails}
        mission={{
          title: selectedMission.title,
          description: selectedMission.description,
          requiredSkills: selectedMission.requiredSkills || [],
          deadline: typeof selectedMission.deadline === 'string' 
            ? new Date(selectedMission.deadline) 
            : (selectedMission.deadline || new Date(selectedMission.date)),
            budget: selectedMission.budget || `$${selectedMission.price}`,
            status: selectedMission.status as 'not_assigned' | 'assigned' | 'completed',
            createdAt: selectedMission.createdAt || new Date(selectedMission.date)
          }}
          darkMode={isDarkMode}
        />
      )}
    </div>
  );
};