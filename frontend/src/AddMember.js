import React, { useState } from 'react';

function AddMember() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [message, setMessage] = useState('');

  const backendUrl = 'http://localhost:5012';
  const token = localStorage.getItem('token');

  const handleAddMember = async () => {
    if (!token) {
      setMessage('Önce giriş yapmalısınız.');
      return;
    }

    const res = await fetch(`${backendUrl}/api/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id: 0,
        firstName,
        lastName,
        dateOfBirth,
        memberClasses: ["string"]
      })
    });

    if (!res.ok) {
      setMessage('Üye eklenirken hata oluştu.');
      return;
    }

    setMessage('Üye başarıyla eklendi!');
    // Ekleme başarılı olduktan sonra formu sıfırlayalım
    setFirstName('');
    setLastName('');
    setDateOfBirth('');
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Yeni Üye Ekle</h3>
      <input placeholder="Ad"
        value={firstName}
        onChange={e => setFirstName(e.target.value)} /><br />
      <input placeholder="Soyad"
        value={lastName}
        onChange={e => setLastName(e.target.value)} /><br />
      <input type="date"
        value={dateOfBirth}
        onChange={e => setDateOfBirth(e.target.value)} /><br />
      <button onClick={handleAddMember}>Ekle</button>
      <div>{message}</div>
    </div>
  );
}

export default AddMember;
