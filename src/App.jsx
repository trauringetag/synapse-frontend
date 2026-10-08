import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import RegisterAdmin from './components/RegisterAdmin';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';

function ProtectedRoute({ children }) {

  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;

}

function App() {

  const [theme, setTheme] = useState('light');

  // Применяем сохраненную тему при загрузке
  useEffect(() => {

    const savedTheme = localStorage.getItem('theme') || 'light';

    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

  }, []);

  return (
    <Router>

      <Header />

      <main className="main-content">

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/admin-panel" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>

      </main>

    </Router>
  );
}

export default App;