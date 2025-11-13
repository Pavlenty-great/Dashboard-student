import './styles/App.css';
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div>
        <Header />
        <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка...</div>
        <Footer />
      </div>
    );
  }

  // Если пользователь не авторизован - показываем формы входа/регистрации
  if (!user) {
    return <AuthForms />;
  }

  // Если пользователь авторизован - показываем дашборд
  return (
    <div>
      <HeaderWithAuth />
      <Body />
      <Footer />
    </div>
  );
}

// Компонент для форм авторизации (без Header/Footer дашборда)
function AuthForms() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      <header className='header'>
        <h2>Student Dashboard - Авторизация</h2>
      </header>
      {isLogin ? 
        <Login switchToRegister={() => setIsLogin(false)} /> : 
        <Register switchToLogin={() => setIsLogin(true)} />}
      <footer className="footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Университет "Дубна"</p>
        </div>
      </footer>
    </div>
  );
}

// Header с информацией о пользователе
function HeaderWithAuth() {
  const { user, logout } = useAuth();

  return (
    <header className='header'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h2>Student Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '16px' }}>
            {user.last_name} {user.first_name} (Группа: {user.group_number})
          </span>
          <button 
            onClick={logout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;