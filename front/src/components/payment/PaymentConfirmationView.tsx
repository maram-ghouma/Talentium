import React, { use, useEffect, useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import './PaymentForm.css';
import { MissionLight } from '../../types';
import { paymentService } from '../../services/paymentService';
import { getClientName, getUser } from '../../services/userService';

type PaymentStatus = { type: 'success' | 'error'; message: string } | null;

const PaymentConfirmationView = ({ missions }: { missions: MissionLight[]; }) => {
  const [selectedMission, setSelectedMission] = useState<MissionLight | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyName = async () => {
      const name = await getClientName();
      setCompanyName(name);
    };

    fetchCompanyName();
  }
  , []);

  useEffect(() => {
    const fetchClientId = async () => {
      const id = await getUser().then(user => user.id);
      setClientId(id);
    };

    fetchClientId();
  }, []);

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const handleCardInputChange = (field: string, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedMission) return;

    setLoading(true);
    
    try {
      const escrowResponse = await paymentService.createEscrowPayment(
        Number(selectedMission.id),
        Number(clientId)
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      setPaymentStatus({
        type: 'success',
        message: 'Paiement autorisé et mis en escrow avec succès!'
      });
      
    } catch (error) {
      setPaymentStatus({ 
        type: 'error', 
        message: 'Erreur lors du paiement: ' + (error && typeof error === 'object' && 'message' in error ? (error as any).message : String(error))
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <div className="view-header">
        <h2>Confirmer le Paiement</h2>
        <p>Finalisez votre paiement sécurisé</p>
      </div>

      <div className="form-card">
        {!selectedMission ? (
          <div className="mission-selection">
            <h3 className="form-label">Sélectionnez une mission</h3>
            {missions.map((mission) => (
              <div 
                key={mission.id}
                onClick={() => setSelectedMission(mission)}
                className="mission-selector"
              >
                <div className="mission-info">
                  <h4>{mission.title}</h4>
                  <p>Client: {companyName}</p>
                </div>
                <span className="mission-price">{mission.price}€</span>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="payment-form-content">
            <div className="selected-mission">
              <h3>{selectedMission.title}</h3>
              <div className="mission-amount">
                <span>Montant à payer</span>
                <span>{selectedMission.price}€</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Informations de paiement</label>
              <div className="form-grid">
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Nom sur la carte"
                    value={cardDetails.name}
                    onChange={(e) => handleCardInputChange('name', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => handleCardInputChange('number', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="CVC"
                    value={cardDetails.cvc}
                    onChange={(e) => handleCardInputChange('cvc', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>

            {paymentStatus && (
              <div className={`payment-status ${paymentStatus.type}`}>
                {paymentStatus.type === 'success' ? (
                  <CheckCircle className="status-icon" />
                ) : (
                  <AlertCircle className="status-icon" />
                )}
                {paymentStatus.message}
              </div>
            )}

            <div className="action-buttons">
              <button
                type="button"
                onClick={() => setSelectedMission(null)}
                className="action-button back-button"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={loading}
                className="action-button button-primary"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Traitement...
                  </>
                ) : (
                  'Payer maintenant'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentConfirmationView;