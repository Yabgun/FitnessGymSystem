import React, { useState } from 'react';
import axios from '../services/axiosConfig';
import './Auth.css';

function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login işlemi
        const response = await axios.post('/api/Auth/login', {
          username: credentials.username,
          password: credentials.password
        });
        
        if (response.data && response.data.token) {
          onLoginSuccess(response.data.token);
        }
      } else {
        // Register işlemi
        const response = await axios.post('/api/Auth/register', {
          username: credentials.username,
          email: credentials.email,
          passwordHash: credentials.password
        });

        if (response.data.success) {
          setMessage('Kayıt başarılı! Giriş yapabilirsiniz.');
          setCredentials({ username: '', email: '', password: '' });
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError(isLogin ? 
        'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.' : 
        'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.'
      );
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
              setMessage('');
            }}
          >
            Giriş
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
              setMessage('');
            }}
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          
          <div className="form-group">
            <label>Kullanıcı Adı</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>E-posta</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth; 