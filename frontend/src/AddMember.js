import React, { useState } from 'react';
import axios from './services/axiosConfig';

function AddMember() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!firstName.trim()) {
      setMessage('Ad alanı zorunludur');
      return false;
    }
    if (!lastName.trim()) {
      setMessage('Soyad alanı zorunludur');
      return false;
    }
    if (!dateOfBirth) {
      setMessage('Doğum tarihi zorunludur');
      return false;
    }
    return true;
  };

  const handleAddMember = async () => {
    try {
      setLoading(true);
      setMessage('');

      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Önce giriş yapmalısınız.');
        return;
      }

      if (!validateForm()) {
        return;
      }

      // Tarih validasyonu
      const selectedDate = new Date(dateOfBirth);
      const currentDate = new Date();
      if (selectedDate > currentDate) {
        setMessage('Doğum tarihi bugünden ileri bir tarih olamaz.');
        return;
      }

      const response = await axios.post('/api/members', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth,
        selectedClasses: []
      });

      console.log('Üye ekleme başarılı:', response.data);
      setMessage('Üye başarıyla eklendi!');
      
      // Ekleme başarılı olduktan sonra formu sıfırlayalım
      setFirstName('');
      setLastName('');
      setDateOfBirth('');
    } catch (error) {
      console.error('Üye ekleme hatası:', error);
      const errorMessage = error.response?.data?.message || 'Üye eklenirken bir hata oluştu';
      const errorDetail = error.response?.data?.error || '';
      setMessage(`${errorMessage}${errorDetail ? `: ${errorDetail}` : ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Yeni Üye Ekle</h3>
      <div style={{ marginBottom: '10px' }}>
        <input 
          placeholder="Ad"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          disabled={loading}
          style={{ padding: '5px', marginBottom: '5px' }}
        /><br />
        <input 
          placeholder="Soyad"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          disabled={loading}
          style={{ padding: '5px', marginBottom: '5px' }}
        /><br />
        <input 
          type="date"
          value={dateOfBirth}
          max={new Date().toISOString().split('T')[0]}
          onChange={e => setDateOfBirth(e.target.value)}
          disabled={loading}
          style={{ padding: '5px', marginBottom: '5px' }}
        /><br />
        <button 
          onClick={handleAddMember} 
          disabled={loading}
          style={{ 
            padding: '8px 15px',
            backgroundColor: loading ? '#cccccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Ekleniyor...' : 'Ekle'}
        </button>
      </div>
      {message && (
        <div style={{ 
          color: message.includes('başarı') ? 'green' : 'red',
          padding: '10px',
          marginTop: '10px',
          backgroundColor: message.includes('başarı') ? '#e8f5e9' : '#ffebee',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default AddMember;
