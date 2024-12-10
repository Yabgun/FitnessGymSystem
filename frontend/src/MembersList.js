import React, { useEffect, useState } from 'react';

function MembersList() {
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState('');

  const backendUrl = 'http://localhost:5012';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMembers = async () => {
      if (!token) {
        setMessage('Önce giriş yapmalısınız.');
        return;
      }

      const res = await fetch(`${backendUrl}/api/members`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        setMessage('Members çekilirken hata oluştu.');
        return;
      }

      const data = await res.json();
      setMembers(data);
    };

    fetchMembers();
  }, [token, backendUrl]);

  return (
    <div>
      <h2>Üyeler Listesi</h2>
      {message && <div>{message}</div>}
      <ul>
        {members.map(m => (
          <li key={m.id}>{m.firstName} {m.lastName} - {m.dateOfBirth}</li>
        ))}
      </ul>
    </div>
  );
}

export default MembersList;
