import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Настройка axios
  axios.defaults.baseURL = 'http://localhost:8000';
  axios.defaults.withCredentials = true;
  axios.defaults.xsrfHeaderName = 'X-CSRFToken';
  axios.defaults.xsrfCookieName = 'csrftoken';

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/check-auth/');
      if (response.data.authenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log('Не авторизован');
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const register = async (formData) => {
    try {
      await axios.post('/api/register/', formData);
      await checkAuth();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Ошибка регистрации' 
      };
    }
  };

  const login = async (email, password) => {
    try {
      await axios.post('/api/login/', { email, password });
      await checkAuth();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Ошибка входа' 
      };
    }
  };

  const logout = async () => {
    try {
        // Используем GET вместо POST для выхода
        await axios.get('/api/logout/');
        setUser(null);
    } catch (error) {
        console.error('Logout error:', error);
        // Все равно сбрасываем пользователя на фронтенде
        setUser(null);
    }
  };

  const value = {
    user,
    register,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};