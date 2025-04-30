import React from 'react';
import ReportCard from './ReportCard';

const ReportsList = ({ reports }) => (
  <div className="reports-list">
    {reports.map((report) => (
      <ReportCard key={report.id} report={report} />
    ))}
  </div>
);

export default ReportsList;
