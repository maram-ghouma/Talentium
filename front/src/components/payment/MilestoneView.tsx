import React, { useState } from 'react';
import { CheckCircle, Clock, Shield, XCircle } from 'lucide-react';
import './PaymentForm.css';

const statusColors = {
  PENDING: { className: 'status-pending' },
  ESCROWED: { className: 'status-escrowed' },
  RELEASED: { className: 'status-released' },
  REFUNDED: { className: 'status-refunded' }
};

const statusIcons = {
  PENDING: <Clock className="icon" />,
  ESCROWED: <Shield className="icon" />,
  RELEASED: <CheckCircle className="icon" />,
  REFUNDED: <XCircle className="icon" />
};

const MilestoneView = ({ missions, apiCall }) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleMilestoneRelease = async (missionId, percentage) => {
    setLoading(true);
    try {
      const response = await apiCall('/api/payment/release-milestone', {
        missionId,
        milestonePercentage: percentage
      });
      
      setSuccessMessage(`${percentage}% du paiement libéré avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erreur libération jalon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (missionId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir rembourser cette mission?')) return;
    
    setLoading(true);
    try {
      await apiCall('/api/payment/refund', {
        missionId,
        reason: 'Demande de remboursement client'
      });
      
      setSuccessMessage('Remboursement traité avec succès!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erreur remboursement:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Gestion des Jalons</h2>
        <p>Libérez les paiements selon l'avancement des projets</p>
      </div>

      {successMessage && (
        <div className="success-message">
          <CheckCircle className="success-icon" />
          <span className="success-text">{successMessage}</span>
        </div>
      )}

      <div className="mission-grid">
        {missions.map((mission) => (
          <div key={mission.id} className="mission-card" style={{height: 'auto'}}>
            <div className="mission-header">
              <h3 className="mission-title">{mission.title}</h3>
              <div className={`status-badge ${statusColors[mission.paymentStatus].className}`}>
                {statusIcons[mission.paymentStatus]}
                <span>{mission.paymentStatus}</span>
              </div>
            </div>

            <div className="mission-details">
              <div className="mission-detail">
                <span className="detail-label">Montant total:</span>
                <span>{mission.price}€</span>
              </div>
              <div className="mission-detail">
                <span className="detail-label">Freelancer:</span>
                <span>{mission.selectedFreelancer.name}</span>
              </div>
            </div>

            <div className="milestone-actions">
              <h4>Libérer par jalons:</h4>
              <div className="milestone-grid">
                {[25, 50, 75].map((percentage) => (
                  <button
                    key={percentage}
                    onClick={() => handleMilestoneRelease(mission.id, percentage)}
                    disabled={loading}
                    className="milestone-button"
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
              
              <div className="action-buttons">
                <button
                  onClick={() => handleMilestoneRelease(mission.id, 100)}
                  disabled={loading}
                  className="action-button release-button"
                >
                  Libérer 100%
                </button>
                <button
                  onClick={() => handleRefund(mission.id)}
                  disabled={loading}
                  className="action-button refund-button"
                >
                  Rembourser
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneView;