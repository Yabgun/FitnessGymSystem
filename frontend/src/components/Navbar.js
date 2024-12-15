import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isAuthenticated, user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const menuItems = [
    { to: '/', label: 'Ana Sayfa', key: 'home' },
    { to: '/members', label: 'Üyeler', key: 'members' },
    { to: '/classes', label: 'Sınıflar', key: 'classes' },
    { to: '/categories', label: 'Kategoriler', key: 'categories' },
    { to: '/instructors', label: 'Eğitmenler', key: 'instructors' },
    { to: '/schedule', label: 'Program', key: 'schedule' }
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Fitness Gym System</Link>
      </div>
      {isAuthenticated && (
        <div className="nav-links">
          {menuItems.map(item => (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              {item.label}
            </NavLink>
          ))}
          <button onClick={handleLogout} className="nav-link logout-button">
            Çıkış
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar; 