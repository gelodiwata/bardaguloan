import React, { useState } from 'react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="flex items-center justify-center z-100">
      <div className="max-w-md w-full mx-4">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="flex justify-center mb-4">
          <div className="tabs tabs-boxed">
            <button
              className={`tab ${isLogin ? 'tab-active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`tab ${!isLogin ? 'tab-active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>
        </div>

        {isLogin ? (
          <LoginForm onSuccess={onClose} />
        ) : (
          <RegisterForm onSuccess={onClose} />
        )}
      </div>
    </div>
  );
}