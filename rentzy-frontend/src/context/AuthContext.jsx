import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Validate stored token with backend
  const validateStoredToken = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  };

  // Initialize auth state from localStorage on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('authUser');
        const savedRefreshToken = localStorage.getItem('refreshToken');
        
        if (savedToken && savedUser) {
          // Validate token with backend
          const validUser = await validateStoredToken(savedToken);
          
          if (validUser) {
            const userData = JSON.parse(savedUser);
            setToken(savedToken);
            setUser(userData);
            setRefreshToken(savedRefreshToken);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            localStorage.removeItem('refreshToken');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Enhanced login function
  const login = (userData, authToken, refreshTokenValue = null) => {
    try {
      const token = authToken || userData.accessToken || userData.token;
      const refresh = refreshTokenValue || userData.refreshToken;
      
      if (!token) {
        throw new Error('No authentication token provided');
      }

      const userInfo = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        isEmailVerified: userData.isEmailVerified || true
      };

      setUser(userInfo);
      setToken(token);
      setRefreshToken(refresh);
      setIsAuthenticated(true);
      
      // Persist to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(userInfo));
      if (refresh) {
        localStorage.setItem('refreshToken', refresh);
      }
      
      console.log('User logged in successfully:', userInfo.email, 'Role:', userInfo.role);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to process login');
    }
  };

  // Logout function with cleanup
  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('refreshToken');
    
    console.log('User logged out successfully');
  };

  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('http://localhost:5000/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: storedRefreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.accessToken);
        localStorage.setItem('authToken', data.accessToken);
        return data.accessToken;
      } else {
        logout();
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      throw error;
    }
  };

  // Get authorization header for API requests
  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Role checking functions
  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isTenant = () => {
    return user?.role === 'tenant';
  };

  const isHomeowner = () => {
    return user?.role === 'homeowner';
  };

  // Get role-specific home route
  const getHomeRoute = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'tenant':
        return '/tenant-home';
      case 'homeowner':
        return '/owner-home';
      default:
        return '/';
    }
  };

  const authContextValue = {
    user,
    token,
    refreshToken,
    loading,
    isAuthenticated,
    login,
    logout,
    getAuthHeader,
    hasRole,
    isAdmin,
    isTenant,
    isHomeowner,
    getHomeRoute,
    refreshAccessToken
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
