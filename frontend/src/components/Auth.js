import React, { useState } from 'react';
import './Auth.css';

function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const backendUrl = 'http://localhost:5012';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
    
    const requestBody = {
      username: formData.username,
      email: formData.email,
      passwordHash: formData.password,
      id: 0
    };

    console.log('Gönderilen endpoint:', `${backendUrl}/api/Auth/${endpoint}`);
    console.log('Gönderilen body:', requestBody);
    
    try {
      const res = await fetch(`${backendUrl}/api/Auth/${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response headers:', [...res.headers.entries()]);
      
      const contentType = res.headers.get("content-type");
      console.log('Content-Type:', contentType);
      
      if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Sunucudan JSON yanıtı alınamadı!");
      }

      const data = await res.json();
      console.log('Response data:', data);
      
      if (!res.ok) {
        setMessage(data.message || 'Bir hata oluştu');
        return;
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        onLoginSuccess(data.token);
      } else {
        setMessage(data.message);
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Hata detayı:', error);
      setMessage('Bir hata oluştu: ' + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Giriş
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Kullanıcı Adı"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <input
                type="email"
                placeholder="E-posta"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="password"
              placeholder="Şifre"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {message && <div className="auth-message">{message}</div>}

          <button type="submit" className="auth-button">
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="social-login">
          <p>veya şununla devam et:</p>
          <div className="social-buttons">
            <button className="social-button google">
              <img src="/google-icon.png" alt="Google" /> Google
            </button>
            <button className="social-button facebook">
              <img src="/facebook-icon.png" alt="Facebook" /> Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth; 