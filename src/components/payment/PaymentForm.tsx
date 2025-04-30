import React, { useState } from 'react';
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

export default PaymentForm;