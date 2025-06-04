import React, { useEffect, useState } from 'react';

import '../../Styles/client/Interviews.css';
import { useQuery } from '@apollo/client';
import { Mission } from '../../types';
import { GET_MISSIONS } from '../../graphql/mission';
import MissionDetailsModal from '../client/home page/MissionDetailsModal';
import { MissionCard } from '../client/home page/MissionCard';


interface HomePageProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSidebarOpen: boolean;
}

export const Feed: React.FC<HomePageProps> = ({ isDarkMode, toggleDarkMode, isSidebarOpen }) => {
  const [showCreateMission, setShowCreateMission] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
   const { data, loading, error,refetch } = useQuery(GET_MISSIONS);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [showDetails, setShowDetails] = useState(false);
const [showModify, setShowModify] = useState(false);

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
      

      <div className="row g-4">
        {missions.map((mission) => (
          <div key={mission.id} className="col-12 col-md-6 col-lg-4">
            <MissionCard
              mission={mission} 
              isDarkMode={isDarkMode} 
              onClick={() => {handleOpenDetails(mission);setShowDetails(true);}}
            />
          </div>
        ))}
      </div>
      {selectedMission && showDetails && (
        <MissionDetailsModal
        show={!!selectedMission}
        onHide={() => {setShowDetails(false); handleCloseDetails();}}
        onModifyClick={() => {
        setShowDetails(false); 
        setShowModify(true);   
      }}
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