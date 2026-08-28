import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('agrishield_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agrishield_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('agrishield_token') && localStorage.getItem('agrishield_user')));

  const [authLoading, setAuthLoading] = useState(true);

  // Initialize and verify authentication state on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('agrishield_token');
    const savedUser = localStorage.getItem('agrishield_user');

    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setToken(savedToken);
        setIsAuthenticated(true);
      } catch (e) {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setAuthLoading(false);
  }, []);

  const login = async (emailOrPhone, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrPhone, phone: emailOrPhone, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token || 'demo-jwt-token');
        setIsAuthenticated(true);
        localStorage.setItem('agrishield_user', JSON.stringify(data.user));
        localStorage.setItem('agrishield_token', data.token || 'demo-jwt-token');
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Invalid email or password.' };
    } catch (err) {
      console.warn('Network error during login:', err);
      return { success: false, message: 'Unable to connect to the server. Please try again.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token || 'demo-jwt-token');
        setIsAuthenticated(true);
        localStorage.setItem('agrishield_user', JSON.stringify(data.user));
        localStorage.setItem('agrishield_token', data.token || 'demo-jwt-token');
        return { success: true, user: data.user, message: data.message };
      }
      return { success: false, message: data.message || 'Unable to create your account. Please check your information.' };
    } catch (err) {
      console.warn('Network error during registration:', err);
      return { success: false, message: 'Unable to connect to the server. Please try again.' };
    }
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('agrishield_token');
    localStorage.removeItem('agrishield_user');
  };

  const updateProfile = async (updatedFields) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('agrishield_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
    } catch (err) {
      console.warn('Failed to update server profile, saving locally:', err);
    }
    const localUpdated = { ...user, ...updatedFields };
    setUser(localUpdated);
    localStorage.setItem('agrishield_user', JSON.stringify(localUpdated));
    return { success: true, user: localUpdated };
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      authLoading,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
