import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';

export default function RegisterAdmin() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });
  const [adminSecret, setAdminSecret] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/register-admin', form, {
        headers: { 'X-Admin-Secret': adminSecret }
      });
      setSuccess('Администратор успешно создан! Перенаправляем на вход...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка создания администратора');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  return (
    <div className="form-container" style={{ border: '2px solid #f44336' }}>
      <h2>Регистрация АДМИНИСТРАТОРА</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            placeholder="Секретный ключ администратора"
            value={adminSecret}
            onChange={(e) => setAdminSecret(e.target.value)}
            required
            style={{ borderColor: '#f44336' }}
          />
        </div>
        <div className="form-group">
          <input
            placeholder="Имя"
            value={form.first_name}
            onChange={handleChange('first_name')}
            required
          />
        </div>
        <div className="form-group">
          <input
            placeholder="Фамилия"
            value={form.last_name}
            onChange={handleChange('last_name')}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange('email')}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Пароль (мин. 6 символов)"
            value={form.password}
            onChange={handleChange('password')}
            required
            minLength={6}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Создание...' : 'Создать Администратора'}
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link to="/login">← Вернуться ко входу</Link>
      </p>
    </div>
  );
}