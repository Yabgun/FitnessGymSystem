import React, { useState } from 'react';
import Auth from './components/Auth';
import AddMember from './AddMember';
import MembersList from './MembersList';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <div>
      {!token ? (
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="dashboard">
          <nav className="dashboard-nav">
            <h1>Fitness Gym System</h1>
            <button onClick={handleLogout} className="logout-button">Çıkış Yap</button>
          </nav>
          <div className="dashboard-content">
            <MembersList />
            <AddMember />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
