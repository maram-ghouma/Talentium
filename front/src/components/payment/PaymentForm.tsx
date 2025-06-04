/*import React, { useState } from 'react';
import { CreditCard, User } from 'lucide-react';
import Input from '../SignIn/UI/Input';
import Button from '../SignIn/UI/Button';
import './PaymentForm.css';

const PaymentForm: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Payment attempt with:', { cardNumber, expirationDate, cvc, nameOnCard });
  };

  return (
    <div className="payment-page">
      <div className="freelancer-section">
        <div className="freelancer-content">
          <div className="profile-image">
            <User size={40} color="var(--navy-primary)" />
          </div>
          <div className="freelancer-info">
            <h2>John Doe</h2>
            <p>Expert web developer with 5+ years of experience in creating responsive and user-friendly applications.</p>
          </div>
        </div>
      </div>

      <div className="payment-section">
        <div className="payment-form-card">
          <div className="payment-header">
            <h1>Payment Information</h1>
            <div className="logo-container">
              <CreditCard size={32} color="var(--navy-primary)" />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <Input
                type="text"
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <Input
                  type="text"
                  label="Expiration Date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  placeholder="MM/YY"
                  required
                />
              </div>

              <div className="form-group">
                <Input
                  type="text"
                  label="CVC"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <Input
                type="text"
                label="Name on Card"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-action">
              <Button type="submit">Pay Now</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;*/
import './PaymentForm.css';
import React, { useState } from 'react';
import { 
  CreditCard, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';

// Mock API function
const apiCall = async (endpoint, data) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`API Call to ${endpoint}:`, data);
  return { success: true, data };
};

const PaymentInterface = () => {
  const [currentView, setCurrentView] = useState('create');
  const [missions] = useState([
    {
      id: 1,
      title: "Développement Site Web E-commerce",
      price: 2500,
      client: { name: "Marie Dubois" },
      selectedFreelancer: { name: "Jean Developer" },
      paymentStatus: "PENDING"
    },
    {
      id: 2,
      title: "Design Application Mobile",
      price: 1800,
      client: { name: "Pierre Martin" },
      selectedFreelancer: { name: "Sophie Designer" },
      paymentStatus: "ESCROWED"
    }
  ]);

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

  return (
    <div className="payment-interface">
      <div className="payment-container">
        <div className="header">
          <h1>Système de Paiement Sécurisé</h1>
          <p>Gestion des paiements en escrow pour vos missions</p>
        </div>

        <div className="tab-container">
          <div className="tab-wrapper">
            <div className="tab-buttons">
              <button
                onClick={() => setCurrentView('create')}
                className={`tab-button ${currentView === 'create' ? 'active tab-create' : ''}`}
              >
                Créer Paiement
              </button>
              <button
                onClick={() => setCurrentView('confirm')}
                className={`tab-button ${currentView === 'confirm' ? 'active tab-confirm' : ''}`}
              >
                Confirmer Paiement
              </button>
              <button
                onClick={() => setCurrentView('milestones')}
                className={`tab-button ${currentView === 'milestones' ? 'active tab-milestones' : ''}`}
              >
                Jalons
              </button>
            </div>
          </div>
        </div>

        {currentView === 'create' && (
          <CreatePaymentView 
            missions={missions.filter(m => m.paymentStatus === 'PENDING')}
          />
        )}

        {currentView === 'confirm' && (
          <PaymentConfirmationView 
            missions={missions.filter(m => m.paymentStatus === 'PENDING')}
            apiCall={apiCall}
          />
        )}

        {currentView === 'milestones' && (
          <MilestoneView 
            missions={missions.filter(m => m.paymentStatus === 'ESCROWED')}
            statusColors={statusColors}
            statusIcons={statusIcons}
          />
        )}

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-header">
              <Shield className="feature-icon" />
              <h3>Sécurité Escrow</h3>
            </div>
            <p className="feature-content">
              Vos paiements sont sécurisés en escrow jusqu'à la validation des livrables.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <CreditCard className="feature-icon" />
              <h3>Paiements Sécurisés</h3>
            </div>
            <p className="feature-content">
              Intégration Stripe pour des transactions sécurisées et conformes.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <CheckCircle className="feature-icon" />
              <h3>Jalons Flexibles</h3>
            </div>
            <p className="feature-content">
              Libération progressive des paiements selon l'avancement du projet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// CreatePaymentView component
const CreatePaymentView = ({ missions }) => {
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

      <div className="mission-grid" >
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

// PaymentConfirmationView component
type PaymentStatus = { type: 'success' | 'error'; message: string } | null;

type Mission = {
  id: number;
  title: string;
  price: number;
  client: { name: string; id?: number };
  selectedFreelancer: { name: string };
  paymentStatus: string;
};

const PaymentConfirmationView = ({ missions, apiCall }: { missions: Mission[]; apiCall: any }) => {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const handleCardInputChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedMission) return;

    setLoading(true);
    
    try {
      const escrowResponse = await apiCall('/api/payment/create-escrow', {
        missionId: selectedMission.id,
        clientId: selectedMission.client.id
      });
      
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
                  <p>Client: {mission.client.name}</p>
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

// MilestoneView component
const MilestoneView = ({ missions, statusColors, statusIcons }) => {
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
          <div key={mission.id} className="mission-card">
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

export default PaymentInterface;