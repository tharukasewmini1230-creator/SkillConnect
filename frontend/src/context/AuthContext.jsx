import { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    const response = await API.post('/auth/register', { name, email, password });
    const data = response.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const data = response.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  // Google Login — accepts either credential (ID token) OR access_token
  const googleLogin = async (tokenData) => {
    // tokenData can be:
    //   - a string (access_token or credential)  → old call signature
    //   - an object with { credential } or { access_token }
    let payload;
    if (typeof tokenData === 'string') {
      // Detect if it looks like a JWT (contains 2 dots) → credential, else access_token
      if (tokenData.split('.').length === 3) {
        payload = { credential: tokenData };
      } else {
        payload = { access_token: tokenData };
      }
    } else {
      payload = tokenData;
    }

    const response = await API.post('/auth/google', payload);
    const data = response.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await API.put('/auth/profile', profileData);
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('updateProfile error:', err);
      throw err;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await API.get('/auth/me');
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Error refreshing user:', err);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, googleLogin, logout, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;