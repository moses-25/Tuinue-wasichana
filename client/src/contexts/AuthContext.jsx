import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, apiUtils } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (apiUtils.isAuthenticated()) {
          const userData = apiUtils.getStoredUserData();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            
            // Try to verify token, but don't logout if it fails
            // This allows users to stay logged in even if the backend is temporarily unavailable
            try {
              const profileData = await authAPI.getProfile();
              if (profileData.success) {
                setUser(profileData.user);
                apiUtils.storeAuthData(localStorage.getItem('authToken'), profileData.user);
              }
            } catch (error) {
              console.error('Token validation failed, but keeping user logged in:', error);
              // Don't logout on token validation failure - keep using stored user data
              // This prevents users from being logged out due to temporary backend issues
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Only logout if there's no stored user data
        if (!apiUtils.getStoredUserData()) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        const { token, user: userData } = response;
        
        // Store auth data
        apiUtils.storeAuthData(token, userData);
        
        // Update state
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.success) {
        const { token, user: newUser } = response;
        
        // Store auth data
        apiUtils.storeAuthData(token, newUser);
        
        // Update state
        setUser(newUser);
        setIsAuthenticated(true);
        
        return { success: true, user: newUser };
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Add a method to manually logout (for when user clicks logout button)
  const forceLogout = () => {
    logout();
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    apiUtils.storeAuthData(localStorage.getItem('authToken'), updatedUserData);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    forceLogout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};