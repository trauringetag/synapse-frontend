import { Link } from 'react-router-dom';
import { Shield, Users, Zap, Container } from 'lucide-react';
import { Button } from './ui/Button';

export default function Home() {
  const features = [
    { icon: <Shield className="h-8 w-8 text-primary" />, title: 'JWT-аутентификация', desc: 'Безопасные токены с автоматическим обновлением и защитой от несанкционированного доступа' },
    { icon: <Users className="h-8 w-8 text-primary" />, title: 'Ролевая модель', desc: 'Разграничение прав между администраторами и обычными пользователями' },
    { icon: <Zap className="h-8 w-8 text-primary" />, title: 'Высокая производительность', desc: 'Go-бэкенд с PostgreSQL обеспечивает молниеносную скорость отклика' },
    { icon: <Container className="h-8 w-8 text-primary" />, title: 'Docker-контейнеризация', desc: 'Простое развертывание и масштабирование в любой среде' },
  ];

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Добро пожаловать в <span className="bg-gradient-text bg-clip-text text-transparent">Synapse</span>
        </h1>
        <p className="mt-6 text-xl text-muted-foreground">
          Современная демонстрационная платформа с безопасной JWT-аутентификацией и гибкой ролевой моделью.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/register"><Button size="lg">Начать работу</Button></Link>
          <Link to="/login"><Button variant="outline" size="lg">Войти</Button></Link>
        </div>
      </div>
      <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">{f.icon}</div>
            <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}