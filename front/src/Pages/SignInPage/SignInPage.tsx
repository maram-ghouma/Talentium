import React from 'react';
import SignInForm from '../../components/SignIn/SignInForm';
import './SignInPage.css';

const SignInPage: React.FC = () => {
  return (
    <div className="sign-in-page">
      <div className="sign-in-container">
        <SignInForm />
      </div>
    </div>
  );
};

export default SignInPage;