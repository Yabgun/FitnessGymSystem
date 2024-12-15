import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import '../../styles/common.css';

function InstructorsList() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await axios.get('/api/Instructors');
      if (Array.isArray(response.data)) {
        setInstructors(response.data);
      } else {
        setError('Veri formatı geçersiz');
        console.error('Invalid data format:', response.data);
      }
    } catch (error) {
      setError('Eğitmenler yüklenirken bir hata oluştu');
      console.error('Error fetching instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('Invalid instructor ID');
      return;
    }

    if (window.confirm('Bu eğitmeni silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/Instructors/${id}`);
        await fetchInstructors();
      } catch (error) {
        console.error('Error deleting instructor:', error);
        alert('Eğitmen silinirken bir hata oluştu');
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
        <h1>Eğitmenler</h1>
        <button onClick={() => navigate('/instructors/add')} className="button button-primary">
          Yeni Eğitmen Ekle
        </button>
      </div>
      <div className="grid-container">
        {instructors.length === 0 ? (
          <div className="no-data">Henüz eğitmen bulunmamaktadır.</div>
        ) : (
          instructors.map((instructor) => (
            <div key={instructor?.id || Math.random()} className="card">
              <h2>{instructor?.firstName || 'İsimsiz'} {instructor?.lastName || ''}</h2>
              <div className="instructor-details">
                {instructor?.specialization && (
                  <p><strong>Uzmanlık:</strong> {instructor.specialization}</p>
                )}
                {instructor?.email && (
                  <p><strong>Email:</strong> {instructor.email}</p>
                )}
                {instructor?.phone && (
                  <p><strong>Telefon:</strong> {instructor.phone}</p>
                )}
              </div>
              <div className="card-actions">
                <button
                  onClick={() => instructor?.id && navigate(`/instructors/edit/${instructor.id}`)}
                  className="button button-secondary"
                  disabled={!instructor?.id}
                >
                  Düzenle
                </button>
                <button
                  onClick={() => instructor?.id && handleDelete(instructor.id)}
                  className="button button-danger"
                  disabled={!instructor?.id}
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default InstructorsList; 