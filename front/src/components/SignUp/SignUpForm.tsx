import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import Input from '../SignIn/UI/Input';
import Button from '../SignIn/UI/Button';
import './SignUpForm.css';
import { registerUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const SignUpForm: React.FC = () => {
    const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      const data = {
        username,
        email,
        password,
        phoneNumber,
        country,
      };

      await registerUser(data);
      navigate('/signin'); 
      setSuccess(true);
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPhoneNumber('');
      setCountry('');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed, please try again.');
      }
    } finally {
      setLoading(false);
    }
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
            label="userName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your first name"
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
            type="text"
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </div>
          <div className="form-group">
          <Input
            type="text"
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter your country"
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
            Already have an account? <a href="signin">Sign In</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;