import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../api/client';
import Modal from './Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  if (role !== 'admin') return <Navigate to="/profile" replace />;

  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'confirm', variant: 'danger', title: '', message: '', userId: null });

  useEffect(() => {
    api.get('/users').then(res => { setUsersList(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${modalState.userId}`);
      setUsersList(prev => prev.filter(u => u.id !== modalState.userId));
      setModalState(prev => ({ ...prev, isOpen: false }));
    } catch (err) {
      const msg = err.response?.data?.error || 'Ошибка удаления';
      setModalState({ isOpen: true, type: 'alert', variant: msg.includes('сам себя') ? 'info' : 'danger', title: msg.includes('сам себя') ? 'Невозможно удалить' : 'Ошибка', message: msg, userId: null });
    }
  };

  if (loading) return <div className="container mx-auto flex min-h-[50vh] items-center justify-center">Загрузка...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Панель администратора</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Имя</th>
                  <th className="px-4 py-3 text-left font-medium">Фамилия</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Роль</th>
                  <th className="px-4 py-3 text-right font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((user) => (
                  <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3">#{user.id}</td>
                    <td className="px-4 py-3 font-medium">{user.first_name}</td>
                    <td className="px-4 py-3">{user.last_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3"><Badge variant={user.role === 'admin' ? 'admin' : 'user'}>{user.role}</Badge></td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="destructive" size="sm" onClick={() => setModalState({ isOpen: true, type: 'confirm', variant: 'danger', title: 'Удаление пользователя', message: `Вы уверены, что хотите удалить "${user.first_name} ${user.last_name}"?`, userId: user.id })}>
                        Удалить
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Modal isOpen={modalState.isOpen} type={modalState.type} variant={modalState.variant} title={modalState.title} message={modalState.message} onConfirm={handleDelete} onCancel={() => setModalState(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
}