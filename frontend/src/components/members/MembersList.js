import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import './Members.css';

function MembersList() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('/api/Members');
      setMembers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Üyeler yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu üyeyi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/Members/${id}`);
        fetchMembers();
      } catch (err) {
        setError('Üye silinirken bir hata oluştu');
      }
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="members-list-container">
      <div className="list-header">
        <h2>Üyeler</h2>
        <button onClick={() => navigate('/members/add')} className="add-button">
          Yeni Üye Ekle
        </button>
      </div>

      <div className="members-table-container">
        <table className="members-table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Soyad</th>
              <th>Doğum Tarihi</th>
              <th>Katıldığı Sınıflar</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td>{member.firstName}</td>
                <td>{member.lastName}</td>
                <td>{new Date(member.dateOfBirth).toLocaleDateString('tr-TR')}</td>
                <td>
                  {member.memberClasses?.map(mc => mc.class?.name).join(', ') || '-'}
                </td>
                <td className="action-buttons">
                  <button 
                    onClick={() => navigate(`/members/edit/${member.id}`)}
                    className="edit-button"
                  >
                    Düzenle
                  </button>
                  <button 
                    onClick={() => handleDelete(member.id)}
                    className="delete-button"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MembersList; 