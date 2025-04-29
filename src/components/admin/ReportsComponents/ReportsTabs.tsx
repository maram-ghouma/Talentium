import React from 'react';

const ReportsTabs = ({ activeTab, setActiveTab }) => (
  <div className="reports-tabs">
    <button 
      className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
      onClick={() => setActiveTab('pending')}
    >
      Pending Reports
    </button>
    <button 
      className={`tab-button ${activeTab === 'resolved' ? 'active' : ''}`}
      onClick={() => setActiveTab('resolved')}
    >
      Resolved Reports
    </button>
  </div>
);

export default ReportsTabs;
