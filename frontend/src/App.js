import React, { useState } from 'react';
import AddMember from './AddMember';
import MembersList from './MembersList'; 

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  const backendUrl = 'http://localhost:5012';

  const handleLogin = async () => {
    const res = await fetch(`${backendUrl}/api/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, passwordHash: password, id: 0, email: "string" })
    });
    console.log("res",res)
    if (!res.ok) {
      setMessage('Giriş başarısız. Kullanıcı adı veya şifre hatalı.');
      return;
    }
    const data = await res.json();
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setMessage('Giriş başarılı!');
  }

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setMessage('');
  }

  return (
    <div style={{ padding: '20px' }}>
      {!token ? (
        <div>
          <h1>Giriş Yap</h1>
          <input
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={e => setUsername(e.target.value)}
          /><br />
          <input
            placeholder="Şifre"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          /><br />
          <button onClick={handleLogin}>Giriş</button>
          <div>{message}</div>
        </div>
      ) : (
        <div>
          <h1>Hoşgeldiniz!</h1>
          <p>Token: {token}</p>
          <button onClick={handleLogout}>Çıkış Yap</button>
          <div>{message}</div>
          <hr />
          {/* Giriş yapıldıktan sonra MembersList bileşenini göster */}
          <MembersList />
          {/* Üyeler listelendiğinde, yeni üye ekleme formunu da göster */}
          <AddMember />
        </div>
      )}
    </div>
  );
}

export default App;
