import React, { useEffect, useState } from 'react';
import { CreateMission } from './CreateMission';
import { MissionCard } from './MissionCard';
import MissionDetailsModal from './MissionDetailsModal';
import { Mission } from '../../../types';
import '../../../Styles/client/Interviews.css';
import { useQuery } from '@apollo/client';
import { GET_MISSIONS } from '../../../graphql/mission';
import { ModifyMission } from './ModifyMission';
interface HomePageProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSidebarOpen: boolean;
  searchQuery: string;
   filters: {
    status: string;
    dateRange: string;
  };
  sortOption: string;
}

export const HomePage: React.FC<HomePageProps> = ({ isDarkMode, toggleDarkMode, isSidebarOpen,searchQuery,  filters, sortOption }) => {
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
const filteredMissions = React.useMemo(() => {
  let result = [...missions];
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(mission => 
      mission.title.toLowerCase().includes(query) || 
      mission.description.toLowerCase().includes(query)
    );
  }
  
  if (filters.status) {
    result = result.filter(mission => {
      switch(filters.status) {
        case 'in_progress':
          return mission.status === "in_progress"; 
        case 'completed':
          return mission.status === "completed";
        case 'not_assigned':
          return mission.status === "not_assigned";
        default:
          return true;
      }
    });
  }
  
  if (filters.dateRange && filters.dateRange !== 'all') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    result = result.filter(mission => {
      const missionDate = new Date(mission.deadline?mission.deadline:mission.date);
      missionDate.setHours(0, 0, 0, 0);
      
      switch(filters.dateRange) {
        case 'today':
          return missionDate.getTime() === today.getTime();
        case 'week': {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay()); 
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return missionDate >= weekStart && missionDate <= weekEnd;
        }
        case 'month': {
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          return missionDate >= monthStart && missionDate <= monthEnd;
        }
        default:
          return true;
      }
    });
  }
  
  if (sortOption) {
    result.sort((a, b) => {
      switch(sortOption) {
        case 'newest': 
          const deadlineA = new Date(a.deadline || a.date);
          const deadlineB = new Date(b.deadline || b.date);
          return deadlineA.getTime() - deadlineB.getTime();
          
        case 'oldest': 
          const deadlineAOldest = new Date(a.deadline || a.date);
          const deadlineBOldest = new Date(b.deadline || b.date);
          return deadlineBOldest.getTime() - deadlineAOldest.getTime();
          
        case 'alpha': 
          return a.title.localeCompare(b.title);
          
        default:
          return 0;
      }
    });
  }
  
  return result;
}, [missions, searchQuery, filters.status, filters.dateRange, sortOption]); 

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
        {filteredMissions.length === 0 ? (
          <p>{searchQuery||filters||sortOption? 'no matching missions':'You don\'t have any missions created yet.'}</p>
        ) : (
          filteredMissions.map((mission) => (
            <div key={mission.id} className="col-12 col-md-6 col-lg-4">
              <MissionCard 
                mission={mission} 
                isDarkMode={isDarkMode} 
                onClick={() => {handleOpenDetails(mission);setShowDetails(true);}}
              />
            </div>
          ))
        )}
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
          selectedFreelancer: selectedMission.selectedFreelancer,
          clientId: '1',
          clientName:'john Client',////////////////////////////////////////////////////////////////////
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
      {showModify && selectedMission && (
        <ModifyMission
          mission={selectedMission}
          onClose={() => {
            setShowModify(false); 
            refetch().then((result) => {
              const updatedMission = result.data.missions.find(m => m.id === selectedMission.id);
              if (updatedMission) {
                setSelectedMission(updatedMission);
              }
              setShowDetails(true);
            });
          }}
          onSubmit={() => {
            setShowModify(false);
              if (data?.missions) {
                window.location.reload(); 
              }
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};