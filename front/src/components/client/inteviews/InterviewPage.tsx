import { useState, useEffect, useMemo } from 'react';
import InterviewList from './InterviewList';
import NewInterviewModal from './NewINterviewModal';
import { Interview } from '../../../types';
import '../../../Styles/client/Interviews.css';
import { useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { GET_INTERVIEWS, REMIND_ME_MUTATION } from '../../../graphql/interviews';


const ClientInterviewSchedule = ({ isDarkMode, searchQuery, filters,sortOption}) => {

    const location = useLocation();
    const [type, setType] = useState('');

useEffect(() => {
  if (location.pathname === "/client/interviews") {
    setType('client');
  } else if (location.pathname === '/freelancer/interviews') {
    setType('freelancer');
  }
}, [location.pathname]);

  const [showCreateMission, setShowCreateMission] = useState(false);
    const { data, loading, error,refetch } = useQuery(GET_INTERVIEWS, {
    variables: { type: type }, 
    fetchPolicy: 'cache-and-network'
  });

const [interviews, setInterviews] = useState<Interview[]>([]);

useEffect(() => {
  if (data && data.interviews) {
    const fetchedInterviews = data.interviews.map((interview: any) => ({
      id: interview.id,
      topic: interview.topic,
      scheduledDateTime: interview.scheduledDateTime,
      remindMe: type==="client"? interview.remindMeC: interview.remindMeF,
      candidateName: type==="client"? interview.freelancer.user.username: interview.client.user.username,
    })).sort((a, b) => new Date(a.scheduledDateTime).getTime() - new Date(b.scheduledDateTime).getTime());
    setInterviews(fetchedInterviews);
  }
}, [data]);


const filteredInterviews = useMemo(() => {
  let result = [...interviews];
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(mission => 
      mission.topic.toLowerCase().includes(query) || 
      mission.candidateName.toLowerCase().includes(query)
    );
  }
  
  if (filters.status) {
  result = result.filter(mission => {
    const missionDate = new Date(mission.scheduledDateTime);
    
    switch(filters.status) {
      case 'upcoming':
        return missionDate >= new Date();
      case 'past':
        return missionDate < new Date();
      case 'all':
      default:
        return true;
    }
  });
}
  
  if (filters.dateRange && filters.dateRange !== 'all') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    result = result.filter(mission => {
      const missionDate = new Date(mission.scheduledDateTime);
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
          const deadlineA = new Date(a.scheduledDateTime);
          const deadlineB = new Date(b.scheduledDateTime);
          return deadlineA.getTime() - deadlineB.getTime();
          
        case 'oldest': 
          const deadlineAOldest = new Date(a.scheduledDateTime);
          const deadlineBOldest = new Date(b.scheduledDateTime);
          return deadlineBOldest.getTime() - deadlineAOldest.getTime();
          
        case 'alpha': 
          return a.topic.localeCompare(b.topic);
          
        default:
          return 0;
      }
    });
  }
  
  return result;
}, [interviews, searchQuery, filters.status, filters.dateRange, sortOption]); 


const [remindMeMutation] = useMutation(REMIND_ME_MUTATION);

const handleToggleReminder = async (id: string) => {
  try {
    const { data } = await remindMeMutation({ variables: { interviewId: id } });
  } catch (error) {
    console.error('Failed to toggle remindMe', error);
  }
};

  const handleAddInterview = (newInterview: Omit<Interview, 'id'>) => {
    setInterviews(prev => [...prev, { ...newInterview, id: Date.now().toString() }]);
    const interview: Interview = {
      ...newInterview,
      id: Date.now().toString(),
    };

    setInterviews((prev) =>
      [...prev, interview].sort(
        (a, b) =>
          new Date(a.scheduledDateTime).getTime() -
          new Date(b.scheduledDateTime).getTime()
      )
    );
  };

  return (
    <div className="container py-4">
      <div className="interview-header d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: isDarkMode ? 'var(--slate)' : '' }}>
          Client Interview Schedule
        </h2>
      {type=='client' &&(
        <div className="d-flex align-items-center">
          <NewInterviewModal 
            onClose={() => {
            setShowCreateMission(false); 
            refetch();
            }}
            onSubmit={(newInterview) => {
  handleAddInterview(newInterview);
  refetch();
}}

          />
        </div>
      )}
      </div>


      <InterviewList
        interviews={filteredInterviews}
        onToggleReminder={handleToggleReminder}
      />
    </div>
  );
};

export default ClientInterviewSchedule;