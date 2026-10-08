import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';

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
      await api.post('/auth/register', form);
      const loginRes = await api.post('/auth/login', { email: form.email, password: form.password });
      localStorage.clear();
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
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
          <CardDescription>Создайте новый аккаунт</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm font-medium">Имя</label><Input value={form.first_name} onChange={handleChange('first_name')} required placeholder="Иван" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Фамилия</label><Input value={form.last_name} onChange={handleChange('last_name')} required placeholder="Иванов" /></div>
            </div>
            <div className="space-y-2"><label className="text-sm font-medium">Email</label><Input type="email" value={form.email} onChange={handleChange('email')} required placeholder="name@example.com" /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Пароль</label><Input type="password" value={form.password} onChange={handleChange('password')} required minLength={8} placeholder="Минимум 8 символов" /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Регистрация...' : 'Зарегистрироваться'}</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">Уже есть аккаунт? <Link to="/login" className="text-primary underline-offset-4 hover:underline">Войти</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}