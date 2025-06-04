import { useState, useEffect } from 'react';
import InterviewList from './InterviewList';
import NewInterviewModal from './NewINterviewModal';
import { Interview } from '../../../types';
import '../../../Styles/client/Interviews.css';

const initialInterviews: Interview[] = [
  {
    id: '1',
    candidateName: 'John Smith',
    topic: 'Front-end Development',
    scheduledDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), 
    remindMe: true,
  },
  {
    id: '2',
    candidateName: 'Emily Johnson',
    topic: 'UX Design Discussion',
    scheduledDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), 
    remindMe: false,
  },
  {
    id: '3',
    candidateName: 'Michael Brown',
    topic: 'Project Management',
    scheduledDateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), 
    remindMe: true,
  },
];

const ClientInterviewSchedule = ({ isDarkMode }) => {
  const [showCreateMission, setShowCreateMission] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);

  const handleToggleReminder = (id: string) => {
    setInterviews((prev) =>
      prev.map((interview) =>
        interview.id === id
          ? { ...interview, remindMe: !interview.remindMe }
          : interview
      )
    );
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

        <div className="d-flex align-items-center">
          <NewInterviewModal 
            onClose={() => setShowCreateMission(false)} 
            onSubmit={handleAddInterview} 
          />
        </div>
      </div>

      <InterviewList
        interviews={interviews}
        onToggleReminder={handleToggleReminder}
      />
    </div>
  );
};

export default ClientInterviewSchedule;