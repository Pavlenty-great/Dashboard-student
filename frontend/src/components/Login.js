import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const Login = ({ switchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(email, password);
        if (!result.success) {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Вход в систему</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="auth-input"
                    />
                    <input 
                        type="password" 
                        placeholder="Пароль" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="auth-input"
                    />
                    
                    {error && <div className="auth-error">{error}</div>}
                    
                    <button type="submit" disabled={loading} className="auth-button">
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
                <button onClick={switchToRegister} className="auth-switch-button">
                    Нет аккаунта? Зарегистрироваться
                </button>
            </div>
        </div>
    );
};

export default Login;