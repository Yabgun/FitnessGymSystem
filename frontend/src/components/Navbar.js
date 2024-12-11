import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        Fitness Gym System
      </div>
      <ul className="nav-links">
        <li><Link to="/">Ana Sayfa</Link></li>
        <li><Link to="/members">Üyeler</Link></li>
        <li><Link to="/classes">Sınıflar</Link></li>
        <li><Link to="/categories">Kategoriler</Link></li>
        <li><Link to="/instructors">Eğitmenler</Link></li>
        <li><Link to="/schedule">Program</Link></li>
        <li><button onClick={onLogout} className="logout-button">Çıkış Yap</button></li>
      </ul>
    </nav>
  );
}

export default Navbar; 