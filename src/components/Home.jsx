export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">
          Добро пожаловать в <span className="text-primary">Synapse</span>
        </h1>
        
        <p className="home-description">
          Современная демонстрационная платформа с безопасной JWT-аутентификацией 
          и гибкой ролевой моделью.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>JWT-аутентификация</h3>
            <p>Безопасные токены с автоматическим обновлением и защитой от несанкционированного доступа</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Ролевая модель</h3>
            <p>Разграничение прав между администраторами и обычными пользователями</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Высокая производительность</h3>
            <p>Go-бэкенд с PostgreSQL обеспечивает молниеносную скорость отклика</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Docker-контейнеризация</h3>
            <p>Простое развертывание и масштабирование в любой среде</p>
          </div>
        </div>

        <div className="home-cta">
          <p>Готовы начать?</p>
          <p className="home-hint">
            Используйте навигацию в шапке сайта для входа или регистрации
          </p>
        </div>
      </div>
    </div>
  );
}