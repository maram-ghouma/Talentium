import { useState, useEffect } from 'react';
import InterviewList from './InterviewList';
import NewInterviewModal from './NewINterviewModal';
import { Interview } from '../../../types';
import '../../../Styles/client/Interviews.css';
import { useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { GET_INTERVIEWS, REMIND_ME_MUTATION } from '../../../graphql/interviews';


const ClientInterviewSchedule = ({ isDarkMode }) => {

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
    const { data, loading, error } = useQuery(GET_INTERVIEWS, {
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


const [remindMeMutation] = useMutation(REMIND_ME_MUTATION);

const handleToggleReminder = async (id: string) => {
  try {
    const { data } = await remindMeMutation({ variables: { interviewId: id } });
  } catch (error) {
    console.error('Failed to toggle remindMe', error);
  }
};

  const handleAddInterview = (newInterview: Omit<Interview, 'id'>) => {
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
            onClose={() => setShowCreateMission(false)} 
            onSubmit={handleAddInterview} 
          />
        </div>
      )}
      </div>


      <InterviewList
        interviews={interviews}
        onToggleReminder={handleToggleReminder}
      />
    </div>
  );
};

export default ClientInterviewSchedule;