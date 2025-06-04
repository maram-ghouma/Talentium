import React, { useState } from 'react';
import ReportsHeader from '../../components/admin/ReportsComponents/ReportsHeader';
import ReportsTabs from '../../components/admin/ReportsComponents/ReportsTabs';
import ReportsList from '../../components/admin/ReportsComponents/ReportsList';
import '../../Styles/admin/reports.css';
import { MainLayout } from '../../components/layout/MainLayout';

const ReportsInterface = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const pendingReports = [
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
  ];

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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
      profileName = "Admin"
      profileRole = ""
    >
        <div className="reports-container">
      <ReportsHeader 
        pendingCount={pendingReports.length}
        resolvedCount={resolvedReports.length}
        totalCount={pendingReports.length + resolvedReports.length}
      />
      <ReportsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ReportsList 
        reports={activeTab === 'pending' ? pendingReports : resolvedReports} 
      />
    </div>
      
    </MainLayout>
   
    
  );
};

export default ReportsInterface;
