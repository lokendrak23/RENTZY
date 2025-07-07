import React, { createContext, useState, useContext } from 'react';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initially, no user is logged in

  // This function will be called from your Login page
  const login = (userData) => {
    // In a real app, you'd get this from your API after login
    // For now, we'll assume userData is an object like { username: '...', role: 'tenant' }
    setUser({
      username: userData.username,
      role: userData.role 
    });
  };

  const logout = () => {
    setUser(null);
  };

  // The values to be shared with consuming components
  const authContextValue = {
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easy access to the context
export const useAuth = () => {
  return useContext(AuthContext);
};
