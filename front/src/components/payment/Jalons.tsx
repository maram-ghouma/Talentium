import React, { useState } from 'react';
import MilestoneView from './MilestoneView';
import { CreditCard, Shield, CheckCircle } from 'lucide-react';
import './PaymentForm.css';

// Mock API function
const apiCall = async (endpoint, data) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`API Call to ${endpoint}:`, data);
  return { success: true, data };
};

const Jalons = () => {
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

  return (
    <div className="payment-interface">
      <div className="payment-container">
        <div className="header">
          <h1>Système de Paiement Sécurisé</h1>
          <p>Gestion des paiements en escrow pour vos missions</p>
        </div>

        {/*<div className="tab-container">
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
        </div>*/}

       {/*} {currentView === 'create' && (
          <CreatePaymentView 
            missions={missions.filter(m => m.paymentStatus === 'PENDING')}
            apiCall={apiCall}
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
            apiCall={apiCall}
          />
        )}*/}
         <MilestoneView 
            missions={missions.filter(m => m.paymentStatus === 'ESCROWED')}
            apiCall={apiCall}
          />

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

export default Jalons;