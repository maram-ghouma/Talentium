import React, { useEffect, useState } from 'react';
import ReportsHeader from '../../components/admin/ReportsComponents/ReportsHeader';
import ReportsTabs from '../../components/admin/ReportsComponents/ReportsTabs';
import ReportsList from '../../components/admin/ReportsComponents/ReportsList';
import '../../Styles/admin/reports.css';
import { MainLayout } from '../../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { getDisputeStats, getOpenDisputesWithProfiles } from '../../services/adminService';
import { report } from 'process';

const ReportsInterface = () => {
  const [activeTab, setActiveTab] = useState('pending');

  /*const pendingReports = [
    {
      id: 1,
      reportedUser: 'John Smith',
      reportedBy: 'Client Corp Ltd',
      reason: 'Unprofessional conduct',
      date: '2024-03-15',
      type: 'freelancer',
      status: 'pending',
      details: 'Failed to communicate project delays and missed multiple deadlines.'
    },
    {
      id: 2,
      reportedUser: 'Tech Solutions Inc',
      reportedBy: 'Sarah Wilson',
      reason: 'Payment dispute',
      date: '2024-03-14',
      type: 'client',
      status: 'pending',
      details: 'Client refusing to pay for completed work citing unreasonable demands.'
    },
    {
      id: 3,
      reportedUser: 'Alice Cooper',
      reportedBy: 'Digital Agency X',
      reason: 'Quality concerns',
      date: '2024-03-13',
      type: 'freelancer',
      status: 'pending',
      details: 'Delivered work does not match the promised quality standards.'
    }
  ];*/

  const resolvedReports = [
    {
      id: 4,
      reportedUser: 'Mark Johnson',
      reportedBy: 'WebDev Solutions',
      reason: 'Contract violation',
      date: '2024-03-10',
      type: 'client',
      status: 'resolved',
      resolution: 'Warning issued to client',
      details: 'Changed project scope without proper communication.'
    }
  ];
  const transformReportData = (data: any[]) => {
  return data.map(item => {
    const { mission, openedBy, reason, status, openedAt, resolution } = item;

    // Determine reportedUser based on openedBy role
    let reportedUser = '';
    let reportedUserId = '';
    let type = '';
    if (openedBy.id === mission.client?.user.id) {
      reportedUser = mission.selectedFreelancer?.user?.username || 'Unknown Freelancer';
      type = 'freelancer';      
      reportedUserId = mission.selectedFreelancer?.user.id || 'Unknown Freelancer ID';
    } else {
      reportedUser = mission.client?.user?.username || 'Unknown Client';
      reportedUserId = mission.client?.user.id || 'Unknown Client ID';
      type = 'client';

    }

    // reportedBy is the person who opened the report
    const reportedBy = openedBy.username || 'Unknown Reporter';

    const date = new Date(openedAt).toLocaleDateString();



    const details = mission.description || 'No details provided';

    return {
      id: item.id,
      reportedUser,
      reportedUserId,
      reportedBy,
      reason,
      date,
      type,
      status,
      details,
      resolution,
    };
  });
};


  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDisputeStats();
        setStats(data);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          navigate('/404', { replace: true });
          return;
        }
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

  }, []);
  const [PendingReports, setPendingReports] = useState<any[]>([]);
  useEffect(() => {
    const fetchPendingReports = async () => {
      try {
        const data = await getOpenDisputesWithProfiles();
        const transformed = transformReportData(data);
        setPendingReports(transformed);
        console.log("Transformed Pending Reports:", transformed);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          navigate('/404', { replace: true });
          return;
        }
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingReports();

  }, []);
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };
  return (
    <MainLayout
      isDarkMode={isDarkMode}
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      onSearch={handleSearch}
      usertype='admin'
    
    >
        <div className="reports-container">
      <ReportsHeader 
        pendingCount={stats?.inReview}
        resolvedCount={stats?.resolved}
        totalCount={stats?.total}
      />
      <ReportsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ReportsList 
        reports={activeTab === 'pending' ? PendingReports : resolvedReports} activeTab={activeTab} 
      />
    </div>
      
    </MainLayout>
   
    
  );
};

export default ReportsInterface;
