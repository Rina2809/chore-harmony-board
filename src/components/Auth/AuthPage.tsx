
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthPageProps {
  onAuth: (user: { id: string; name: string; email: string }) => void;
}

const AuthPage = ({ onAuth }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (email: string, password: string) => {
    // Simulate authentication
    console.log('Login attempt:', { email, password });
    onAuth({
      id: '1',
      name: 'John Doe',
      email: email
    });
  };

  const handleSignup = (email: string, password: string, name: string) => {
    // Simulate registration
    console.log('Signup attempt:', { email, password, name });
    onAuth({
      id: '1',
      name: name,
      email: email
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Done with Hate</h1>
          <p className="text-gray-600">Chore management built around equity and clarity</p>
        </div>
        
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} onLogin={handleLogin} />
        ) : (
          <SignupForm onToggleMode={() => setIsLogin(true)} onSignup={handleSignup} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
