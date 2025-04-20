import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import InterviewList from '../../components/client/inteviews/InterviewList';
import NewInterviewModal from '../../components/client/inteviews/NewINterviewModal';
import { Interview } from '../../types';
import '../../Styles/client/Interviews.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import { Sun, Moon } from 'lucide-react';

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

const ClientInterviewSchedule = () => {
  const [showCreateMission, setShowCreateMission] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

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
    <MainLayout
      isDarkMode={isDarkMode}
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      onSearch={handleSearch}
      usertype="client"
      profileName="Alex Morgan"
      profileRole="UI/UX Designer"
    >
      <div className="container py-4">
        <div className="interview-header d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: isDarkMode ? 'var(--slate)' : '' }}>
          Client Interview Schedule
        </h2>

          <div className="d-flex align-items-center">
            <NewInterviewModal onClose={() => setShowCreateMission(false)} onSubmit={handleAddInterview} />
          </div>
        </div>

        <InterviewList
          interviews={interviews}
          onToggleReminder={handleToggleReminder}
        />
      </div>
    </MainLayout>
  );
};

export default ClientInterviewSchedule;
