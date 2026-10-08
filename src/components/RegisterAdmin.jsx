import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';

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
      await api.post('/auth/register-admin', form, { headers: { 'X-Admin-Secret': adminSecret } });
      const loginRes = await api.post('/auth/login', { email: form.email, password: form.password });
      localStorage.clear();
      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('role', loginRes.data.role);
      localStorage.setItem('userId', loginRes.data.user.id);
      localStorage.setItem('userName', `${loginRes.data.user.first_name}`);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка создания администратора');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md border-purple-500/30">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-purple-600 dark:text-purple-400">Регистрация Администратора</CardTitle>
          <CardDescription>Требуется подтверждение секретным ключом</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Секретный ключ администратора</label>
              <Input value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} required placeholder="Введите ключ из .env" className="border-purple-500/50 focus-visible:ring-purple-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm font-medium">Имя</label><Input value={form.first_name} onChange={handleChange('first_name')} required placeholder="Админ" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Фамилия</label><Input value={form.last_name} onChange={handleChange('last_name')} required placeholder="Системы" /></div>
            </div>
            <div className="space-y-2"><label className="text-sm font-medium">Email</label><Input type="email" value={form.email} onChange={handleChange('email')} required placeholder="admin@example.com" /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Пароль</label><Input type="password" value={form.password} onChange={handleChange('password')} required minLength={8} placeholder="Минимум 8 символов" /></div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>{loading ? 'Создание...' : 'Создать Администратора'}</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login" className="text-sm text-muted-foreground underline-offset-4 hover:underline">← Вернуться ко входу</Link>
        </CardFooter>
      </Card>
    </div>
  );
}