import React from 'react';
import { UserX, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return <Clock size={20} className="status-icon pending" />;
    case 'resolved':
      return <CheckCircle size={20} className="status-icon resolved" />;
    default:
      return <AlertTriangle size={20} className="status-icon" />;
  }
};

const ReportCard = ({ report }) => (
  <div className="report-card">
    <div className="report-header">
      <div className="report-user-info">
        <UserX size={24} />
        <div>
          <h3>{report.reportedUser}</h3>
          <span className={`user-type ${report.type}`}>
            {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
          </span>
        </div>
      </div>
      {getStatusIcon(report.status)}
    </div>
    
    <div className="report-details">
      <p><strong>Reported by:</strong> {report.reportedBy}</p>
      <p><strong>Reason:</strong> {report.reason}</p>
      <p><strong>Date:</strong> {report.date}</p>
      <p><strong>Details:</strong> {report.details}</p>
      {'resolution' in report && (
        <p><strong>Resolution:</strong> {report.resolution}</p>
      )}
    </div>

    {report.status === 'pending' && (
      <div className="report-actions">
        <button className="action-button warn">Check Profile</button>
        <button className="action-button suspend">Suspend Account</button>
        <button className="action-button resolve">Mark Resolved</button>
      </div>
    )}
  </div>
);

export default ReportCard;
