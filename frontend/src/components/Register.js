import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const Register = ({ switchToLogin }) => {
    const [form, setForm] = useState({
        first_name: '', last_name: '', middle_name: '',
        email: '', group_number: '', password: '', password_confirm: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Данные для регистрации:', form); // ← посмотрим что отправляется

    const result = await register(form);
    
    console.log('Ответ от сервера:', result); // ← посмотрим что пришло
    
    if (!result.success) {
        setError(result.error);
        console.log('Ошибка:', result.error); // ← детали ошибки
    }
    setLoading(false);
};

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Регистрация</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="last_name" placeholder="Фамилия" value={form.last_name} onChange={handleChange} required className="auth-input" />
                    <input type="text" name="first_name" placeholder="Имя" value={form.first_name} onChange={handleChange} required className="auth-input" />
                    <input type="text" name="middle_name" placeholder="Отчество" value={form.middle_name} onChange={handleChange} className="auth-input" />
                    <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="auth-input" />
                    <input type="text" name="group_number" placeholder="Группа (4 цифры)" value={form.group_number} onChange={handleChange} maxLength="4" required className="auth-input" />
                    <input type="password" name="password" placeholder="Пароль" value={form.password} onChange={handleChange} required className="auth-input" />
                    <input type="password" name="password_confirm" placeholder="Подтвердите пароль" value={form.password_confirm} onChange={handleChange} required className="auth-input" />
                    
                    {error && <div className="auth-error">{error}</div>}
                    
                    <button type="submit" disabled={loading} className="auth-button">
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>
                <button onClick={switchToLogin} className="auth-switch-button">
                    Уже есть аккаунт? Войти
                </button>
            </div>
        </div>
    );
};

export default Register;