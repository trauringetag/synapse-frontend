import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Очищаем ошибку только при новой попытке входа
    setLoading(true);
    
    try {
      const res = await api.post('/auth/login', { email, password });
      
      // Очищаем старые данные перед записью новых
      localStorage.clear();
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userName', `${res.data.user.first_name} ${res.data.user.last_name}`);
      
      navigate('/profile');
    } catch (err) {
      // Показываем ошибку и НЕ очищаем форму
      const errorMessage = err.response?.data?.error || 'Ошибка входа. Проверьте email и пароль';
      setError(errorMessage);
      // Важно: НЕ сбрасываем email и password, чтобы пользователь не вводил заново
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Вход в систему</h2>
        <p>Введите свои данные для доступа к аккаунту</p>
      </div>
      
      {/* Ошибка отображается и не исчезает */}
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="name@example.com"
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Пароль</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
      
      <div className="text-center">
        Нет аккаунта? <Link to="/register" className="link">Зарегистрироваться</Link>
      </div>
    </div>
  );
}