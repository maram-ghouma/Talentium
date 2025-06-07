import React from 'react';
import ReportCard from './ReportCard';

const ReportsList = ({ reports , activeTab}) => (
  <div className="reports-list">
    {reports.length === 0 ? (
      <p className="no-reports-message" style={{
        textAlign: 'center',
        marginTop: '2rem',
        fontSize: '1.2rem',
        color: '#666'
      }}>No pending reports</p>
    ) : (
      reports.map((report) => (
        <ReportCard key={report.id} report={report} activeTab={activeTab} />
      ))
    )}
  </div>
);

export default ReportsList;
