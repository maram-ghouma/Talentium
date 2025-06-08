import React, { useEffect, useState } from 'react';
import ReportsHeader from '../../components/admin/ReportsComponents/ReportsHeader';
import ReportsTabs from '../../components/admin/ReportsComponents/ReportsTabs';
import ReportsList from '../../components/admin/ReportsComponents/ReportsList';
import '../../Styles/admin/reports.css';
import { MainLayout } from '../../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { getDisputeStats, getOpenDisputesWithProfiles, getResolvedDisputesWithProfiles } from '../../services/adminService';
import { report } from 'process';

const ReportsInterface = () => {
  const [activeTab, setActiveTab] = useState('pending');
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
  const [ResolvedReports, setResolvedReports] = useState<any[]>([]);
  useEffect(() => {
    const fetchResolvedReports = async () => {
      try {
        const data = await getResolvedDisputesWithProfiles();
        const transformed = transformReportData(data);
        setResolvedReports(transformed);
        console.log("Transformed Resolved Reports:", transformed);
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

    fetchResolvedReports();

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
        reports={activeTab === 'pending' ? PendingReports : ResolvedReports} activeTab={activeTab} 
      />
    </div>
      
    </MainLayout>
   
    
  );
};

export default ReportsInterface;
