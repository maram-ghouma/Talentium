import React, { useEffect, useState } from 'react';
import PaymentConfirmationView from './PaymentConfirmationView';
import { CreditCard, Shield, CheckCircle } from 'lucide-react';
import './PaymentForm.css';
import { paymentService } from '../../services/paymentService';
import { MissionLight } from '../../types';

const PaymentInterface = () => {
  const [missions, setMissions] = useState<MissionLight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        
        console.log('🔄 Starting to fetch missions...');
        const data = await paymentService.getMissionsByPaymentStatus('PENDING');
        
        console.log('📡 Raw response from paymentService:', data);
        console.log('📊 Response type:', typeof data);
        console.log('📋 Is array?:', Array.isArray(data));
        console.log('📏 Array length:', data?.length);
        
        if (data && Array.isArray(data)) {
          console.log('✅ Setting missions state with:', data);
          setMissions(data);
        } else {
          console.error('❌ Data is not an array:', data);
          setMissions([]);
        }
        
        console.log('🏁 Finished setting missions');
        
      } catch (err) {
        console.error('💥 Error loading missions:', err);
        setError(`Error loading missions: ${err}`);
      } finally {
        setLoading(false);
        console.log('🔚 Loading set to false');
      }
    };

    fetchMissions();
  }, []);

  // Add a separate useEffect to log when missions state changes
  useEffect(() => {
    console.log('🔄 Missions state changed:', missions);
    console.log('📏 Current missions length:', missions.length);
  }, [missions]);

  console.log('🎨 Rendering PaymentInterface with missions:', missions);

  if (loading) {
    console.log('⏳ Showing loading state');
    return <p>Loading...</p>;
  }
  
  if (error) {
    console.log('❌ Showing error state:', error);
    return <p>Error loading missions: {error}</p>;
  }

  return (
    <div className="payment-interface">
      <div className="payment-container">
        <div className="header">
          <h1>Système de Paiement Sécurisé</h1>
          <p>Gestion des paiements en escrow pour vos missions</p>
        </div>

        {/* Debug section 
        <div style={{ 
          backgroundColor: '#f0f8ff', 
          padding: '15px', 
          margin: '10px 0', 
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}>
          <h3>🔍 Debug Info:</h3>
          <p><strong>Missions count:</strong> {missions.length}</p>
          <p><strong>Loading:</strong> {loading.toString()}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
          <details>
            <summary>Full missions data</summary>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(missions, null, 2)}
            </pre>
          </details>
        </div>*/}

        <PaymentConfirmationView missions={missions} />

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

export default PaymentInterface;