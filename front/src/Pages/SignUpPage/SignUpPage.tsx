import React from 'react';
import SignUpForm from '../../components/SignUp/SignUpForm';
import './SignUpPage.css';

const SignUpPage: React.FC = () => {
  return (
    <div className="sign-up-page">
      <div className="sign-up-container">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;