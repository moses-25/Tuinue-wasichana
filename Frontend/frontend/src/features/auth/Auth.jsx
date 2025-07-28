import { useState } from 'react';
import LoginForm from './Login';
import RegisterForm from './Register';
import './Login.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <LoginForm onToggleAuth={toggleAuthMode} />
      ) : (
        <RegisterForm onToggleAuth={toggleAuthMode} />
      )}
    </div>
  );
};

export default AuthForm;