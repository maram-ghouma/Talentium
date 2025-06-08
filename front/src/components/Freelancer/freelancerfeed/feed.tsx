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
  const [page, setPage] = useState(1);
const pageSize = 12;
   const { data, loading, error, refetch } = useQuery(GET_ALL_MISSIONS, {
  variables: { page, pageSize },
});
  const [missions, setMissions] = useState<Mission[]>([]);
  const [showDetails, setShowDetails] = useState(false);
const [showModify, setShowModify] = useState(false);
 

/*
  useEffect(() => {
    if (data && data.allMissions) {
      setMissions(data.allMissions);
    }
  }, [data]);*/
useEffect(() => {
  if (data && data.allMissions) {
    const mappedMissions: Mission[] = data.allMissions.filter((m: any) => m.status === "not_assigned").map((m: any) => ({
      id: m.id,
      userId:m.client.user.id,
      title: m.title,
      description: m.description,
      status: m.status, 
      price: m.price,
      date: m.date,
      clientId: m.client.id,
      client: m.client,
      clientLogo: m.client.user.imageUrl,
      requiredSkills: m.requiredSkills ?? [],
      deadline: m.deadline,
      budget: m.budget,
      createdAt: m.createdAt ? new Date(m.createdAt) : undefined,
      clientName: m.client.user.username,
    }));
    setMissions(mappedMissions);
  }
}, [data]);



const filteredMissions = React.useMemo(() => {
  let result = [...missions];
  
  if (searchQuery) {
    setPage(1);
    const query = searchQuery.toLowerCase();
    result = result.filter(mission => 
      mission.title.toLowerCase().includes(query) || 
      mission.description.toLowerCase().includes(query)
    );
  }
  
  if (filters.status) {
    setPage(1);
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
    setPage(1);
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
    setPage(1);
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
const totalPages = Math.ceil(filteredMissions.length / pageSize);

const paginatedMissions = React.useMemo(() => {
  const start = (page - 1) * pageSize;
  return filteredMissions.slice(start, start + pageSize);
}, [filteredMissions, page, pageSize]);

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
        {paginatedMissions.map((mission) => (
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
          clientId: selectedMission.clientId,
          clientLogo:selectedMission.clientLogo,
          clientName:selectedMission.clientName,
          userId:selectedMission.userId,
          tasks: {
        total: 0,
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
      <div className="d-flex justify-content-center align-items-center my-4 gap-3" style={{ marginBottom: '0.5rem' }}>
  <button 
    className="btn btn-sm rounded-pill px-4"
    style={{ backgroundColor: 'var(--slate)', color: 'white', border: 'none' ,marginBottom: '0.5rem'}}
    disabled={page === 1} onClick={() => setPage(p => Math.max(p - 1, 1))}
  >
    ← Previous
  </button>

  <span className="fw-semibold fs-6" style={{ marginBottom: '0.5rem' }}>
    Page <strong>{page}</strong> of <strong>{totalPages || 1}</strong>
  </span>

  <button 
    className="btn btn-sm rounded-pill px-4"
    style={{ backgroundColor: 'var(--slate)', color: 'white', border: 'none' ,marginBottom: '0.5rem'}}
    disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => Math.min(p + 1, totalPages))}
  >
    Next →
  </button>
</div>


    </div>
    
  );
};