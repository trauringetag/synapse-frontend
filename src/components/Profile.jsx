import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/client';
import { Badge } from './ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

export default function Profile() {

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const userId = parseInt(localStorage.getItem('userId'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    const fetchProfileData = async () => {
      try {
        const res = await api.get('/users');
        let currentUser = role === 'admin' && Array.isArray(res.data) ? res.data.find(u => u.id === userId) : res.data;
        if (!currentUser || currentUser.id !== userId) { localStorage.clear(); navigate('/login'); return; }
        setUserData(currentUser);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [token, userId, role, navigate]);

  if (loading) return <div className="container mx-auto flex min-h-[50vh] items-center justify-center">Загрузка...</div>;
  if (!userData) return null;

  const initials = `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {initials}
          </div>
          <div>
            <CardTitle className="text-2xl">{userData.first_name} {userData.last_name}</CardTitle>
            <Badge variant={userData.role === 'admin' ? 'admin' : 'user'} className="mt-2">{userData.role}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <span className="font-medium text-muted-foreground">Email</span>
              <span className="col-span-2 font-semibold">{userData.email}</span>
              <span className="font-medium text-muted-foreground">ID в системе</span>
              <span className="col-span-2 font-semibold">#{userData.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

}