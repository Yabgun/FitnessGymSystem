import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import '../../styles/common.css';

function MembersList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/Members');
      console.log('Members data:', response.data);
      if (Array.isArray(response.data)) {
        setMembers(response.data);
      } else {
        console.error('Invalid data format:', response.data);
        setError('Veri formatı geçersiz');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Üyeler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('Invalid member ID');
      return;
    }

    if (window.confirm('Bu üyeyi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/Members/${id}`);
        await fetchMembers();
      } catch (error) {
        console.error('Error deleting member:', error);
        alert('Üye silinirken bir hata oluştu');
      }
    }
  };

  if (loading) {
    return <div className="page-container">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="page-container">
      <div className="error-message">{error}</div>
    </div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Üyeler</h1>
        <button 
          className="button button-primary"
          onClick={() => navigate('/members/add')}
        >
          Yeni Üye Ekle
        </button>
      </div>

      <div className="grid-container">
        {members.length === 0 ? (
          <div className="no-data">Henüz üye bulunmamaktadır.</div>
        ) : (
          members.map((member) => (
            <div key={member?.id || Math.random()} className="card">
              <h2>{member?.firstName || 'İsimsiz'} {member?.lastName || ''}</h2>
              <div className="member-details">
                {member?.email && (
                  <p><strong>Email:</strong> {member.email}</p>
                )}
                {member?.phone && (
                  <p><strong>Telefon:</strong> {member.phone}</p>
                )}
                {member?.address && (
                  <p><strong>Adres:</strong> {member.address}</p>
                )}
              </div>
              <div className="card-actions">
                <button 
                  className="button button-secondary"
                  onClick={() => member?.id && navigate(`/members/edit/${member.id}`)}
                  disabled={!member?.id}
                >
                  <i className="fas fa-edit"></i> Düzenle
                </button>
                <button 
                  className="button button-danger"
                  onClick={() => member?.id && handleDelete(member.id)}
                  disabled={!member?.id}
                >
                  <i className="fas fa-trash"></i> Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MembersList; 