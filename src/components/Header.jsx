import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';

import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { cn } from './ui/Button';

export default function Header() {

  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userName = localStorage.getItem('userName');

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.clear();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const NavLinks = ({ mobile = false }) => (
    <>
      <Link to="/" className={cn("text-sm font-medium hover:text-primary", isActive('/') ? "text-primary" : "text-muted-foreground", mobile && "block py-2")} onClick={() => setIsMobileMenuOpen(false)}>
        Главная
      </Link>
      {!token ? (
        <>
          <Link to="/login" className={cn("text-sm font-medium hover:text-primary", isActive('/login') ? "text-primary" : "text-muted-foreground", mobile && "block py-2")} onClick={() => setIsMobileMenuOpen(false)}>
            Войти
          </Link>
          <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
            <Button size={mobile ? "default" : "sm"} className={mobile ? "w-full justify-center mt-2" : ""}>Регистрация</Button>
          </Link>
        </>
      ) : (
        <>
          {role === 'admin' && (
            <Link to="/dashboard" className={cn("text-sm font-medium hover:text-primary", isActive('/dashboard') ? "text-primary" : "text-muted-foreground", mobile && "block py-2")} onClick={() => setIsMobileMenuOpen(false)}>
              Админ-панель
            </Link>
          )}
          <Link to="/profile" className={cn("flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 hover:bg-accent", mobile && "w-full justify-between mt-2")} onClick={() => setIsMobileMenuOpen(false)}>
            <span className="text-sm font-semibold">{userName || 'Пользователь'}</span>
            <Badge variant={role === 'admin' ? 'admin' : 'user'}>{role}</Badge>
          </Link>
          <Button variant="secondary" size="sm" onClick={handleLogout} className={mobile ? "w-full justify-center mt-2" : ""}>
            Выйти
          </Button>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-2">
          <span className="bg-gradient-text bg-clip-text text-2xl font-extrabold text-transparent">Synapse</span>
        </Link>

        {/* Десктопная навигация */}
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} className="w-9 px-0">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <NavLinks />
        </nav>

        {/* Мобильная кнопка меню */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} className="w-9 h-9">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Мобильное выпадающее меню */}
      <div className={cn("md:hidden border-b border-border/40 overflow-hidden transition-all duration-300 ease-in-out", isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0")}>
        <nav className="container mx-auto flex flex-col gap-2 p-4">
          <NavLinks mobile={true} />
        </nav>
      </div>
    </header>
  );

}