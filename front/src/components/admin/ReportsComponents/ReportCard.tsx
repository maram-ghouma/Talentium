import React, { useState } from 'react';
import { UserX, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { deleteUserAndProfiles, updateDisputeResolution } from '../../../services/adminService';

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

const ReportCard = ({ report, activeTab }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [resolutionText, setResolutionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckProfile = () => {
    navigate(`/${report.type}/profile/${report.reportedUserId}`);
  };

  const handleSuspendAccount = async (userId) => {
    try {
      const confirm = window.confirm('Are you sure you want to suspend this account?');
      if (!confirm) return;

      await deleteUserAndProfiles(userId, report.id);
      alert('Account suspended successfully');
      window.location.reload();
    } catch (error) {
      console.error('Failed to suspend account:', error);
      alert('An error occurred while suspending the account.');
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setResolutionText('');
  };

  const handleSubmitResolution = async () => {
    if (!resolutionText.trim()) {
      alert('Please enter a resolution');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateDisputeResolution(report.id, resolutionText);
      alert('Resolution submitted successfully');
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error('Failed to submit resolution:', error);
      alert('Error submitting resolution');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
          <p><strong>Resolution:</strong> {report.resolution || 'No resolution yet'}</p>
        )}
      </div>

      {activeTab === 'pending' && (
        <div className="report-actions">
          <button className="action-button warn" onClick={handleCheckProfile}>
            Check Profile
          </button>
          <button className="action-button suspend" onClick={() => handleSuspendAccount(report.reportedUserId)}>
            Suspend Account
          </button>
          <button className="action-button resolve" onClick={handleOpenModal}>
            Mark Resolved
          </button>
        </div>
      )}

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '8px',
              minWidth: '400px',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              borderBottom: '1px solid #eee'
            }}>
              <h3 style={{ margin: 0 }}>Enter Resolution</h3>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <textarea
                rows={4}
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="Write resolution details here..."
                style={{
                  width: '100%',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '10px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              padding: '20px',
              borderTop: '1px solid #eee'
            }}>
              <button
                onClick={handleSubmitResolution}
                disabled={isSubmitting}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontWeight: 500,
                  backgroundColor: isSubmitting ? '#6c757d' : '#28a745',
                  color: 'white'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                  backgroundColor: '#6c757d',
                  color: 'white'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportCard;
