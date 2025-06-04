import React, { useEffect, useState } from 'react';
import { CreateMission } from './CreateMission';
import { MissionCard } from './MissionCard';
import MissionDetailsModal from './MissionDetailsModal';
import { Mission } from '../../../types';
import '../../../Styles/client/Interviews.css';
import { useQuery } from '@apollo/client';
import { GET_MISSIONS } from '../../../graphql/mission';
interface HomePageProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSidebarOpen: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ isDarkMode, toggleDarkMode, isSidebarOpen }) => {
  const [showCreateMission, setShowCreateMission] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
   const { data, loading, error } = useQuery(GET_MISSIONS);
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    if (data && data.missions) {
      setMissions(data.missions);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error){console.error('GraphQL error stack:', error);  return<p>Error loading missions</p>;}

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
          id: selectedMission.id,
          price:selectedMission.price,
          clientId: '1',
          clientName:'john Client',
          tasks: {
        total: 2,
        completed: 0
      },
          date: selectedMission.date,
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