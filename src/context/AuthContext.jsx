import React, { createContext, useContext, useState, useEffect } from 'react';

// Create AuthContext
const AuthContext = createContext();

// Create a Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Function to log in the user
  const login = (loginResponse) => {
    try {
      const { token, user: userData } = loginResponse;
      
      // Validate required data
      if (!token || !userData) {
        throw new Error('Invalid login response data');
      }

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Function to log out the user
  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  // Get current auth token
  const getToken = () => localStorage.getItem('token');

  // Check if user is authenticated
  const checkAuth = () => {
    return isAuthenticated && !!getToken();
  };

  // Context value
  const value = {
    user,
    setUser,
    login,
    logout,
    isAuthenticated,
    isLoading,
    getToken,
    checkAuth
  };

  // Don't render children until initial auth check is complete
  if (isLoading) {
    return null; // Or return a loading spinner component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for Consuming Context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};