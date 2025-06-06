import React, { useEffect, useState } from 'react';

import '../../../Styles/client/Interviews.css';
import { useQuery } from '@apollo/client';
import { Mission } from '../../../types';
import { GET_ALL_MISSIONS } from '../../../graphql/mission';
import { MissionCard } from './freelancerMissionCard';
import MissionDetailsModal from './missionDetails';


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

export const Feed: React.FC<HomePageProps> = ({ isDarkMode, toggleDarkMode, isSidebarOpen,searchQuery,  filters, sortOption }) => {
  const [showCreateMission, setShowCreateMission] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
   const { data, loading, error,refetch } = useQuery(GET_ALL_MISSIONS);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [showDetails, setShowDetails] = useState(false);
const [showModify, setShowModify] = useState(false);

  useEffect(() => {
    if (data && data.allMissions) {
      setMissions(data.allMissions);
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
      
    {filteredMissions.length === 0 ? (
          <p>{searchQuery||filters||sortOption? 'no matching missions':'no missions exist yet.'}</p>
        ) : (
      <div className="row g-4">
        {filteredMissions.map((mission) => (
          <div key={mission.id} className="col-12 col-md-6 col-lg-4">
            <MissionCard
              mission={mission} 
              isDarkMode={isDarkMode} 
              onClick={() => {handleOpenDetails(mission);setShowDetails(true);}}
            />
          </div>
        ))}
      </div>)}
      {selectedMission && showDetails && (
        <MissionDetailsModal
        show={!!selectedMission}
        onHide={() => {setShowDetails(false); handleCloseDetails();}}
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