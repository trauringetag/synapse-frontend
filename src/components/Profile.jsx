import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const role = localStorage.getItem('role');
  const userId = parseInt(localStorage.getItem('userId'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    // 👇 Если нет токена — редирект на логин
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchProfileData();
  }, [token, userId]); // 👈 Перезагружаем данные при смене токена или userId

  const fetchProfileData = async () => {
    try {
      const res = await api.get('/users');
      
      let currentUser;
      
      // Если это админ, бэкенд вернет массив. Нам нужно найти в нем себя.
      if (role === 'admin' && Array.isArray(res.data)) {
        currentUser = res.data.find(u => u.id === userId);
        if (!currentUser) {
          // 👇 Если не нашли пользователя с таким ID — очищаем данные и редирект
          localStorage.clear();
          navigate('/login');
          return;
        }
      } else {
        // Если обычный пользователь, бэкенд вернет объект
        currentUser = res.data;
        // 👇 Проверяем, что ID совпадает
        if (currentUser.id !== userId) {
          localStorage.clear();
          navigate('/login');
          return;
        }
      }
      
      setUserData(currentUser);
    } catch (err) {
      setError('Не удалось загрузить данные профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Загрузка...</div>;
  if (!userData) return null; // Уже обработано в fetchProfileData

  const initials = `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase();

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2>Личный кабинет</h2>
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}

      <div className="user-profile-card">
        <div className="user-avatar">{initials}</div>
        <h3>{userData.first_name} {userData.last_name}</h3>
        <span className={`badge badge-${userData.role}`} style={{ marginTop: '0.5rem' }}>{userData.role}</span>
        
        <div className="user-details">
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{userData.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">ID в системе</span>
            <span className="detail-value">#{userData.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}