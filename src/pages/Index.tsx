
import React, { useState } from 'react';
import AuthPage from '@/components/Auth/AuthPage';
import Dashboard from '@/components/Dashboard/Dashboard';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleAuth = (userData: { id: string; name: string; email: string }) => {
    setUser({
      ...userData,
      avatar: '',
      bio: '',
      phone: '',
      location: ''
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <AuthPage onAuth={handleAuth} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
};

export default Index;
