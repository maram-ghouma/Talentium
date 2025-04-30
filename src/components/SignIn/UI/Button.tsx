import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className="custom-button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;