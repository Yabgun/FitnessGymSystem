import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import '../../styles/common.css';

function MembersList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('/api/Members');
      setMembers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching members:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu üyeyi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/Members/${id}`);
        fetchMembers();
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  if (loading) {
    return <div className="page-container">Yükleniyor...</div>;
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
        {members.map(member => (
          <div key={member.id} className="card">
            <h2>{member.firstName} {member.lastName}</h2>
            <p>Doğum Tarihi: {new Date(member.dateOfBirth).toLocaleDateString()}</p>
            
            <div className="card-classes">
              <h3>Katıldığı Sınıflar:</h3>
              <ul>
                {member.memberClasses?.map(mc => (
                  <li key={mc.classId}>{mc.class?.className}</li>
                ))}
              </ul>
            </div>

            <div className="card-actions">
              <button 
                className="button button-secondary"
                onClick={() => navigate(`/members/edit/${member.id}`)}
              >
                Düzenle
              </button>
              <button 
                className="button button-danger"
                onClick={() => handleDelete(member.id)}
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MembersList; 