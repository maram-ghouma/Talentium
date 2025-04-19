import React from 'react';
import { Shield, Flag, Clock, CheckCircle } from 'lucide-react';

const ReportsHeader = ({ totalCount, pendingCount, resolvedCount }) => (
  <div className="reports-header">
    <h1>
      <Shield size={32} />
      Reports Management
    </h1>
    <div className="reports-summary">
      <div className="summary-card">
        <Flag size={24} />
        <div>
          <h3>Total Reports</h3>
          <p>{totalCount}</p>
        </div>
      </div>
      <div className="summary-card">
        <Clock size={24} />
        <div>
          <h3>Pending</h3>
          <p>{pendingCount}</p>
        </div>
      </div>
      <div className="summary-card">
        <CheckCircle size={24} />
        <div>
          <h3>Resolved</h3>
          <p>{resolvedCount}</p>
        </div>
      </div>
    </div>
  </div>
);

export default ReportsHeader;
