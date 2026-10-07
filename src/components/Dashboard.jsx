import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Dashboard() {
  const [usersList, setUsersList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/users');
      if (role === 'admin') {
        setUsersList(res.data);
      } else {
        setCurrentUser(res.data);
      }
    } catch (err) {
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка удаления');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Загрузка данных...</div>;

  // Рендер для АДМИНА
  if (role === 'admin') {
    return (
      <div className="container">
        <div className="dashboard-header">
          <h2>Панель администратора</h2>
          <button onClick={handleLogout} className="btn btn-secondary">Выйти</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.email}</td>
                  <td><span className={`badge badge-${user.role}`}>{user.role}</span></td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Рендер для ПОЛЬЗОВАТЕЛЯ (Карточка)
  if (currentUser) {
    const initials = `${currentUser.first_name[0]}${currentUser.last_name[0]}`.toUpperCase();
    return (
      <div className="container">
        <div className="dashboard-header">
          <h2>Личный кабинет</h2>
          <button onClick={handleLogout} className="btn btn-secondary">Выйти</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="user-profile-card">
          <div className="user-avatar">{initials}</div>
          <h3>{currentUser.first_name} {currentUser.last_name}</h3>
          <span className={`badge badge-${currentUser.role}`} style={{ marginTop: '0.5rem' }}>{currentUser.role}</span>
          
          <div className="user-details">
            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span className="detail-value">{currentUser.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">ID в системе</span>
              <span className="detail-value">#{currentUser.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Статус аккаунта</span>
              <span className="detail-value" style={{ color: 'var(--color-success)' }}>Активен</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}