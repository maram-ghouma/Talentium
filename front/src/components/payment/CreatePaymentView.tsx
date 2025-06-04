import React, { useState } from 'react';
import { CheckCircle, Shield } from 'lucide-react';
import './PaymentForm.css';

const CreatePaymentView = ({ missions, apiCall }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleCreateEscrow = async (mission) => {
    setLoading(true);
    try {
      const response = await apiCall('/api/payment/create-escrow', {
        missionId: mission.id,
        clientId: mission.client.id
      });
      
      setSuccess(mission.title);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Erreur création escrow:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Créer un Paiement Escrow</h2>
        <p>Sélectionnez une mission pour créer un paiement sécurisé</p>
      </div>

      {success && (
        <div className="success-message">
          <CheckCircle className="success-icon" />
          <span className="success-text">Paiement escrow créé avec succès pour "{success}"</span>
        </div>
      )}

      <div className="mission-grid">
        {missions.map((mission) => (
          <div key={mission.id} className="mission-card">
            <div className="mission-header">
              <h3 className="mission-title">{mission.title}</h3>
              <span className="mission-price">{mission.price}€</span>
            </div>
            
            <div className="mission-details">
              <div className="mission-detail">
                <span className="detail-label">Client:</span>
                {mission.client.name}
              </div>
              <div className="mission-detail">
                <span className="detail-label">Freelancer:</span>
                {mission.selectedFreelancer.name}
              </div>
            </div>

            <button
              onClick={() => handleCreateEscrow(mission)}
              disabled={loading}
              className="button-primary"
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Création en cours...
                </>
              ) : (
                <>
                  <Shield className="button-icon" />
                  Créer Paiement Escrow
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatePaymentView;