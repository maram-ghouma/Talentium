import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Shield, XCircle, AlertCircle, RefreshCw, CreditCard } from 'lucide-react';
import './PaymentForm.css';
import { paymentService, PaymentStatusResponse } from '../../services/paymentService';
import { MissionLight } from '../../types';

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

// Payment status indicators
const paymentStatusColors: Record<string, string> = {
  'requires_payment_method': '#f59e0b',
  'requires_confirmation': '#f59e0b',
  'requires_capture': '#10b981',
  'succeeded': '#059669',
  'canceled': '#ef4444',
  'requires_action': '#f59e0b'
};

interface MissionWithPaymentStatus extends MissionLight {
  paymentDetails?: PaymentStatusResponse;
}

const MilestoneView = ({ missions }: { missions: MissionLight[]; }) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [missionsWithStatus, setMissionsWithStatus] = useState<MissionWithPaymentStatus[]>([]);
  const [loadingPaymentStatus, setLoadingPaymentStatus] = useState(false);

  // Load payment status for all missions
  useEffect(() => {
    loadPaymentStatuses();
  }, [missions]);

  const loadPaymentStatuses = async () => {
    setLoadingPaymentStatus(true);
    try {
      const enrichedMissions = await Promise.all(
        missions.map(async (mission) => {
          if (mission.paymentIntentId) {
            try {
              const paymentDetails = await paymentService.getPaymentStatus(mission.paymentIntentId);
              return { ...mission, paymentDetails };
            } catch (error) {
              console.warn(`Failed to get payment status for mission ${mission.id}:`, error);
              return mission;
            }
          }
          return mission;
        })
      );
      setMissionsWithStatus(enrichedMissions);
    } catch (error) {
      console.error('Error loading payment statuses:', error);
      setMissionsWithStatus(missions);
    } finally {
      setLoadingPaymentStatus(false);
    }
  };

  const showMessage = (message: string, isError: boolean = false) => {
    if (isError) {
      setErrorMessage(message);
      setSuccessMessage('');
      setTimeout(() => setErrorMessage(''), 5000);
    } else {
      setSuccessMessage(message);
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleMilestoneRelease = async (missionId: number, percentage: number) => {
    setLoading(true);
    try {
      const response = await paymentService.releaseMilestonePayment(missionId, percentage);
      
      if (response.success) {
        showMessage(`${percentage}% du paiement libéré avec succès! Montant: ${response.amountReleased}€`);
        // Refresh payment statuses
        await loadPaymentStatuses();
      } else {
        showMessage('Erreur lors de la libération du paiement', true);
      }
    } catch (error: any) {
      console.error('Erreur libération jalon:', error);
      const errorMsg = error.message || error.response?.data?.message || 'Erreur lors de la libération du paiement';
      showMessage(errorMsg, true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (missionId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir rembourser cette mission?')) return;
    
    setLoading(true);
    try {
      const response = await paymentService.refundPayment(
        missionId,
        'Demande de remboursement client'
      );

      if (response.success) {
        showMessage(`Remboursement traité avec succès! ID: ${response.refundId}`);
        await loadPaymentStatuses();
      } else {
        showMessage('Erreur lors du remboursement', true);
      }
    } catch (error: any) {
      console.error('Erreur remboursement:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Erreur lors du remboursement';
      showMessage(errorMsg, true);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPaymentSetup = async (missionId: number) => {
    setLoading(true);
    try {
      const response = await paymentService.retryPaymentSetup(missionId);
      if (response.clientSecret) {
        showMessage('Configuration de paiement relancée. Veuillez compléter le checkout.');
        // You might want to redirect to checkout here
        // paymentService.redirectToCheckout(checkoutUrl);
      }
      await loadPaymentStatuses();
    } catch (error: any) {
      console.error('Erreur retry setup:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Erreur lors de la reconfiguration';
      showMessage(errorMsg, true);
    } finally {
      setLoading(false);
    }
  };

  const canReleaseMilestone = (mission: MissionWithPaymentStatus): boolean => {
    if (mission.paymentStatus !== 'ESCROWED') return false;
    if (!mission.paymentDetails) return false;
    return paymentService.isPaymentReadyForRelease(mission.paymentDetails);
  };

  const getPaymentStatusMessage = (mission: MissionWithPaymentStatus): string => {
    if (!mission.paymentDetails) return 'Status inconnu';
    return paymentService.getStatusMessage(mission.paymentDetails.status);
  };

  if (!missions || missions.length === 0) {
    return (
      <div className="view-container">
        <div className="view-header">
          <h2>Gestion des Jalons</h2>
          <p>Aucune mission en escrow trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Gestion des Jalons</h2>
        <p>Libérez les paiements selon l'avancement des projets ({missions.length} mission{missions.length > 1 ? 's' : ''})</p>
        <button 
          onClick={loadPaymentStatuses}
          disabled={loadingPaymentStatus}
          className="refresh-button"
        >
          <RefreshCw className={`icon ${loadingPaymentStatus ? 'spinning' : ''}`} />
          Actualiser les statuts
        </button>
      </div>

      {successMessage && (
        <div className="success-message">
          <CheckCircle className="success-icon" />
          <span className="success-text">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          <AlertCircle className="error-icon" />
          <span className="error-text">{errorMessage}</span>
        </div>
      )}

      <div className="mission-grid">
        {missionsWithStatus.map((mission) => (
          <div key={mission.id} className="mission-card" style={{height: 'auto'}}>
            <div className="mission-header">
              <h3 className="mission-title">{mission.title}</h3>
              <div className={`status-badge ${(statusColors[mission.paymentStatus as keyof typeof statusColors] || statusColors.PENDING).className}`}>
                {statusIcons[mission.paymentStatus as keyof typeof statusIcons] || statusIcons.PENDING}
                <span>{mission.paymentStatus || 'PENDING'}</span>
              </div>
            </div>

            <div className="mission-details">
              <div className="mission-detail">
                <span className="detail-label">Montant total:</span>
                <span>{mission.price}€</span>
              </div>
              <div className="mission-detail">
                <span className="detail-label">Freelancer:</span>
                <span>{mission.selectedFreelancer?.name || 'Non assigné'}</span>
              </div>
              {mission.paymentIntentId && (
                <div className="mission-detail">
                  <span className="detail-label">Payment ID:</span>
                  <span className="payment-id">{mission.paymentIntentId.substring(0, 20)}...</span>
                </div>
              )}
              
              {/* Payment Status Details */}
              {mission.paymentDetails && (
                <div className="payment-status-section">
                  <div className="mission-detail">
                    <span className="detail-label">Status Stripe:</span>
                    <span 
                      className="payment-status"
                      style={{ 
                        color: paymentStatusColors[mission.paymentDetails.status] || '#6b7280',
                        fontWeight: 'bold'
                      }}
                    >
                      {mission.paymentDetails.status}
                    </span>
                  </div>
                  <div className="status-message">
                    {getPaymentStatusMessage(mission)}
                  </div>
                </div>
              )}
            </div>

            {/* Action based on payment status */}
            {mission.paymentDetails?.status === 'requires_payment_method' && (
              <div className="payment-issue-section">
                <div className="warning-message">
                  <AlertCircle className="warning-icon" />
                  <span>Le paiement n'a pas été complété. Le client doit finaliser le checkout.</span>
                </div>
                <button
                  onClick={() => handleRetryPaymentSetup(mission.id)}
                  disabled={loading}
                  className="action-button retry-button"
                >
                  <CreditCard className="icon" />
                  {loading ? 'Traitement...' : 'Relancer le paiement'}
                </button>
              </div>
            )}

            {/* Milestone actions - only show if payment is ready */}
            {canReleaseMilestone(mission) && (
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
                      {loading ? '...' : `${percentage}%`}
                    </button>
                  ))}
                </div>
                
                <div className="action-buttons">
                  <button
                    onClick={() => handleMilestoneRelease(mission.id, 100)}
                    disabled={loading}
                    className="action-button release-button"
                  >
                    {loading ? 'Traitement...' : 'Libérer 100%'}
                  </button>
                  <button
                    onClick={() => handleRefund(mission.id)}
                    disabled={loading}
                    className="action-button refund-button"
                  >
                    {loading ? 'Traitement...' : 'Rembourser'}
                  </button>
                </div>
              </div>
            )}

            {/* Show different actions based on status */}
            {!canReleaseMilestone(mission) && mission.paymentStatus === 'ESCROWED' && (
              <div className="disabled-actions">
                <p className="disabled-message">
                  Paiement non prêt pour libération. Status: {mission.paymentDetails?.status || 'inconnu'}
                </p>
                {['ESCROWED', 'PENDING'].includes(mission.paymentStatus) && (
                  <button
                    onClick={() => handleRefund(mission.id)}
                    disabled={loading}
                    className="action-button refund-button"
                  >
                    {loading ? 'Traitement...' : 'Rembourser'}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneView;