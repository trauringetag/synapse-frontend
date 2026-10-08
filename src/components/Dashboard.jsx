import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../api/client';
import Modal from './Modal';

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  // Защита: если это не админ, отправляем его в профиль
  if (role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  const [usersList, setUsersList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [modalState, setModalState] = useState({
    isOpen: false, type: 'confirm', variant: 'danger',
    title: '', message: '', userId: null, userName: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/users');
      setUsersList(res.data);
    } catch (err) {
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (user) => {
    setModalState({
      isOpen: true, type: 'confirm', variant: 'danger',
      title: 'Удаление пользователя',
      message: `Вы уверены, что хотите удалить "${user.first_name} ${user.last_name}"?`,
      userId: user.id, userName: `${user.first_name} ${user.last_name}`
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/users/${modalState.userId}`);
      fetchData();
      closeModal();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Ошибка удаления';
      setModalState({
        isOpen: true, type: 'alert', variant: errorMsg.includes('сам себя') ? 'info' : 'danger',
        title: errorMsg.includes('сам себя') ? 'Невозможно удалить' : 'Ошибка',
        message: errorMsg, userId: null, userName: ''
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Загрузка...</div>;

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
                  <button className="btn btn-danger" onClick={() => openDeleteModal(user)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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