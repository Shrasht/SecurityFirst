import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      if (user) {
        setCurrentUser(JSON.parse(user));
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      if (email && password) {
        const user = {
          id: 'user123',
          name: 'Jane Doe',
          email,
          profilePic: 'https://i.pravatar.cc/150?img=1',
          emergencyContacts: [
            { id: 1, name: 'Mom', phone: '123-456-7890' },
            { id: 2, name: 'Dad', phone: '098-765-4321' }
          ]
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthenticated(true);
        setError(null);
        return user;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful registration
      if (userData.email && userData.password) {
        const user = {
          id: 'user' + Date.now(),
          name: userData.name || 'New User',
          email: userData.email,
          profilePic: 'https://i.pravatar.cc/150?img=2',
          emergencyContacts: []
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthenticated(true);
        setError(null);
        return user;
      } else {
        throw new Error('Invalid user data');
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      loading,
      error,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
