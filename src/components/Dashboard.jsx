import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Modal from './Modal'; // 👈 Универсальное модальное окно

export default function Dashboard() {
  const [usersList, setUsersList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // 👇 Состояние для модального окна (универсальное)
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'confirm',       // 'confirm' | 'alert'
    variant: 'danger',     // 'danger' | 'info' | 'success'
    title: '',
    message: '',
    userId: null,
    userName: ''
  });
  
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

  // 👇 Открыть окно подтверждения удаления
  const openDeleteModal = (user) => {
    setModalState({
      isOpen: true,
      type: 'confirm',
      variant: 'danger',
      title: 'Удаление пользователя',
      message: `Вы уверены, что хотите удалить пользователя "${user.first_name} ${user.last_name}"? Это действие нельзя отменить.`,
      userId: user.id,
      userName: `${user.first_name} ${user.last_name}`
    });
  };

  // 👇 Открыть окно с ошибкой/уведомлением
  const openAlertModal = (title, message, variant = 'danger') => {
    setModalState({
      isOpen: true,
      type: 'alert',
      variant: variant,
      title: title,
      message: message,
      userId: null,
      userName: ''
    });
  };

  // 👇 Закрыть модальное окно
  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: 'confirm',
      variant: 'danger',
      title: '',
      message: '',
      userId: null,
      userName: ''
    });
  };

  // 👇 Подтверждение удаления
  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/users/${modalState.userId}`);
      fetchData(); // Обновляем список
      closeModal();
    } catch (err) {
      //  Если бэкенд вернул ошибку — показываем её в модальном окне
      const errorMessage = err.response?.data?.error || 'Ошибка удаления';
      
      // Если админ пытается удалить сам себя — показываем info-модалку
      if (errorMessage.includes('сам себя') || errorMessage.includes('сам себя')) {
        openAlertModal(
          'Невозможно удалить', 
          errorMessage, 
          'info'
        );
      } else {
        openAlertModal(
          'Ошибка удаления', 
          errorMessage, 
          'danger'
        );
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Загрузка данных...</div>;
  }

  // Рендер для АДМИНА
  if (role === 'admin') {
    return (
      <div className="container">
        <div className="dashboard-header">
          <h2>Панель администратора</h2>
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
                    <button 
                      className="btn btn-danger" 
                      onClick={() => openDeleteModal(user)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 👇 Универсальное модальное окно */}
        <Modal
          isOpen={modalState.isOpen}
          type={modalState.type}
          variant={modalState.variant}
          title={modalState.title}
          message={modalState.message}
          onConfirm={handleConfirmDelete}
          onCancel={closeModal}
        />
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
          </div>
        </div>
      </div>
    );
  }

  return null;
}