import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userName = localStorage.getItem('userName');

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          Synapse
        </Link>

        <nav className="header-nav">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={theme === 'light' ? 'Темная тема' : 'Светлая тема'}
          >
            <span>{theme === 'light' ? '🌙' : '☀️'}</span>
          </button>

          {!token ? (
            <>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                Главная
              </Link>
              <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
                Войти
              </Link>
              <Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`}>
                Регистрация
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="nav-link">
                <div className="user-info">
                  <span className="user-name">{userName || 'Пользователь'}</span>
                  <span className={`badge badge-${role}`}>{role}</span>
                </div>
              </Link>

              {role === 'admin' && (
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                  Панель администратора
                </Link>
              )}

              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Выйти
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}