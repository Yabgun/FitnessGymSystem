import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isAuthenticated, user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const menuItems = [
    { path: 'http://localhost:3000/members', label: 'Üyeler' },
    { path: 'http://localhost:3000/classes', label: 'Sınıflar' },
    { path: 'http://localhost:3000/categories', label: 'Kategoriler' },
    { path: 'http://localhost:3000/instructors', label: 'Eğitmenler' },
    { path: 'http://localhost:3000/schedule', label: 'Program' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Fitness Gym</Link>
      </div>
      <div className="navbar-menu">
        {isAuthenticated ? (
          <>
            <span className="welcome-text">
              Hoş geldin, {user?.username}
            </span>
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
              >
                {item.label}
              </Link>
            ))}
            <button 
              onClick={handleLogout} 
              className="logout-button"
            >
              Çıkış
            </button>
          </>
        ) : (
          <Link to="/login">Giriş Yap</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 