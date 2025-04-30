import React, { useState } from 'react';
import { User } from 'lucide-react';
import Input from './UI/Input';
import Button from './UI/Button';
import './SignInForm.css';

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log('Login attempt with:', { email, password });
  };

  return (
    <div className="sign-in-form-card">
      <div className="sign-in-header">
        <h1>Welcome</h1>
        <div className="logo-container">
          <User size={32} color="var(--navy-primary)" />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
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

        <div className="form-action">
          <Button type="submit">Sign In</Button>
        </div>

        <div className="sign-up-prompt">
          <p>
            Don't have an account? <a href="#">Sign Up</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;