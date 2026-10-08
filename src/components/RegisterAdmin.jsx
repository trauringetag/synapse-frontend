import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';

export default function RegisterAdmin() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' });
  const [adminSecret, setAdminSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // 1. Регистрируем администратора
      await api.post('/auth/register-admin', form, {
        headers: { 'X-Admin-Secret': adminSecret }
      });
      
      // 2. Сразу выполняем вход с теми же данными
      const loginRes = await api.post('/auth/login', { 
        email: form.email, 
        password: form.password 
      });
      
      // 3. Сохраняем данные в localStorage
      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('role', loginRes.data.role);
      localStorage.setItem('userName', `${loginRes.data.user.first_name} ${loginRes.data.user.last_name}`);
      
      // 4. Перенаправляем на главную (dashboard)
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка создания администратора');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="card card-admin">
      <div className="card-header">
        <h2>Регистрация Администратора</h2>
        <p>Требуется подтверждение секретным ключом</p>
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Секретный ключ администратора</label>
          <input 
            className="input input-admin" 
            value={adminSecret} 
            onChange={(e) => setAdminSecret(e.target.value)} 
            required 
            placeholder="Введите ключ из .env" 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Имя</label>
          <input className="input" value={form.first_name} onChange={handleChange('first_name')} required placeholder="Админ" />
        </div>
        <div className="form-group">
          <label className="form-label">Фамилия</label>
          <input className="input" value={form.last_name} onChange={handleChange('last_name')} required placeholder="Системы" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="input" value={form.email} onChange={handleChange('email')} required placeholder="admin@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Пароль</label>
          <input type="password" className="input" value={form.password} onChange={handleChange('password')} required minLength={6} placeholder="Минимум 6 символов" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Создание...' : 'Создать Администратора'}
        </button>
      </form>
      
      <div className="text-center">
        <Link to="/login" className="link">← Вернуться ко входу</Link>
      </div>
    </div>
  );
}