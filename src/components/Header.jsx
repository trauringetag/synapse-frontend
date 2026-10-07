import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userName = localStorage.getItem('userName'); // Будем сохранять имя при логине

  // Определяем активную ссылку для подсветки
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Логотип / Название */}
        <Link to="/" className="header-logo">
          Synapse API
        </Link>

        {/* Навигация */}
        <nav className="header-nav">
          {!token ? (
            // Если НЕ авторизован — показываем ссылки на вход/регистрацию
            <>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Главная
              </Link>
              <Link 
                to="/login" 
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              >
                Войти
              </Link>
              <Link 
                to="/register" 
                className={`nav-link ${isActive('/register') ? 'active' : ''}`}
              >
                Регистрация
              </Link>
            </>
          ) : (
            // Если авторизован — показываем имя и кнопку выхода
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Личный кабинет
              </Link>
              <div className="user-info">
                <span className="user-name">
                  {userName || 'Пользователь'}
                </span>
                <span className={`badge badge-${role}`}>
                  {role}
                </span>
              </div>
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