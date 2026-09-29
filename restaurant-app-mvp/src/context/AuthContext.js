import React, { createContext, useContext, useState } from 'react';
import users from '../data/users';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setAuthLoading(true);
      setAuthError('');
      setTimeout(() => {
        const user = users.find(
          (u) => u.email === email.trim().toLowerCase() && u.password === password
        );
        setAuthLoading(false);
        if (user) {
          setCurrentUser(user);
          resolve(user);
        } else {
          const err = 'Invalid email or password.';
          setAuthError(err);
          reject(new Error(err));
        }
      }, 1000);
    });
  };

  const signup = (name, email, password) => {
    return new Promise((resolve, reject) => {
      setAuthLoading(true);
      setAuthError('');
      setTimeout(() => {
        const exists = users.find((u) => u.email === email.trim().toLowerCase());
        setAuthLoading(false);
        if (exists) {
          const err = 'An account with this email already exists.';
          setAuthError(err);
          reject(new Error(err));
        } else {
          const newUser = {
            id: `u${Date.now()}`,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role: 'customer',
          };
          users.push(newUser);
          setCurrentUser(newUser);
          resolve(newUser);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthError('');
  };

  return (
    <AuthContext.Provider value={{ currentUser, authLoading, authError, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
