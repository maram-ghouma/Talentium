import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import Input from '../SignIn/UI/Input';
import Button from '../SignIn/UI/Button';
import './SignUpForm.css';

const SignUpForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log('Sign up attempt with:', { firstName, lastName, email, password, confirmPassword });
  };

  return (
    <div className="sign-up-form-card">
      <div className="sign-up-header">
        <h1>Create Account</h1>
        <div className="logo-container">
          <UserPlus size={32} color="var(--navy-primary)" />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <Input
            type="text"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
            required
          />
        </div>

        <div className="form-group">
          <Input
            type="text"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your last name"
            required
          />
        </div>

        <div className="form-group">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="form-group">
          <Input
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>

        <div className="form-action">
          <Button type="submit">Sign Up</Button>
        </div>

        <div className="sign-in-prompt">
          <p>
            Already have an account? <a href="#">Sign In</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;