import React, { useState } from 'react';
import { User } from 'lucide-react';
import Input from './UI/Input';
import Button from './UI/Button';
import './SignInForm.css';
import { loginUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser({ email, password });
      if (response.accessToken) {
        localStorage.setItem('authToken', response.accessToken);
        console.log('Login successful:', response); // Debug response
        console.log('Stored authToken:', localStorage.getItem('authToken')); // Debug token
        const role = response.user?.currentRole;

        // Redirect based on role
        if (role === 'freelancer') {
          navigate('/freelancer');
        } else if (role === 'client') {
          navigate('/client');
        } else if (role === 'admin') {
          navigate('/admin');
        } else {
          console.log('Unknown role:', role); // Debug
          setError('Invalid user role');
          localStorage.removeItem('authToken'); // Clear invalid token
          navigate('/signin'); // Stay on signin
        }
      } else {
        setError('Login failed: No token received');
      }
    } catch (err: any) {
      console.error('Login error:', err); // Debug
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
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

        {error && <p className="error-message">{error}</p>}

        <div className="form-action">
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
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