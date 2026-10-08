import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';

export default function Register() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Регистрируем пользователя
      await api.post('/auth/register', form);

      // 2. Сразу выполняем вход с теми же данными
      const loginRes = await api.post('/auth/login', {
        email: form.email,
        password: form.password
      });

      localStorage.clear();

      // 3. Сохраняем данные в localStorage
      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('role', loginRes.data.role);
      localStorage.setItem('userId', loginRes.data.user.id);
      localStorage.setItem('userName', `${loginRes.data.user.first_name} ${loginRes.data.user.last_name}`);

      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2>Регистрация</h2>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Имя</label>
            <input className="input" value={form.first_name} onChange={handleChange('first_name')} required placeholder="Иван" />
          </div>
          <div className="form-group">
            <label className="form-label">Фамилия</label>
            <input className="input" value={form.last_name} onChange={handleChange('last_name')} required placeholder="Иванов" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="input" value={form.email} onChange={handleChange('email')} required placeholder="name@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Пароль</label>
            <input type="password" className="input" value={form.password} onChange={handleChange('password')} required minLength={8} placeholder="Минимум 8 символов" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="text-center">
          Уже есть аккаунт? <Link to="/login" className="link">Войти</Link>
        </div>
      </div>
    </div>
  );
}