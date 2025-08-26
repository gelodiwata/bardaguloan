import React, { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToAuthChanges, getCurrentUser, reloadUserProfile } from '../lib/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set initial user state
    setCurrentUser(getCurrentUser());
    setLoading(false);

    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      if (user) {
        // Reload user profile to ensure displayName is updated
        const refreshedUser = await reloadUserProfile();
        setCurrentUser(refreshedUser || user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};